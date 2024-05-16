import React, { useEffect, useState } from "react";
import getVideoList from "../api/getVideoList";
import { VideoType } from "../types";
import "./displayVideos.css";

type DimensionsType = {
  width: number | null;
  height: number | null;
};

const DisplayVideos: React.FC = () => {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [dimensions, setDimensions] = useState<DimensionsType>({
    width: 320,
    height: 240,
  });
  const [extractAudioLoading, setExtractAudioLoading] = useState(false);
  const [extractAudioMessage, setExtractAudioMessage] =
    useState<string>("Extract Audio");

  // TODO:<move>fetch videos on component mount
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

  // TODO:<move>function to resize video
  const resizeHandler = async (videoId: string) => {
    if (!dimensions.width || !dimensions.height) {
      alert("Please select width and height");
    }

    const resizeData = {
      videoId,
      width: dimensions.width,
      height: dimensions.height,
    };

    console.log(resizeData);

    try {
      const response = await fetch(
        `http://localhost:8080/api/video/resize_video`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(resizeData),
        }
      );

      const data = await response.json();
      console.log("Resize response", data);
    } catch (error) {
      console.log("Error during resizing your video: ", error);
    }
  };

  // TODO:<move>function to extract audio
  const extractAudioHandler = async (videoId: string) => {
    setExtractAudioLoading(true);
    setExtractAudioMessage("Extracting Audio...");
    try {
      await fetch(`http://localhost:8080/api/video/extract_audio/${videoId}`, {
        method: "GET",
        credentials: "include",
      });
      setExtractAudioMessage("Audio Extracted");
      setExtractAudioLoading(false);
    } catch (error) {
      console.log("Error extracting audio", error);
      setExtractAudioMessage("Error extracting audio");
      setExtractAudioLoading(false);
    }
  };

  // TODO:<move>function to download extracted audio
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

  // TODO:<move>function to download resized video
  const downloadVideo = async (
    type: string,
    videoId: string,
    extension: string,
    dims: string
  ) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/video/get_video_asset/${videoId}?type=${type}&dimensions=${dims}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const filename = `video_${videoId}_${dims}.${extension}`;

      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = filename;

      downloadLink.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.log("Error downloading resized video: ", error);
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
              <p style={{ width: "200px" }}>Name: {video.name}</p>
              <p>
                Extension:{" "}
                <span className="displayvideo__videodetail__extension">
                  {video.extension}
                </span>
              </p>
              <div className="displayvideo__videodetail__resolution">
                <p>
                  Resolution: {video.dimensions.width}x{video.dimensions.height}
                </p>
                <button
                  onClick={() =>
                    downloadVideo("original", video._id, video.extension, "")
                  }
                >
                  Download Original Video
                </button>
                <div>
                  {video.resizes.map((resize) => {
                    return (
                      <div
                        style={{
                          backgroundColor: resize.processing
                            ? "lightgray"
                            : "lightgreen",
                          padding: "20px",
                        }}
                        key={resize.dimensions}
                      >
                        <p>Resolution: {resize.dimensions}</p>
                        <p>
                          {resize.processing
                            ? "Processing"
                            : "Ready to download"}
                        </p>
                        {!resize.processing && (
                          <button
                            onClick={() =>
                              downloadVideo(
                                "resize",
                                video._id,
                                video.extension,
                                resize.dimensions
                              )
                            }
                          >
                            Download {resize.dimensions}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* {video.extractedAudio ? (
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
              )} */}
              {!video.extractedAudio && (
                <button
                  className="button"
                  onClick={() => extractAudioHandler(video._id)}
                >
                  {extractAudioMessage}
                </button>
              )}
              {video.extractedAudio && (
                <button
                  className="button"
                  onClick={() => downloadExtractedAudioHandler(video._id)}
                >
                  Download Audio
                </button>
              )}
            </div>
            <div className="video__resize">
              <label htmlFor="">width</label>
              <select
                onChange={(e) =>
                  setDimensions({ ...dimensions, width: +e.target.value })
                }
                value={dimensions.width || ""}
              >
                <option value="320">320</option>
                <option value="640">640</option>
                <option value="720">720</option>
                <option value="1920">1080</option>
              </select>
              <label htmlFor="">height</label>
              <select
                onChange={(e) =>
                  setDimensions({ ...dimensions, height: +e.target.value })
                }
                value={dimensions.height || ""}
              >
                <option value="240">240</option>
                <option value="480">480</option>
                <option value="400">400</option>
                <option value="1080">1080</option>
              </select>
              <button onClick={() => resizeHandler(video._id)}>
                Resize video
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DisplayVideos;
