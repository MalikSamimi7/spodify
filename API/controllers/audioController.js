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

module.exports = { createAudio };
