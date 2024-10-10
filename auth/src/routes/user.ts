import express, { Router, Request, Response } from "express";
import {
  authenticateToken,
  MaybeAuthenticatedRequest,
} from "../middleware/auth";
import { JWTPayloadSchema, UserSchema } from "../schema";
import { consoleLogError, createAndSetUserJWT, removeUserJWT } from "../utils";
import { UserModelDB } from "../models/User";

const userRouter: Router = express.Router();

// NO AUTH
// Creates a user given email and password.
userRouter.route("/").post(async (req: Request, res: Response) => {
  try {
    // Parse user data for new account
    const data = UserSchema.omit({ id: true }).parse(req.body); // omit ID because don't let client generate id.

    // Query to ensure no account with same email already exists
    const queryRes = await UserModelDB.find({ email: data.email }).exec();
    if (queryRes.length !== 0) {
      return res
        .status(400)
        .json({ message: "An account with the entered email exists already." });
    }

    // Create new user with details and save to db
    const userID: string = crypto.randomUUID();
    const newUser = new UserModelDB({
      id: userID,
      email: data.email,
      password: data.password,
    });
    await newUser.save();

    // Set JWT in cookie and return ok
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
  async (req: MaybeAuthenticatedRequest, res: Response) => {
    try {
      const authPayload = JWTPayloadSchema.parse(req.user);
      const queryRes = await UserModelDB.find({
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
  async (req: MaybeAuthenticatedRequest, res: Response) => {
    try {
      const authPayload = JWTPayloadSchema.parse(req.user);

      // Delete their details from DB
      await UserModelDB.deleteOne({ id: authPayload.userID });

      // Revoke their token
      return removeUserJWT(res)
        .status(200)
        .json({ message: "Account deleted successfully." });
    } catch (err) {
      consoleLogError(err);
      return res.status(500).json(err);
    }
  },
);

export default userRouter;
