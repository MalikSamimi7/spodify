const EmailVerificationToken = require("../models/emailVerificationToken");
const { MAILTRAP_USER, MAILTRAP_PASS } = require("./variables");
const nodemailer = require("nodemailer");

const sendVerificationMail = async (token, profile) => {
  const { userId, name, email } = profile;

  const verificationToken = await EmailVerificationToken.create({
    owner: userId,
    token,
  });

  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: MAILTRAP_USER,
      pass: MAILTRAP_PASS,
    },
  });

  transport.sendMail({
    to: email,
    from: "developer@mail.com",
    html: `<h1>${token}</h1>`,
  });
};

module.exports = sendVerificationMail;
