const Audio = require("../models/audio");
const cloudinary = require("../cloud/index");

const createAudio = async (req, res) => {
  const { title, about, category } = req.body;

  let file = req.files.file;
  let poster = req.files.poster;
  if (!file) return res.status(422).json({ error: "an audio is required" });

  file = file[0];

  const ownerId = req.user.userId;

  const { public_id, secure_url } = await cloudinary.uploader.upload(
    file.filepath,
    { resource_type: "video" }
  );

  const newAudio = new Audio({
    title,
    about,
    category,
    owner: ownerId,
    file: { url: secure_url, publicId: public_id },
  });

  if (poster) {
    poster = poster[0];
    const posterRes = await cloudinary.uploader.upload(poster.filepath, {
      width: 300,
      height: 300,
      crop: "thumb",
      gravity: "face",
    });

    newAudio.poster = {
      url: posterRes.secure_url,
      publicId: posterRes.public_id,
    };
  }

  await newAudio.save();

  res.status(201).json({
    audio: {
      title,
      about,
      file: newAudio.file.url,
      poster: newAudio.poster?.url,
    },
  });
};

const updateAudio = async (req, res) => {
  const { title, about, category } = req.body;
  const userId = req.user.userId;
  const audioId = req.params.audioId;
  const file = req.files.file;
  const poster = req.files.poster;

  const audio = await Audio.findOneAndUpdate(
    { owner: userId, _id: audioId },
    { title, about, category },
    { new: true }
  );
  if (!audio) return res.status(404).json({ error: "no record found" });

  if (poster) {
    if (audio.poster?.publicId) {
      await cloudinary.uploader.destroy(audio.poster.publicId);
    }

    const { public_id, secure_url } = await cloudinary.uploader.upload(
      poster[0].filepath,
      {
        height: 300,
        width: 300,
        crop: "thumb",
        gravity: "face",
      }
    );
    audio.poster = { url: secure_url, publicId: public_id };
    await audio.save();
  }
  return res.status(201).json({
    audio: {
      title,
      about,
      category,
      poster: audio.poster?.url,
      file: audio.file.url,
    },
  });
};

module.exports = { createAudio, updateAudio };
