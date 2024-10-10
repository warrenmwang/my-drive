import express, { Router, Request, Response } from "express";
import {
  authenticateToken,
  MaybeAuthenticatedRequest,
} from "../middleware/auth";
import { JWTPayload, JWTPayloadSchema, UserSchema } from "../schema";
import { v4 as uuidv4 } from "uuid";
import { User } from "../schema";
import { createUserJWT } from "../utils";
import { CLIENT_ORIGIN, NODE_ENV } from "../config";

export const users: User[] = [];

const userRouter: Router = express.Router();

// Creates a user given email and password.
userRouter.route("/").post((req: Request, res: Response) => {
  try {
    const data = UserSchema.omit({ id: true }).parse(req.body);
    const email = data.email;
    const password = data.password;
    // if (email === "") {
    //   res.status(400).json({ message: "empty email" });
    //   return;
    // }
    // if (password === "") {
    //   res.status(400).json({ message: "empty password" });
    //   return;
    // }

    // Ensure no account with same email already exists
    if (users.findIndex((user) => user.email === email) !== -1) {
      return res
        .status(400)
        .json({ message: "An account with the entered email exists already." });
    }

    // save in db, for now just save in global list
    const id: string = uuidv4();

    // TODO: currently using in memory array, in future use DB
    users.push({ id, email, password } as User);

    // After creating user account we will auth them:
    const { token, expirationTimeSeconds } = createUserJWT(id);
    const maxAge = 1000 * expirationTimeSeconds;

    // Set JWT in cookie
    res.cookie("auth_token_DIT", token, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      maxAge: maxAge, // field unit is milliseconds
      path: "/",
      // sameSite: "none",
      // domain: CLIENT_ORIGIN,
    });

    return res.status(201).json({ message: "Account created." });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// Retrieves a user after authenticated.
userRouter.get(
  "/",
  authenticateToken,
  (req: MaybeAuthenticatedRequest, res: Response) => {
    try {
      const authPayload = JWTPayloadSchema.parse(req.user);
      // TODO: currently using in memory array, in future use DB
      const foundUser = users.find((user) => user.id === authPayload.userID);
      if (foundUser === undefined) {
        return res.status(500).json({ error: "That user does not exist." });
      }
      const userDetails = UserSchema.parse(foundUser);
      return res.status(200).json(userDetails);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);

// Delete a user given their email and password.
userRouter.delete(
  "/",
  authenticateToken,
  (req: MaybeAuthenticatedRequest, res: Response) => {
    try {
      const authPayload = JWTPayloadSchema.parse(req.user);
      // TODO: current users is just an in memory array, in future use DB
      const foundUserIndex = users.findIndex(
        (user) => user.id === authPayload.userID
      );
      if (foundUserIndex === undefined) {
        return res.status(500).json({ error: "That user does not exist." });
      }
      users.splice(foundUserIndex, 1);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);

export default userRouter;
