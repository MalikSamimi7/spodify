const EmailVerificationToken = require("../models/emailVerificationToken");

const verifyMailedToken = () => {
  return async (req, res, next) => {
    const { token, userId } = req.body;

    const verificationToken = await EmailVerificationToken.findOne({
      owner: userId,
    });
    if (!verificationToken) {
      return res.status(403).json({ error: "invalid token" });
    }
    const match = await verificationToken.compareToken(token);

    if (!match) return res.status(403).json({ error: "invalid token match" });

    await EmailVerificationToken.findOneAndDelete({ owner: userId });
    next();
  };
};

module.exports = verifyMailedToken;
