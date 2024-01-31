const { Router } = require("express");
const isAuth = require("../middleware/isAuth");
const isVerified = require("../middleware/isVerified");
const {
  toggleFavorite,
  getFavorites,
} = require("../controllers/favoriteController");

const router = Router();
router.post("/", isAuth, isVerified, toggleFavorite);
router.get("/", isAuth, isVerified, getFavorites);

module.exports = router;
