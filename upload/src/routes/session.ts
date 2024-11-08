import express, { Request, Response } from "express";
import {
  FileMetaData,
  FileMetaDataMapSchema,
  FileUploadProgressSchema,
  SessionMetaData,
  SessionMetaDataSchema,
  UploadStatus,
} from "../schema";

import { z } from "zod";
import { fileUploadProgress, sessions } from "../config";

const router = express.Router();

router.use(express.json());

router.post(
  "/start",
  (
    req: Request<unknown, unknown, SessionMetaData, SessionMetaData>,
    res: Response,
  ) => {
    try {
      // Get session metadata
      const sessionMetaData = SessionMetaDataSchema.parse(req.body);
      if (sessionMetaData.files.length === 0) {
        res.status(400).json({ error: "No files to upload" });
        return;
      }

      // Initialize file upload progresses for this session
      const sessionFiles = new Map<string, FileMetaData>();
      sessionMetaData.files.forEach((file) => {
        sessionFiles.set(file.fileID, file);
        const fileUploadProgressObj = FileUploadProgressSchema.parse({
          sessionID: sessionMetaData.id,
          fileID: file.fileID,
          uploadedBytes: 0,
          totalBytes: file.fileSize,
          status: UploadStatus.Pending,
        });
        fileUploadProgress.set(file.fileID, fileUploadProgressObj);
      });

      // Save in memory this session's metadata
      sessions.set(sessionMetaData.id, sessionFiles);
      res.status(200).send(sessionMetaData);
    } catch (e) {
      if (e instanceof z.ZodError) {
        res.status(400).json({ error: e.errors });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  },
);

router.post(
  "/end",
  (
    req: Request<unknown, unknown, { sessionID: string }, unknown>,
    res: Response,
  ) => {
    try {
      // Get session ID to end from body
      const { sessionID } = req.body;

      // Check if session exists
      if (!sessions.has(sessionID)) {
        res.status(404).json({ error: "Session not found" });
        return;
      }

      // remove all files from file upload progress
      // and remove session itself

      const currentSession = FileMetaDataMapSchema.parse(
        sessions.get(sessionID),
      );

      const sessionFilesIDs = [...currentSession.keys()];

      // construct session metadata to send back
      const session = SessionMetaDataSchema.parse({
        id: sessionID,
        files: sessionFilesIDs.map((fileID) => currentSession.get(fileID)),
      });

      // remove files from file upload progress
      sessionFilesIDs.forEach((id) => {
        fileUploadProgress.delete(id);
      });
      // remove session
      sessions.delete(sessionID);

      res.status(200).json(session);
    } catch (e) {
      if (e instanceof z.ZodError) {
        res.status(400).json({ error: e.errors });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  },
);

export default router;
