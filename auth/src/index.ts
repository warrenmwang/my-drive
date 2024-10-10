import express from "express";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import cors from "cors";
import { logger } from "./middleware/logger";
import cookieParser from "cookie-parser";
import { CLIENT_ORIGIN, NODE_ENV, PORT } from "./config";

const app = express();

if (NODE_ENV === "development") {
  console.log("[AUTH]: Server is running in development mode.");
  app.use(logger);
}

app.use(
  cors({ origin: CLIENT_ORIGIN, credentials: true, optionsSuccessStatus: 200 }),
);
app.use(cookieParser());
app.use(express.json());

app.use("/auth/v1", authRouter);
app.use("/user/v1", userRouter);

app.listen(PORT, () => {
  console.log(`[AUTH]: Server is running at http://localhost:${PORT}`);
});
