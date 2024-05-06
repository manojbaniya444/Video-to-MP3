import React from "react";
import "./selectfile.css";
import useFileUpload from "../hooks/useFileUpload";

const SelectFile: React.FC = () => {
  const {
    filename,
    fileExtension,
    fileChangeHandler,
    file,
    fileUploadHandler,
    loading,
    message,
    fileInputRef,
  } = useFileUpload();

  return (
    <section className="selectfile__section">
      <div className="selectfile__section__choosefile">
        <label className="selectfile__section__choosefile__label">
          Choose video file
        </label>
        <input
          onChange={(e) => fileChangeHandler(e)}
          type="file"
          name="video"
          accept="video/*"
          ref={fileInputRef}
        />

        {filename && fileExtension ? (
          <div className="selectfile__section__choosefile__fileinfo">
            <p>File name: {filename}</p>
            <p>
              File size:{" "}
              <span
                style={{
                  backgroundColor: "green",
                  padding: "5px",
                  color: "white",
                }}
              >
                {fileExtension}
              </span>
            </p>
          </div>
        ) : null}
      </div>

      <div>
        {loading ? (
          <h1>File uploading to the server...</h1>
        ) : (
          <button
            onClick={() => fileUploadHandler(file, filename, fileExtension)}
          >
            Upload file to the server
          </button>
        )}
      </div>
      <p>{message}</p>
    </section>
  );
};

export default SelectFile;
