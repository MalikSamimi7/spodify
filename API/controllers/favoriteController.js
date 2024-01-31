const { isValidObjectId } = require("mongoose");
const Audio = require("../models/audio");
const Favorite = require("../models/favorite");

const toggleFavorite = async (req, res) => {
  const audioId = req.query.audioId;
  const userId = req.user.userId;
  let status;
  if (!isValidObjectId(audioId))
    return res.status(422).json({ error: "audio id is invalid" });

  const audio = await Audio.findById(audioId);
  if (!audio) return res.status(404).json({ error: "record not found" });

  const alreadyExist = await Favorite.findOne({
    owner: userId,
    items: audioId,
  });
  if (alreadyExist) {
    await Favorite.updateOne(
      { owner: userId },
      {
        $pull: { items: audioId },
      }
    );
    status = "removed";
  } else {
    const favoriteList = await Favorite.findOne({ owner: userId });
    if (favoriteList) {
      await Favorite.updateOne(
        { owner: userId },
        {
          $addToSet: { items: audioId },
        }
      );
    } else {
      await Favorite.create({ owner: userId, items: [audioId] });
    }
    status = "added";
  }

  if (status === "added") {
    await Audio.findByIdAndUpdate(audioId, {
      $addToSet: { likes: userId },
    });
  }
  if (status === "removed") {
    await Audio.findByIdAndUpdate(audioId, {
      $pull: { likes: userId },
    });
  }
  res.json({ status });
};

const getFavorites = async (req, res) => {
  const userId = req.user.userId;

  const favorite = await Favorite.findOne({ owner: userId }).populate({
    path: "items",
    populate: { path: "owner" },
  });
  if (!favorite)
    return res.status(422).json({ error: "no favorite audio found" });
  const audios = favorite.items.map((item) => {
    return {
      id: item._id,
      title: item.title,
      category: item.category,
      file: item.file.url,
      poster: item.poster?.url,
      owner: { id: item.owner._id, name: item.owner.name },
    };
  });
  res.json({ favorite: audios });
};

const isFav = async (req, res) => {
  const { audioId } = req.query;

  if (!isValidObjectId(audioId))
    return res.status(404).json({ error: "invalid audio id" });

  const favorite = await Favorite.findOne({
    owner: req.user.userId,
    items: audioId,
  });

  res.json({ result: favorite ? true : false });
};

module.exports = { toggleFavorite, getFavorites, isFav };
