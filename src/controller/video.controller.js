const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const { deleteFolder, deleteFile } = require("../utils");
const { pipeline } = require("node:stream/promises");
const Video = require("../model/video.schema");
const FFMPEG = require("../FFMPEG/ffmpeg");

const uploadVideoController = async (req, res) => {
  const fileName = req.headers.filename || "untitled";
  const extension = path.extname(fileName).substring(1).toLowerCase();
  const name = path.parse(fileName).name;

  const FORMATS_SUPPORTED = ["mp4", "mov"];

  // check if the format is supported or not
  if (FORMATS_SUPPORTED.indexOf(extension) === -1) {
    console.log("Unsupported file format", extension);
    return res
      .status(400)
      .send("Unsupported file format please upload mp4 or mov");
  }

    // console.log(fileName, extension, name);

  // File storage structure : storage > unique_vid -> original.mp4, thumbnail.jpg, audio.aac, 320x150.mp4, ...

  //? videoId, name, extension, dimensions{}, extractedAudio, resizes[], user

  const videoId = crypto.randomBytes(4).toString("hex");

  try {
    // make the directory to store the file
    await fs.mkdir(`./src/storage/${videoId}`);

    const fullPath = `./src/storage/${videoId}/original.${extension}`;
    const thumbnailPath = `./src/storage/${videoId}/thumbnail.jpg`;

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
    
    // await video.save();
    return res.status(200).send("File uploaded successfully");
  } catch (error) {
    // if the error is because the folder does not exist
    console.log("Error on uploading file", error);

    if (error.code === "ENOENT") {
      return res
        .status(500)
        .send("Failed to upload the file. No such folder to upload");
    }

    // if the error is on pipelining i.e user cancels the upload process
    // in that case delete the folder that was created and remove any unnecessary files.

    if (error.code === "ECONNRESET") {
      await deleteFolder(`./storage/${videoId}`);
    }

    console.log("Error on uploading file", error);
  }
};

module.exports = { uploadVideoController };
