const { spawn } = require("node:child_process");

const makeThumbnail = async (fullPath, thumbnailPath) => {
  // ffmpeg -i input.mp4 -ss 5 -vframes 1 thumbnail.jpg
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-i",
      fullPath,
      "-ss",
      "5",
      "-vframes",
      "1",
      thumbnailPath,
    ]);

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(`FFMPEG exited with code ${code}`);
      }
    });

    ffmpeg.on("error", (error) => {
      reject(error);
    });
  });
};

const getDimensions = async (fullPath) => {
  // ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 video.mp4
  return new Promise((resolve, reject) => {
    const ffprobe = spawn("ffprobe", [
      "-v",
      "error",
      "-select_streams",
      "v:0",
      "-show_entries",
      "stream=width,height",
      "-of",
      "csv=p=0",
      fullPath,
    ]);

    let dimensions = "";

    ffprobe.stdout.on("data", (data) => {
      dimensions += data;
    });

    ffprobe.on("close", (code) => {
      if (code === 0) {
        // remove all whitespaces
        dimensions = dimensions.replace(/\s/g, "");
        let dimensionsSplit = dimensions.split(",");
        dimensions = {
          width: dimensionsSplit[0],
          height: dimensionsSplit[1],
        };
        // console.log(dimensions);
        resolve(dimensions);
      } else {
        reject(`FFPROBE exited with code ${code}`);
      }
    });

    ffprobe.on("error", (error) => {
      reject(error);
    });
  });
};

module.exports = { makeThumbnail, getDimensions };