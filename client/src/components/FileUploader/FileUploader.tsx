import * as React from "react";
import { v4 as uuid } from "uuid";
import { ChunkMetaData, FileMetaData } from "../../schema";
import { z } from "zod";
import { CHUNK_SIZE, MAX_CONCURRENT_REQUESTS } from "../../constants";
import { ConcurrencyManager } from "../../concurrency";
import "../../shared-styles/button.css";
import {
  startUploadSession,
  endUploadSession,
  apiUploadSingleFile,
  apiUploadFileChunk,
} from "../../api/session-upload";

const FileUploader: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [inputFiles, setInputFiles] = React.useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = React.useState<{
    [key: string]: number;
  }>({});
  const [error, setError] = React.useState<string | null>(null);
  const concurrencyManager = React.useMemo(
    () => new ConcurrencyManager(MAX_CONCURRENT_REQUESTS),
    [],
  );

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // setInputFiles([...inputFiles, ...Array.from(files)]);
      setInputFiles(Array.from(files));
    }
  };

  const uploadFileFull = React.useCallback(
    async (f: File, fileMetaData: FileMetaData) => {
      return concurrencyManager.runTask(async () =>
        apiUploadSingleFile(f, fileMetaData),
      );
    },
    [concurrencyManager],
  );

  const uploadChunk = React.useCallback(
    async (chunkMetaData: ChunkMetaData, data: Blob) => {
      return concurrencyManager.runTask(async () =>
        apiUploadFileChunk(data, chunkMetaData),
      );
    },
    [concurrencyManager],
  );

  const chunkUploadFile = React.useCallback(
    async (
      f: File,
      fileMetaData: FileMetaData,
      onProgress: (progress: number) => void,
    ) => {
      const numFullChunks = Math.floor(f.size / CHUNK_SIZE);
      const partialChunkSize = f.size % CHUNK_SIZE;
      const totalNumChunks = numFullChunks + (partialChunkSize > 0 ? 1 : 0);

      let from;
      let to = 0;

      for (let i = 0; i < numFullChunks; i++) {
        from = to;
        to = to + CHUNK_SIZE;
        const chunkMetaData: ChunkMetaData = {
          sessionID: fileMetaData.sessionID,
          fileID: fileMetaData.fileID,
          chunkIndex: i,
          chunkSize: CHUNK_SIZE,
          uploadedBytes: CHUNK_SIZE * i,
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
          uploadedBytes: CHUNK_SIZE * numFullChunks,
          totalChunks: totalNumChunks,
        };

        await uploadChunk(chunkMetaData, f.slice(from, to));
        onProgress(100);
      }
    },
    [uploadChunk],
  );

  React.useEffect(() => {
    if (isSubmitting) {
      const uploadFiles = async () => {
        try {
          if (inputFiles.length === 0) {
            throw new Error("Input files is empty.");
          }

          // start upload session
          const sessionID = uuid();
          const sessionMetaData = await startUploadSession(
            sessionID,
            inputFiles,
          );

          const requests = inputFiles.map(async (f: File, i: number) => {
            const fileMetaData = sessionMetaData.files[i];
            if (f.size > CHUNK_SIZE) {
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
          setIsSubmitting(false);
        }
      };
      uploadFiles();
    }
  }, [isSubmitting, inputFiles, chunkUploadFile, uploadFileFull]);

  return (
    <div className="mx-auto">
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
  );
};

export default FileUploader;
