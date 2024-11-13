import React from "react";
import { FileMetaDataReceived } from "../schema";

type props = {
  data: FileMetaDataReceived;
};

const FileCard: React.FC<props> = ({ data }) => {

  const handleClick = () => {
    // TODO:
    console.log("fetch file", data.fileID)
  }

  return (
    <div className="m-2 p-3 bg-slate-100 rounded-lg shadow-gray-400 shadow-lg">
      <h1 className="text-lg">{data.fileName}</h1>
      <h3 className="text-md">Type: {data.fileMIMEType}</h3>
      <h3 className="text-md">Size: {data.fileSize}</h3>
      <h3 className="text-md">Uploaded on: {data.createdAt}</h3>
      <h3 className="text-md">Last modified on: {data.fileLastModified}</h3>
      <button className="bg-green-500 rounded p-3 text-white font-bold font-sans" onClick={handleClick}>
        Download
      </button>
    </div>
  );
};

export default FileCard;
