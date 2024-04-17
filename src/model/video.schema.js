const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  extension: {
    type: String,
    required: true,
  },
  dimensions: {
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
  },
  extractedAudio: {
    type: Boolean,
    default: False,
  },
  resizes: [
    {
      resizeSize: {
        type: String,
        required: true,
        processing: {
          type: Boolean,
          required: true,
          default: False,
        },
      },
    },
  ],
});

module.exports = mongoose.model("Video", videoSchema);
