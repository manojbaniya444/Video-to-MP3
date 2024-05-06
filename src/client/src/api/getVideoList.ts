const getVideoList = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/video/get_video", {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    return data.videos;
  } catch (error) {
    console.log("Error fetching videos", error);
  }
};
export default getVideoList;
