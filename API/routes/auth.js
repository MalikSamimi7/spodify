//import { Router } from "express";
const express = require("express");

const userModel = require("../models/user");
const {
  create,
  verifyEmail,
  reverifyEmail,
  verifyUserByMail,
  resetPassword,
  signIn,
  sendProfile,
  updateAccount,
  logOut,
} = require("../controllers/authController");
const {
  userSchemaValidation,
  emailVerificationSchema,
  emailReVerificationSchema,
  verifyUserByMailVShema,
  verifyMailedTokenVSchema,
  resetPasswordVSchema,
  signInValidatinSchema,
} = require("../utils/schemaValidation");
const validater = require("../middleware/validator");
const verifyMailedToken = require("../middleware/verifyMailedToken");
const isAuth = require("../middleware/isAuth");
const user = require("../models/user");
const { verify } = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/variables");
const fileParser = require("../middleware/fileParser");

const router = express.Router();

router.post("/create", validater(userSchemaValidation), create);
router.post("/verify-email", validater(emailVerificationSchema), verifyEmail);
router.get(
  "/re-verify-email",
  validater(emailReVerificationSchema),
  reverifyEmail
);
router.get(
  "/verify-user-by-mail",
  validater(verifyUserByMailVShema),
  verifyUserByMail
);
router.post(
  "/reset-password",
  validater(resetPasswordVSchema),
  verifyMailedToken(),
  resetPassword
);

router.get("/sign-in", validater(signInValidatinSchema), signIn);

router.get("/is-auth", isAuth, sendProfile);

router.put("/update-account", isAuth, fileParser, updateAccount);

router.get("/log-out", isAuth, logOut);

module.exports = router;
