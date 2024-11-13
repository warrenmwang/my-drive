import express from "express";
import cors from "cors";
import { logger } from "./middleware/logger";
import cookieParser from "cookie-parser";
import sessionRouter from "./routes/session";
import fileUploadRouter from "./routes/uploadFiles";
import { authenticateToken } from "./middleware/auth";
import {
  CLIENT_ORIGIN,
  MONGO_INITDB_DATABASE,
  MONGO_INITDB_ROOT_PASSWORD,
  MONGO_INITDB_ROOT_USERNAME,
  MONGO_ORIGIN,
  NODE_ENV,
  PORT,
} from "./config";
import mongoose from "mongoose";
import retrieveRouter from "./routes/retrieveFiles";

async function main() {
  await mongoose.connect(`mongodb://${MONGO_ORIGIN}/${MONGO_INITDB_DATABASE}`, {
    user: MONGO_INITDB_ROOT_USERNAME,
    pass: MONGO_INITDB_ROOT_PASSWORD,
    authSource: "admin",
  });
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

  app.use("/session", sessionRouter);
  app.use("/upload", fileUploadRouter);
  app.use("/retrieve", retrieveRouter);

  app.listen(PORT, () => {
    console.log(`[UPLOAD]: Server is running at http://localhost:${PORT}`);
  });
}

main().catch((err) => console.log(`[UPLOAD]: Main function got error: ${err}`));
