const { Router } = require("express");
const isAuth = require("../middleware/isAuth");
const isVerified = require("../middleware/isVerified");
const {
  toggleFavorite,
  getFavorites,
  isFav,
} = require("../controllers/favoriteController");

const router = Router();
router.post("/", isAuth, isVerified, toggleFavorite);
router.get("/is-fav", isAuth, isVerified, isFav);
router.get("/", isAuth, isVerified, getFavorites);

module.exports = router;
