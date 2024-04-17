const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const { deleteFolder, deleteFile } = require("../utils");
const { pipeline } = require('node:stream/promises');


const uploadVideoController = async (req, res) => {
  const fileName = req.headers.filename || "untitled";
  const extension = path.extname(fileName).substring(1).toLowerCase();
  const name = path.parse(fileName).name;

  //   console.log(fileName, extension, name);

  // File storage structure : storage > unique_vid -> original.mp4, thumbnail.jpg, audio.aac, 320x150.mp4, ...

  //? videoId, name, extension, dimensions{}, extractedAudio, resizes[], user

  const videoId = crypto.randomBytes(4).toString("hex");

  try {
    // make the directory to store the file
    await fs.mkdir(`./src/storage/${videoId}`);

    const fullPath = `./src/storage/${videoId}/original.${extension}`;

    const file = await fs.open(fullPath, "w");
    const fileStream = file.createWriteStream();

    // req.pipe(fileStream);
    await pipeline(req, fileStream);

    return res.status(200).send("File uploaded successfully");
  } catch (error) {
    // if the error is because the folder does not exist
    if (error.code === "ENOENT") {
      return res
        .status(500)
        .send("Failed to upload the file. No such folder to upload");
    }

    // if the error is on pipelining i.e user cancels the upload process
    // in that case delete the folder that was created and remove any unnecessary files.
    await deleteFolder(`./storage/${videoId}`);
  }
};

module.exports = { uploadVideoController };
