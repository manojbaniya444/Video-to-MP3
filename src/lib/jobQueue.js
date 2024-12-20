const FFMPEG = require("../FFMPEG/ffmpeg");
const { deleteFile } = require("../utils");
const Video = require("../model/video.schema");

class JobQueue {
  constructor() {
    this.jobs = [];
    this.currentJob = null;

    (async () => {
      const videos = await Video.find({
        "resizes.processing": true,
      });

      // console.log(videos);

      if (videos.length > 0) {
        videos.forEach((video) => {
          video.resizes.forEach((resizes) => {
            if (resizes.processing) {
              this.enqueue({
                type: "resize",
                video,
                width: resizes.dimensions.split("x")[0],
                height: resizes.dimensions.split("x")[1],
              });
              // console.log("Enqueued job for video: ", video._id, resizes.dimensions)
            }
          });
        });
      }
    })();
  }

  enqueue(job) {
    // console.log("Enqueued job: ", job)
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
    // console.log("Executing job: ", this.currentJob)
  }

  async execute(job) {
    const { type, video, width, height } = job;
    // all ffmpeg logic goes here
    if (type === "resize") {
      const originalVideoPath = `./storage/${video.videoId}/original.${video.extension}`;
      const targetPath = `./storage/${video.videoId}/${width}x${height}.${video.extension}`;

      try {
        await FFMPEG.resize(originalVideoPath, targetPath, width, height);
        await Video.findByIdAndUpdate(
          video._id,
          {
            $set: {
              "resizes.$[elem].processing": false,
            },
          },
          {
            arrayFilters: [{ "elem.dimensions": `${width}x${height}` }],
          }
        );
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
