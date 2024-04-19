const express = require("express");
const {
  uploadVideoController,
  getVideos,
  getVideoAsset,
  extractAudio,
  resizeVideo,
} = require("../controller/video.controller");
const router = express.Router();
const { authenticate } = require("../middleware/authenticate");

router.post("/upload_video", authenticate, uploadVideoController);

router.get("/get_video", authenticate, getVideos);

router.get("/get_video_asset/:videoId", authenticate, getVideoAsset);

router.get("/extract_audio/:videoId", authenticate, extractAudio);

router.put("/resize_video", authenticate, resizeVideo);

module.exports = router;
