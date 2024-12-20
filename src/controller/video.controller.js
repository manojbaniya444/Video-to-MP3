const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const { deleteFolder, deleteFile } = require("../utils");
const { pipeline } = require("node:stream/promises");
const Video = require("../model/video.schema");
const FFMPEG = require("../FFMPEG/ffmpeg");
const mongoose = require("mongoose");
const { JobQueue } = require("../lib/jobQueue");

const jobs = new JobQueue();

const uploadVideoController = async (req, res) => {
  const fileName = req.headers.filename || "untitled";
  console.log(fileName);
  const extension = path.extname(fileName).substring(1).toLowerCase();
  const name = path.parse(fileName).name;

  const FORMATS_SUPPORTED = ["mp4", "mov"];

  // check if the format is supported or not
  if (FORMATS_SUPPORTED.indexOf(extension) === -1) {
    console.log("Unsupported file format", extension);
    return res.status(400).json({ message: "Unsupported file format" });
  }

  // console.log(fileName, extension, name);

  // File storage structure : storage > unique_vid -> original.mp4, thumbnail.jpg, audio.aac, 320x150.mp4, ...

  //? videoId, name, extension, dimensions{}, extractedAudio, resizes[], user

  const videoId = crypto.randomBytes(4).toString("hex");

  try {
    // make the directory to store the file
    await fs.mkdir(`./storage/${videoId}`);

    const fullPath = `./storage/${videoId}/original.${extension}`;
    const thumbnailPath = `./storage/${videoId}/thumbnail.jpg`;

    const file = await fs.open(fullPath, "w");
    const fileStream = file.createWriteStream();

    // req.pipe(fileStream);
    await pipeline(req, fileStream);

    // update the database after the video is uploaded successfully
    // await Video.create({});

    // make a thumbnail for the video
    await FFMPEG.makeThumbnail(fullPath, thumbnailPath);

    // get dimensions of the video file : width, height
    const dimensions = await FFMPEG.getDimensions(fullPath);

    const video = new Video({
      videoId,
      name,
      user: req?.user.id,
      extension,
      dimensions,
      extractedAudio: false,
      resizes: [],
    });

    await video.save();
    return res.status(200).json({
      message: "File uploaded successfully",
    });
  } catch (error) {
    // if the error is because the folder does not exist
    console.log("Error on uploading file", error);

    if (error.code === "ENOENT") {
      return res
        .status(500)
        .json({ message: "Failed to upload file. Please try again." });
    }

    // if the error is on pipelining i.e user cancels the upload process
    // in that case delete the folder that was created and remove any unnecessary files.

    if (error.code === "ECONNRESET") {
      await deleteFolder(`./storage/${videoId}`);
    }

    console.log("Error on uploading file", error);
  }
};

const getVideos = async (req, res) => {
  const videos = await Video.find({ user: req?.user.id }).populate(
    "user",
    "-password"
  );

  return res
    .status(200)
    .json({ message: "Videos fetched successfully", videos });
};

const getVideoAsset = async (req, res) => {
  const videoId = req.params.videoId;
  const type = req.query.type;

  // check if the videoId is of mongoose objectId type
  if (mongoose.Types.ObjectId.isValid(videoId) === false) {
    return res.status(400).json({
      message: "Invalid videoId",
    });
  }

  const video = await Video.findById(videoId);

  if (!video) {
    return res.status(404).send("Video not found");
  }

  let file;
  let mimeType;
  let filename;

  switch (type) {
    case "thumbnail":
      file = await fs.open(`./storage/${video.videoId}/thumbnail.jpg`, "r");
      mimeType = "image/jpeg";
      break;

    case "audio":
      file = await fs.open(`./storage/${video.videoId}/audio.aac`, "r");
      mimeType = "audio/aac";
      filename = `${video.name}-audio.aac`;
      break;

    case "resize":
      const dimensions = req.query.dimensions;
      file = await fs.open(
        `./storage/${video.videoId}/${dimensions}.${video.extension}`,
        "r"
      );
      mimeType = `video/${video.extension}`;
      filename = `${video.name}-${dimensions}.${video.extension}`;
      break;

    case "original":
      file = await fs.open(
        `./storage/${video.videoId}/original.${video.extension}`,
        "r"
      );
      mimeType = `video/${video.extension}`;
      filename = `${video.name}.${video.extension}`;
      break;
    default:
      return res.status(400).send("Invalid request check the query params");
      break;
  }
  try {
    // grab the file size
    const stat = await file.stat();

    const fileStream = file.createReadStream();

    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Length", stat.size);

    // header to trigger download
    if (type !== "thumbnail") {
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      // res.setHeader("file-name", filename);
    }
    res.status(200);
    await pipeline(fileStream, res);
    file.close();
  } catch (error) {
    console.log("Error on getting video asset", error);
    return res.status(500).json({ message: "Fail to get video asset", error });
  }
};

const extractAudio = async (req, res) => {
  const videoId = req.params.videoId;

  // check if the videoId is of mongoose objectId type
  if (mongoose.Types.ObjectId.isValid(videoId) === false) {
    return res.status(400).json({
      message: "Invalid video id",
    });
  }

  const video = await Video.findById(videoId);

  if (!video) {
    return res.status(404).json({
      message: "Video not found.",
    });
  }

  if (video.extractedAudio) {
    return res.status(400).json({ message: "Audio already extracted" });
  }

  const originalFilePath = `./storage/${video.videoId}/original.${video.extension}`;
  const audioPath = `./storage/${video.videoId}/audio.aac`;

  try {
    await FFMPEG.extractAudio(originalFilePath, audioPath);

    video.extractedAudio = true;
    await video.save();
    return res.status(200).json({ message: "Audio extracted successfully." });
  } catch (error) {
    console.log("Error on extracting audio", error);
    deleteFile(audioPath);
    return res.status(500).json({
      message: "Failed to extract audio.",
    });
  }
};

const resizeVideo = async (req, res) => {
  const videoId = req.body.videoId;
  const width = Number(req.body.width);
  const height = Number(req.body.height);

  if (mongoose.Types.ObjectId.isValid(videoId) === false) {
    return res.status(400).json({
      message: "Invalid video id",
    });
  }

  const video = await Video.findById(videoId);

  if (!video) {
    return res.status(404).send("Video not found");
  }

  // check if the video is already resized
  const resizedVideoIndex = video.resizes.findIndex((resizeSize) => {
    return resizeSize.dimensions === `${width}x${height}`;
  });

  if (resizedVideoIndex !== -1) {
    if (video.resizes[resizedVideoIndex].processing) {
      return res
        .status(200)
        .json({ message: "Video is processing", isResized: false });
    } else {
      return res
        .status(200)
        .json({ message: "Video already resized", isResized: true });
    }
  }

  video.resizes.push({ dimensions: `${width}x${height}`, processing: true });
  await video.save();

  //? Schedule the job
  jobs.enqueue({
    type: "resize",
    video,
    width,
    height,
  });

  return res
    .status(200)
    .json({ message: "Video scheduled to resize check later." });
};

module.exports = {
  uploadVideoController,
  getVideos,
  getVideoAsset,
  extractAudio,
  resizeVideo,
};
