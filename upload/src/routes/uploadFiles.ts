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
import { concatChunksOrderly } from "../utils";
import { z } from "zod";
import { chunks, fileUploadProgress, sessions } from "../config";
import File from "../mongodb/models/File";
import { AuthLocals } from "../middleware/auth";

const router = express.Router();
const multiPartRouter = express.Router();

router.use(
  bodyParser.raw({ type: "application/octet-stream", limit: "100mb" }),
);

// TODO: allow editting of file name, that's it...
router.post("/edit", (req, res) => {

})

// TODO: delete a file by its id
router.delete("/", (req, res) => {

})

router.post(
  "/single",
  (
    req: Request<any, FileMetaData, Buffer, FileMetaData>,
    res: Response<any, AuthLocals>,
  ) => {
    try {
      const fileMetaData = FileMetaDataSchema.parse(req.query);
      const fileBuffer = req.body;
      const userID = res.locals.user.userID;

      const fileToSave = new File({
        userID: userID,
        fileID: fileMetaData.fileID,
        fileName: fileMetaData.fileName,
        fileSize: fileMetaData.fileSize,
        fileMIMEType: fileMetaData.fileMIMEType,
        fileExtension: fileMetaData.fileExtension,
        fileLastModified: fileMetaData.fileLastModified,
        content: fileBuffer,
      });
      fileToSave.save();

      // send back the metadata
      res.status(200).send(fileMetaData);
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
  (
    req: Request<unknown, unknown, Buffer, ChunkMetaData>,
    res: Response<any, AuthLocals>,
  ) => {
    try {
      const userID = res.locals.user.userID;
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
        const fileBuffer = concatChunksOrderly(chunks.get(fileID) as Chunk[]);
        const fileMetaData = FileMetaDataSchema.parse(
          sessions.get(sessionID)?.get(fileID),
        );

        const fileToSave = new File({
          userID: userID,
          fileID: fileMetaData.fileID,
          fileName: fileMetaData.fileName,
          fileSize: fileMetaData.fileSize,
          fileMIMEType: fileMetaData.fileMIMEType,
          fileExtension: fileMetaData.fileExtension,
          fileLastModified: fileMetaData.fileLastModified,
          content: fileBuffer,
        });
        fileToSave.save();

        chunks.delete(fileID);

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
