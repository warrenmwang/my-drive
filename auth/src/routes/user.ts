import express, { Router, Request, Response } from "express";
import { authenticateToken, AuthLocals } from "../middleware/auth";
import { JWTPayloadSchema, UserSchema } from "../schema";
import { consoleLogError, createAndSetUserJWT, removeUserJWT } from "../utils";
import { UserModel } from "../models/User";
import { UPLOAD_SERVICE_ORIGIN } from "../config";
import mongoose from "mongoose";

const userRouter: Router = express.Router();

// NO AUTH
// Creates a user given email and password.
userRouter.route("/").post(async (req: Request, res: Response) => {
  try {
    const data = UserSchema.omit({ id: true }).parse(req.body); // omit ID because don't let client generate id.

    // Query to ensure no account with same email already exists
    const queryRes = await UserModel.find({ email: data.email }).exec();
    if (queryRes.length !== 0) {
      return res.status(400).json({
        message:
          "An account with the entered email exists already. Did you forget your password, well too bad! Use another email, lmao :P",
      });
    }

    const userID: string = crypto.randomUUID();
    const newUser = new UserModel({
      id: userID,
      email: data.email,
      password: data.password,
    });
    await newUser.save();

    return createAndSetUserJWT(userID, res)
      .status(201)
      .json({ message: "Account created." });
  } catch (err) {
    consoleLogError(err);
    return res.status(500).json({ message: JSON.stringify(err) });
  }
});

// AUTHED
// Retrieves a user
userRouter.get(
  "/",
  authenticateToken,
  async (_, res: Response<any, AuthLocals>) => {
    try {
      const authPayload = JWTPayloadSchema.parse(res.locals.user);
      const queryRes = await UserModel.find({
        id: authPayload.userID,
      }).exec();

      if (queryRes.length === 0) {
        return res.status(500).json({ error: "That user does not exist." });
      }

      if (queryRes.length > 1) {
        throw new Error("unexpected number of users matching that user ID");
      }

      const foundUser = queryRes[0];
      const userDetails = UserSchema.parse({
        id: foundUser.id,
        email: foundUser.email,
        password: foundUser.password,
      });
      return res.status(200).json(userDetails);
    } catch (err) {
      consoleLogError(err);
      return res.status(500).json(err);
    }
  },
);

// AUTHED
// Delete a user.
userRouter.delete(
  "/",
  authenticateToken,
  async (req, res: Response<any, AuthLocals>) => {
    const userID = res.locals.user.userID;

    try {
      const deleteRes = await UserModel.deleteOne({ id: userID });
      if (deleteRes.deletedCount === 0) throw new Error("User not found.");

      const deleteFilesURL = `${UPLOAD_SERVICE_ORIGIN}/delete/all`;
      const deleteFilesRes = await fetch(deleteFilesURL, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Cookie: req.headers.cookie || "", // Forward the original cookies including httpOnly JWT
          "Content-Type": "application/json",
        },
      });
      if (!deleteFilesRes.ok) throw new Error("Failed to delete user files");

      return removeUserJWT(res)
        .status(200)
        .json({ message: "Account deleted successfully." });
    } catch (err) {
      consoleLogError(err);
      return res.status(500).json({
        message: `Failed to delete account. Error: ${err instanceof Error ? err.message : "Unknown error"}`,
      });
    } finally {
    }
  },
);

export default userRouter;
