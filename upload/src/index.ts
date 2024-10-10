import express from "express";
import cors from "cors";
import { Chunk, FileMetaData, FileUploadProgress } from "./schema";
import { logger } from "./middleware/logger";
import cookieParser from "cookie-parser";
import sessionRouter from "./routes/session";
import fileUploadRouter from "./routes/uploadFiles";
import { authenticateToken } from "./middleware/auth";
import { CLIENT_ORIGIN, NODE_ENV, PORT } from "./config";

const app = express();

// App level Middleware
if (NODE_ENV === "development") {
  console.log("[UPLOAD]: Server is running in development mode.");
  app.use(logger);
}

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);
app.use(cookieParser());
app.use(authenticateToken);

// key: sessionID, value: {[fileID: string]: FileMetaData}
export const sessions = new Map<string, Map<string, FileMetaData>>();

// key: fileID, value: FileMetaData
export const fileUploadProgress = new Map<string, FileUploadProgress>();

// key: fileID, value: list of chunks
export const chunks = new Map<string, Chunk[]>();

app.use("/session", sessionRouter);
app.use("/upload", fileUploadRouter);

app.listen(PORT, () => {
  console.log(`[UPLOAD]: Server is running at http://localhost:${PORT}`);
});
