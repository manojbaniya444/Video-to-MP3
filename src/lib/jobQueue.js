const FFMPEG = require("../FFMPEG/ffmpeg");
const { deleteFile } = require("../utils");
const Video = require("../model/video.schema");

class JobQueue {
  constructor() {
    this.jobs = [];
    this.currentJob = null;
  }

  enqueue(job) {
    this.jobs.push(job);
    this.executeNext();
  }

  dequeue() {
    return this.jobs.shift();
  }

  executeNext() {
    if (this.currentJob) return;
    this.currentJob = this.dequeue();
    if (!this.currentJob) return;
    this.execute(this.currentJob);
  }

  async execute(job) {
    const { type, video, width, height } = job;
    // all ffmpeg logic goes here
    if (type === "resize") {
      const originalVideoPath = `./src/storage/${video.videoId}/original.${video.extension}`;
      const targetPath = `./src/storage/${video.videoId}/${width}x${height}.${video.extension}`;

      try {
        await FFMPEG.resize(originalVideoPath, targetPath, width, height);
        await Video.findByIdAndUpdate(video._id, {
          $set: {
            resizes: { dimensions: `${width}x${height}`, processing: false },
          },
        });
        console.log(
          "Video resized successfully. Now remaining jobs are: ",
          this.jobs.length
        );
      } catch (error) {
        console.log("Error on resizing video job class maa.", error);
        deleteFile(targetPath);
      }
    }

    this.currentJob = null;
    this.executeNext();
  }
}

module.exports = { JobQueue };
