const express = require("express");
const {
  uploadVideoController,
  getVideos,
  getVideoAsset,
  extractAudio,
} = require("../controller/video.controller");
const router = express.Router();
const { authenticate } = require("../middleware/authenticate");

router.post("/upload_video", authenticate, uploadVideoController);

router.get("/get_video", authenticate, getVideos);

router.get("/get_video_asset/:videoId", authenticate, getVideoAsset);

router.get("/extract_audio/:videoId", authenticate, extractAudio);

module.exports = router;
