import React, { useState } from "react";
import { uploadVideo } from "../api/uploadVideo";

const useFileInfo: any = () => {
  const [file, setFile] = useState<File | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [fileExtension, setFileExtension] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const fileInputRef = React.useRef<any>(null);

  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }

    const fullname = e.target.files?.[0].name;
    const [name, extension] = fullname?.split(".") || [null, null]; // Add null check before splitting the string
    setFilename(name);
    setFileExtension(extension);
  };

  // file upload to the server handler
  const fileUploadHandler = async (file: File, name: string, ext: string) => {
    // make the post request here
    if (!file) {
      setMessage("No file selected to upload to the server");
      return;
    }
    try {
      setLoading(true);
      const response = await uploadVideo(`${name}.${ext}`, file);

      console.log(response);
      setMessage(response.message);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setLoading(false);
      setFile(null);
      setFilename(null);
      setFileExtension(null);
    } catch (error) {
      setLoading(false);
      setMessage("Error uploading the video file to the server");
      console.log("Upload video error: ", error);
    }
  };

  return {
    filename,
    fileExtension,
    fileChangeHandler,
    file,
    fileUploadHandler,
    loading,
    message,
    fileInputRef,
  };
};

export default useFileInfo;
