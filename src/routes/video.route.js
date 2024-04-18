const express = require("express");
const {
  uploadVideoController,
  getVideos,
} = require("../controller/video.controller");
const router = express.Router();
const { authenticate } = require("../middleware/authenticate");

router.post("/upload_video", authenticate, uploadVideoController);

router.get("/get_video", authenticate, getVideos);

module.exports = router;
