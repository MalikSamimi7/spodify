const { Router } = require("express");
const isAuth = require("../middleware/isAuth");
const fileParser = require("../middleware/fileParser");
const validater = require("../middleware/validator");
const { audioValidationSchema } = require("../utils/schemaValidation");
const { createAudio, updateAudio } = require("../controllers/audioController");
const isVerified = require("../middleware/isVerified");

const router = Router();

router.post(
  "/create",
  isAuth,
  isVerified,
  fileParser,
  validater(audioValidationSchema),
  createAudio
);
router.patch(
  "/:audioId",
  isAuth,
  isVerified,
  fileParser,
  validater(audioValidationSchema),
  updateAudio
);

module.exports = router;
