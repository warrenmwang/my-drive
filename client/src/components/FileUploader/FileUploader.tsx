import React, { useState, useCallback, useMemo, useEffect } from "react";
import { ChunkMetaData, FileMetaData } from "../../schema";
import { z } from "zod";
import { CHUNK_SIZE_BYTES, MAX_CONCURRENT_REQUESTS } from "../../constants";
import { ConcurrencyManager } from "../../concurrency";
import "../../shared-styles/button.css";
import {
  startUploadSession,
  endUploadSession,
  apiUploadSingleFile,
  apiUploadFileChunk,
} from "../../api/session-upload";
import { useQueryClient } from "@tanstack/react-query";

const FileUploader: React.FC = () => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [inputFiles, setInputFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [error, setError] = useState<string | null>(null);
  const concurrencyManager = useMemo(
    () => new ConcurrencyManager(MAX_CONCURRENT_REQUESTS),
    [],
  );

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setInputFiles(Array.from(files));
    }
  };

  const uploadFileFull = useCallback(
    async (f: File, fileMetaData: FileMetaData) => {
      return concurrencyManager.runTask(async () =>
        apiUploadSingleFile(f, fileMetaData),
      );
    },
    [concurrencyManager],
  );

  const uploadChunk = useCallback(
    async (chunkMetaData: ChunkMetaData, data: Blob) => {
      return concurrencyManager.runTask(async () =>
        apiUploadFileChunk(data, chunkMetaData),
      );
    },
    [concurrencyManager],
  );

  const chunkUploadFile = useCallback(
    async (
      f: File,
      fileMetaData: FileMetaData,
      onProgress: (progress: number) => void,
    ) => {
      const numFullChunks = Math.floor(f.size / CHUNK_SIZE_BYTES);
      const partialChunkSize = f.size % CHUNK_SIZE_BYTES;
      const totalNumChunks = numFullChunks + (partialChunkSize > 0 ? 1 : 0);

      let from;
      let to = 0;

      for (let i = 0; i < numFullChunks; i++) {
        from = to;
        to = to + CHUNK_SIZE_BYTES;
        const chunkMetaData: ChunkMetaData = {
          sessionID: fileMetaData.sessionID,
          fileID: fileMetaData.fileID,
          chunkIndex: i,
          chunkSize: CHUNK_SIZE_BYTES,
          uploadedBytes: CHUNK_SIZE_BYTES * i,
          totalChunks: totalNumChunks,
        };

        await uploadChunk(chunkMetaData, f.slice(from, to));
        onProgress(((i + 1) / totalNumChunks) * 100);
      }

      if (partialChunkSize > 0) {
        from = to;
        to = f.size;

        const chunkMetaData: ChunkMetaData = {
          sessionID: fileMetaData.sessionID,
          fileID: fileMetaData.fileID,
          chunkIndex: numFullChunks,
          chunkSize: to - from,
          uploadedBytes: CHUNK_SIZE_BYTES * numFullChunks,
          totalChunks: totalNumChunks,
        };

        await uploadChunk(chunkMetaData, f.slice(from, to));
        onProgress(100);
      }
    },
    [uploadChunk],
  );

  useEffect(() => {
    if (isSubmitting) {
      const uploadFiles = async () => {
        try {
          if (inputFiles.length === 0) {
            setIsSubmitting(false);
            return;
          }

          // start upload session
          const sessionID = crypto.randomUUID();
          const sessionMetaData = await startUploadSession(
            sessionID,
            inputFiles,
          );

          const requests = inputFiles.map(async (f: File, i: number) => {
            const fileMetaData = sessionMetaData.files[i];
            if (f.size > CHUNK_SIZE_BYTES) {
              await chunkUploadFile(f, fileMetaData, (progress) => {
                setUploadProgress((prev) => ({ ...prev, [f.name]: progress }));
              });
            } else {
              await uploadFileFull(f, fileMetaData);
              setUploadProgress((prev) => ({ ...prev, [f.name]: 100 }));
            }
          });
          await Promise.all(requests);

          await endUploadSession(sessionID);
        } catch (e) {
          if (e instanceof z.ZodError) {
            console.error(e.errors);
            setError("zod error");
          } else if (e instanceof Error) {
            console.error(e);
            setError("error");
          } else {
            console.error("An unknown error occurred.");
          }
        } finally {
          queryClient.invalidateQueries({
            queryKey: ["drive"],
          });
          setIsSubmitting(false);
        }
      };
      uploadFiles();
    }
  }, [isSubmitting, inputFiles, chunkUploadFile, uploadFileFull]);

  return (
    <div className="w-full bg-slate-200">
      <div className="flex flex-col items-center">
        <h1>Mass File Uploader</h1>
        <form>
          <input type="file" multiple onChange={handleOnChange} />
          <button
            type="button"
            onClick={() => setIsSubmitting(true)}
            className="button__green"
          >
            {isSubmitting ? "Submitting" : "Submit"}
          </button>
          <button
            type="reset"
            onClick={() => setInputFiles([])}
            className="button__gray"
          >
            Clear
          </button>
        </form>
        <h1>File Upload Progress:</h1>
        {inputFiles.map((file) => (
          <div key={file.name}>
            {file.name}: {uploadProgress[file.name] || 0}%
          </div>
        ))}
        {error && <div style={{ color: "red" }}>{error}</div>}
      </div>
    </div>
  );
};

export default FileUploader;
