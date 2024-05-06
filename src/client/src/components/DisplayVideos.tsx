import React, { useEffect, useState } from "react";
import getVideoList from "../api/getVideoList";
import { VideoType } from "../types";

const DisplayVideos: React.FC = () => {
  const [videos, setVideos] = useState<VideoType[]>([]);

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
  return <div>DisplayVideos</div>;
};

export default DisplayVideos;
