const User = require("../models/user");

const isVerified = async (req, res, next) => {
  if (!req.user.verified)
    return res.status(403).json({ error: "account not verified" });

  next();
};

module.exports = isVerified;
