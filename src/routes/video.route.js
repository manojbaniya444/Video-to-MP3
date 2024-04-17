const express = require("express");
const { uploadVideoController } = require("../controller/video.controller");
const router = express.Router();
const { authenticate } = require("../middleware/authenticate");

router.post("/upload_video", authenticate, uploadVideoController);

module.exports = router;
