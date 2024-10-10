import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import {
  Chunk,
  ChunkMetaData,
  ChunkMetaDataSchema,
  FileMetaData,
  FileMetaDataSchema,
  FileUploadProgressSchema,
  UploadStatus,
} from "../schema";
import { concatChunksOrderly, writeToFile } from "../utils";
import { z } from "zod";
import { chunks, fileUploadProgress, sessions } from "..";

const router = express.Router();
const multiPartRouter = express.Router();

router.use(
  bodyParser.raw({ type: "application/octet-stream", limit: "100mb" }),
);

router.post(
  "/single",
  (
    req: Request<unknown, FileMetaData, Buffer, FileMetaData>,
    res: Response,
  ) => {
    try {
      const searchParams = FileMetaDataSchema.parse(req.query);
      const { fileName } = searchParams; // filename contains extension as well
      const fileBuffer = req.body;

      // save to disk
      writeToFile(fileBuffer, `./uploads/${fileName}`);

      // send back the metadata
      res.status(200).send(searchParams);
    } catch (e) {
      if (e instanceof z.ZodError) {
        res.status(400).json({ error: e.errors });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  },
);

multiPartRouter.post(
  "/chunk",
  (req: Request<unknown, unknown, Buffer, ChunkMetaData>, res: Response) => {
    try {
      const searchParams = ChunkMetaDataSchema.parse(req.query);
      const {
        sessionID,
        fileID,
        chunkIndex,
        chunkSize,
        uploadedBytes,
        totalChunks,
      } = searchParams;

      const chunkData = req.body;

      const chunkMetaData: ChunkMetaData = {
        sessionID: sessionID,
        fileID: fileID,
        chunkIndex: chunkIndex,
        chunkSize: chunkSize,
        uploadedBytes: uploadedBytes,
        totalChunks: totalChunks,
      };

      const chunk: Chunk = {
        ...chunkMetaData,
        buffer: chunkData,
      };

      // Save chunk
      if (chunks.has(fileID)) {
        // Save with existing chunks
        chunks.get(fileID)?.push(chunk);
      } else {
        // First chunk to arrive, save it as first entry in new array
        chunks.set(fileID, [chunk]);

        // Update file upload progress
        const currFileUploadProgress = FileUploadProgressSchema.parse(
          fileUploadProgress.get(fileID),
        );

        fileUploadProgress.set(fileID, {
          ...currFileUploadProgress,
          uploadedBytes: currFileUploadProgress.uploadedBytes + chunk.chunkSize,
          status: UploadStatus.Uploading,
        });
      }

      // Check if file is completed
      if (chunks.get(fileID)?.length === chunk.totalChunks) {
        // Construct file from chunks
        const file = concatChunksOrderly(chunks.get(fileID) as Chunk[]);

        // Get file meta data
        const fileMetaData = FileMetaDataSchema.parse(
          sessions.get(sessionID)?.get(fileID),
        );

        // Save file to disk
        writeToFile(
          file,
          `./uploads/${fileMetaData.fileName}.${fileMetaData.fileExtension}`,
        );

        // Clear chunks for this file
        chunks.delete(fileID);

        // Update file upload progress for this file
        const currFileUploadProgress = FileUploadProgressSchema.parse(
          fileUploadProgress.get(fileID),
        );
        fileUploadProgress.set(fileID, {
          ...currFileUploadProgress,
          uploadedBytes: currFileUploadProgress.totalBytes,
          status: UploadStatus.Completed,
        });
      }

      res.status(200).send(chunk);
    } catch (e) {
      if (e instanceof z.ZodError) {
        res.status(400).json({ error: e.errors });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  },
);

router.use("/multipart", multiPartRouter);
export default router;
