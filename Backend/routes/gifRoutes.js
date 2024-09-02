const express = require("express");
const router = express.Router();
const {
  addGif,
  getAllGifs,
  deleteGif,
} = require("../controllers/gifController");

router.post("/gifs", addGif);
router.get("/gifs", getAllGifs);
router.delete("/gifs", deleteGif);

module.exports = router;
