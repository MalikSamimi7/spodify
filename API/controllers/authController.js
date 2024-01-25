const User = require("../models/user");
const nodemailer = require("nodemailer");
const {
  MAILTRAP_PASS,
  MAILTRAP_USER,
  JWT_SECRET,
} = require("../utils/variables");
const { generateToken } = require("../utils/helper");
const EmailVerificationToken = require("../models/emailVerificationToken");
const sendVerificationMail = require("../utils/mail");
const jwt = require("jsonwebtoken");

const create = async (req, res, next) => {
  const { name, password, email } = req.body;
  console.log(name);
  const newUser = new User({
    name: name,
    email: email,
    password: password,
  });

  const token = generateToken();

  sendVerificationMail(token, {
    userId: newUser._id,
    name: newUser.name,
    email: newUser.email,
  });
  // verificationToken.compareToken()
  console.log(token);
  try {
    newUser.save();

    res
      .status(201)
      .send({ user: { userId: newUser._id, email: newUser.email } });
  } catch (error) {
    res.status(422).send({ error: error });
  }
};

const verifyEmail = async (req, res) => {
  const { token, userId } = req.body;
  const verificationToken = await EmailVerificationToken.findOne({
    owner: userId,
  });
  if (!verificationToken)
    return res.status(403).json({ error: "invalid token" });

  const match = verificationToken.compareToken(token);
  if (!match) return res.status(403).json({ error: "invalid token" });

  await User.findByIdAndUpdate(userId, { verified: true });
  await EmailVerificationToken.findByIdAndDelete(verificationToken._id);

  res.json({ message: "your email verified" });
};

const reverifyEmail = async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(403).json({ error: "invalid user" });
  await EmailVerificationToken.findOneAndDelete({ owner: userId });

  const token = generateToken();

  await EmailVerificationToken.create({
    owner: userId,
    token,
  });

  ///send mail

  sendVerificationMail(token, {
    name: user.name,
    email: user.email,
    userId: user._id,
  });

  res.json({ message: "check your email" });
};

const verifyUserByMail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(403).json({ error: "no account found" });

  await EmailVerificationToken.findOneAndDelete({ owner: user._id });

  const token = generateToken();
  await sendVerificationMail(token, {
    userId: user._id,
    name: user.name,
    email: user.email,
  });

  res.json({ message: "please check your mail" });
};

const resetPassword = async (req, res) => {
  const { userId, password } = req.body;

  const user = await User.findByIdAndUpdate(userId, { password });
  if (!user) return res.status(403).json({ error: "invalid user" });

  const match = await user.comparePassword(password);
  //console.log(match);
  if (match)
    return res.status(403).json({ error: "old password can't be used" });

  return res.json({ message: "password updated" });
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(403).json({ error: "invalid credintials" });

  const match = await user.comparePassword(password);
  if (!match) return res.status(403).json({ error: "invalid credintials" });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET);
  user.tokens.push(token);

  user.save();

  res.json({ user: { userId: user._id, token } });
};

const updateAccount = async (req, res) => {
  const { name } = req.body;

  const avatar = req.files?.avatar;
  const user = await User.findById(req.user.userId);
  if (!user) throw new Error("user not found");

  if (typeof name !== "string")
    return res.status(422).json({ error: "invalid name" });
  if (name.trim().length < 3)
    return res.status(422).json({ error: "invalid name" });

  user.name = name;

  if (avatar) {
    user.avatar = { url: "secure_url", publicId: "public_id" };
  }

  await user.save();

  res.json({ message: "account updated", avatar: user.avatar });
};

const sendProfile = (req, res) => {
  res.json({ profile: req.user });
};

module.exports = {
  create,
  verifyEmail,
  reverifyEmail,
  verifyUserByMail,
  resetPassword,
  signIn,
  updateAccount,
  sendProfile,
};
