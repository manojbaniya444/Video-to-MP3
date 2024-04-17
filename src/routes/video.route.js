const express = require("express");
const { uploadVideoController } = require("../controller/video.controller");
const router = express.Router();

router.post("/upload_video", uploadVideoController);

module.exports = router;
