export const uploadVideo = async (filename: string, file: File) => {
  const response = await fetch("http://localhost:8080/api/video/upload_video", {
    method: "POST",
    credentials: "include",
    headers: {
      filename: filename,
    },
    body: file,
  });

  return await response.json();
};
