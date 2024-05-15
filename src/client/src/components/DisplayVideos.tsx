import React, { useEffect, useState } from "react";
import getVideoList from "../api/getVideoList";
import { VideoType } from "../types";
import "./displayVideos.css";

type DimensionsType = {
  width: number;
  height: number;
};

const DisplayVideos: React.FC = () => {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [dimensions, setDimensions] = useState<DimensionsType>({
    width: 0,
    height: 0,
  });
  const [extractAudioLoading, setExtractAudioLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const videos = await getVideoList();
        setVideos(videos);
        console.log("Videos", videos);
      } catch (error) {
        console.log("Error fetching videos", error);
      }
    })();
  }, []);

  const resizeHandler = async () => {
    console.log(dimensions);
  };

  const extractAudioHandler = async (videoId: string) => {
    setExtractAudioLoading(true);
    try {
      await fetch(`http://localhost:8080/api/video/extract_audio/${videoId}`, {
        method: "GET",
        credentials: "include",
      });
      setExtractAudioLoading(false);
    } catch (error) {
      console.log("Error extracting audio", error);
      setExtractAudioLoading(false);
    }
  };

  const downloadExtractedAudioHandler = async (videoId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/video/get_video_asset/${videoId}?type=audio`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const filename = `audio_${videoId}.mp3`;

      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = filename;
      downloadLink.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.log("Error downlaoding audio: ", error);
    }
  };

  return (
    <div className="displayvideo__container">
      {videos?.map((video) => {
        return (
          <div key={video._id} className="displayvideo__videodetail">
            <div className="video__detail__info">
              <img
                src={`http://localhost:8080/api/video/get_video_asset/${video._id}?type=thumbnail`}
                alt={video.name}
                width="90"
                height="90"
              />
              <p>Name: {video.name}</p>
              <p>
                Extension:{" "}
                <span className="displayvideo__videodetail__extension">
                  {video.extension}
                </span>
              </p>
              <p>
                Resolution: {video.dimensions.width}x{video.dimensions.height}
              </p>
              {video.extractedAudio ? (
                <button
                  className="button"
                  onClick={() => downloadExtractedAudioHandler(video._id)}
                >
                  Download Audio
                </button>
              ) : (
                <button
                  className="button"
                  onClick={() => extractAudioHandler(video._id)}
                >
                  {extractAudioLoading
                    ? "Extracting Audio..."
                    : "Extract Audio"}
                </button>
              )}
            </div>
            <div className="video__resize">
              <select
                onChange={(e) =>
                  setDimensions({ ...dimensions, width: +e.target.value })
                }
                value={dimensions.width}
              >
                <option value="">Width</option>
                <option value="480">480p</option>
                <option value="720">720p</option>
                <option value="1080">1080p</option>
              </select>
              <select
                onChange={(e) =>
                  setDimensions({ ...dimensions, height: +e.target.value })
                }
                value={dimensions.height}
              >
                <option value="">Height</option>
                <option value="480">480p</option>
                <option value="720">720p</option>
                <option value="1080">1080p</option>
              </select>
              <button>Resize video</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DisplayVideos;
