import express, { Router, Request, Response } from "express";
import { UserSchema } from "../schema";
import dotenv from "dotenv";
import {
  authenticateToken,
  AuthLocals,
  softAuthenticateToken,
} from "../middleware/auth";
import { consoleLogError, createAndSetUserJWT, removeUserJWT } from "../utils";
import { UserModelDB } from "../models/User";
dotenv.config();

const authRouter: Router = express.Router();

// NO AUTH
// Login a user given a email and password
authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const userData = UserSchema.omit({ id: true }).parse(req.body);

    // Query DB for user's existence
    const queryRes = await UserModelDB.findOne({
      email: userData.email,
    }).exec();

    // Check existence of user details
    if (queryRes === null) {
      return res
        .status(400)
        .json({ message: "no account with that email found." });
    }

    // Check password
    if (queryRes.password !== userData.password) {
      return res
        .status(400)
        .json({ message: "incorrect password for account" });
    }

    // Grant user a JWT access token.
    return createAndSetUserJWT(queryRes.id, res)
      .status(200)
      .json({ message: "Logged in successfully." });
  } catch (err) {
    consoleLogError(err);
    return res.status(500).json(err);
  }
});

// AUTHED
// Returns ok if user is authenticated
authRouter.get(
  "/status",
  softAuthenticateToken,
  (_, res: Response<any, AuthLocals>) => {
    return res.status(200).json(true);
  },
);

// AUTHED
// Log out a user by overwritting their JWT access token.
authRouter.get("/logout", authenticateToken, (_, res: Response) => {
  return removeUserJWT(res)
    .status(200)
    .json({ message: "Logged out successfully." });
});

// // TODO: refresh the user's access token
// authRouter.get(
//   "/refresh",
//   authenticateToken,
//   (req: MaybeAuthenticatedRequest, res: Response) => {},
// );

export default authRouter;
