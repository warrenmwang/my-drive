import React from "react";
import { FileMetaDataReceived } from "../schema";
import { useDeleteFileMutation } from "../hooks/file";

type props = {
  data: FileMetaDataReceived;
};

const FileCard: React.FC<props> = ({ data }) => {
  const deleteMutation = useDeleteFileMutation();

  const handleDownload = () => {
    console.log("fetch file", data.fileID);
  };

  const handleDelete = () => {
    deleteMutation.mutate(data.fileID, {
      onError: () => alert("File Delete Error."),
    });
  };

  return (
    <div className="m-2 p-3 bg-slate-100 rounded-lg shadow-gray-400 shadow-lg">
      <h1 className="text-lg">{data.fileName}</h1>
      <h3 className="text-md">Type: {data.fileMIMEType}</h3>
      <h3 className="text-md">Size: {data.fileSize}</h3>
      <h3 className="text-md">Uploaded on: {data.createdAt}</h3>
      <h3 className="text-md">Last modified on: {data.fileLastModified}</h3>
      <button className="button__green font-bold" onClick={handleDownload}>
        Download
      </button>
      <button className="button__red font-bold" onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
};

export default FileCard;
