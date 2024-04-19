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

const extractAudio = async (fullPath, audioPath) => {
  // ffmpeg -i video.mov -vn -c:a copy audio.aac
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-i",
      fullPath,
      "-vn",
      "-c:a",
      "copy",
      audioPath,
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

const resize = async (fullPath, targetPath, width, height) => {
  // ffmpeg -i .\src\storage\df713e0e\original.mp4 -vf scale=320:240 -c:a copy video-320x240.mp4
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-i",
      fullPath,
      "-vf",
      `scale=${width}:${height}`,
      "-c:a",
      "copy",
      targetPath,
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

module.exports = { makeThumbnail, getDimensions, extractAudio, resize };
