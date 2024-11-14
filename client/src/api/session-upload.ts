import {
  ChunkMetaData,
  ChunkMetaDataSchema,
  FileMetaData,
  FileMetaDataSchema,
  SessionMetaDataSchema,
} from "../schema";
import axios from "axios";
import {
  SESSION_START_URL,
  SESSION_END_URL,
  UPLOAD_SINGLE_URL,
  UPLOAD_MULTIPART_CHUNK_URL,
} from "../urls";
import { randomUUID } from "crypto";

export const startUploadSession = async (sessionID: string, files: File[]) => {
  const sessionMetaData = SessionMetaDataSchema.parse({
    id: sessionID,
    files: files.map((f) => ({
      sessionID: sessionID,
      fileID: randomUUID(),
      fileName: f.name,
      fileSize: f.size,
      fileMIMEType: f.type,
      fileExtension: f.name.includes(".") ? f.name.split(".").pop() : "",
      fileLastModified: f.lastModified,
    })),
  });

  return axios
    .post(SESSION_START_URL, sessionMetaData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    .then((res) => res.data)
    .then((data) => SessionMetaDataSchema.parse(data));
};

export const endUploadSession = async (sessionID: string) => {
  return axios
    .post(
      SESSION_END_URL,
      {
        sessionID: sessionID,
      },
      {
        withCredentials: true,
      },
    )
    .then((res) => res.data)
    .then((data) => SessionMetaDataSchema.parse(data));
};

export const apiUploadSingleFile = async (
  f: File,
  fileMetaData: FileMetaData,
) => {
  const urlParams = new URLSearchParams();
  urlParams.set("sessionID", fileMetaData.sessionID);
  urlParams.set("fileID", fileMetaData.fileID);
  urlParams.set("fileName", fileMetaData.fileName);
  urlParams.set("fileSize", fileMetaData.fileSize.toString());
  urlParams.set("fileMIMEType", fileMetaData.fileMIMEType);
  urlParams.set("fileExtension", fileMetaData.fileExtension);
  urlParams.set("fileLastModified", fileMetaData.fileLastModified.toString());
  const url = UPLOAD_SINGLE_URL + "?" + urlParams.toString();
  return axios
    .post(url, f, {
      headers: {
        "Content-Type": "application/octet-stream",
        Accept: "application/json",
      },
      withCredentials: true,
    })
    .then((res) => res.data)
    .then((data) => FileMetaDataSchema.parse(data));
};

export const apiUploadFileChunk = async (
  data: Blob,
  chunkMetaData: ChunkMetaData,
) => {
  const urlParams = new URLSearchParams();
  urlParams.set("sessionID", chunkMetaData.sessionID);
  urlParams.set("fileID", chunkMetaData.fileID);
  urlParams.set("chunkIndex", chunkMetaData.chunkIndex.toString());
  urlParams.set("chunkSize", chunkMetaData.chunkSize.toString());
  urlParams.set("uploadedBytes", chunkMetaData.uploadedBytes.toString());
  urlParams.set("totalChunks", chunkMetaData.totalChunks.toString());
  const url = UPLOAD_MULTIPART_CHUNK_URL + "?" + urlParams.toString();
  return axios
    .post(url, data, {
      headers: {
        "Content-Type": "application/octet-stream",
        Accept: "application/json",
      },
      withCredentials: true,
    })
    .then((res) => res.data)
    .then((data) => ChunkMetaDataSchema.parse(data));
};
