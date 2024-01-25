const { verify, JsonWebTokenError } = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/variables");
const User = require("../models/user");
const { formatProfile } = require("../utils/helper");

const isAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization)
    return res.status(403).json({ error: "unauthorized request" });

  const token = authorization.split("Bearer ")[1];
  if (!token) return res.status(403).json({ error: "unauthorized request" });

  try {
    const payload = verify(token, JWT_SECRET);

    const id = payload.userId;

    const user = await User.findById(id);
    if (!user) return res.status(403).json({ error: "unauthorized request" });

    req.user = formatProfile(user);
  } catch (error) {
    if (error instanceof JsonWebTokenError)
      return res.status(404).json({ error: "unauthorized request" });
  }

  next();
};

module.exports = isAuth;
