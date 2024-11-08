import express from "express";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import cors from "cors";
import { logger } from "./middleware/logger";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import {
  CLIENT_ORIGIN,
  MONGO_INITDB_DATABASE,
  MONGO_INITDB_ROOT_PASSWORD,
  MONGO_INITDB_ROOT_USERNAME,
  MONGO_ORIGIN,
  NODE_ENV,
  PORT,
} from "./config";

main().catch((err) => console.log(`[AUTH]: Error - ${err}`));

async function main() {
  await mongoose.connect(`mongodb://${MONGO_ORIGIN}/${MONGO_INITDB_DATABASE}`, {
    user: MONGO_INITDB_ROOT_USERNAME,
    pass: MONGO_INITDB_ROOT_PASSWORD,
    authSource: "admin",
  });

  // start restful api for login/create users
  const app = express();

  app.use(
    cors({
      origin: CLIENT_ORIGIN,
      credentials: true,
      optionsSuccessStatus: 200,
    }),
  );
  app.use(cookieParser());
  app.use(express.json());

  app.use("/auth/v1", authRouter);
  app.use("/user/v1", userRouter);

  app.listen(PORT, () => {
    if (NODE_ENV === "development") {
      console.log("[AUTH]: Server is running in development mode.");

      // console.log(`[AUTH]: PORT = ${PORT}`);
      // console.log(`[AUTH]: CLIENT_ORIGIN = ${CLIENT_ORIGIN}`);
      // console.log(`[AUTH]: JWT_SECRET = ${JWT_SECRET}`);
      // console.log(`[AUTH]: JWT_EXPIRATION_HOURS = ${JWT_EXPIRATION_HOURS}`);
      // console.log(`[AUTH]: NODE_ENV = ${NODE_ENV}`);
      // console.log(`[AUTH]: MONGO_ORIGIN = ${MONGO_ORIGIN}`);
      // console.log(
      //   `[AUTH]: MONGO_INITDB_ROOT_USERNAME = ${MONGO_INITDB_ROOT_USERNAME}`,
      // );
      // console.log(
      //   `[AUTH]: MONGO_INITDB_ROOT_PASSWORD = ${MONGO_INITDB_ROOT_PASSWORD}`,
      // );
      // console.log(`[AUTH]: MONGO_INITDB_DATABASE = ${MONGO_INITDB_DATABASE}`);
      app.use(logger);
    }
    console.log(`[AUTH]: Server is running at http://localhost:${PORT}`);
  });
}
