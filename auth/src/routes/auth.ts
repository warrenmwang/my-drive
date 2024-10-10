import express, { Router, Request, Response } from "express";
import { User, JWTPayload, UserSchema } from "../schema";
import dotenv from "dotenv";
import { users } from "./user";
import {
  MaybeAuthenticatedRequest,
  authenticateToken,
} from "../middleware/auth";
import { createUserJWT } from "../utils";
import { CLIENT_ORIGIN, NODE_ENV } from "../config";
dotenv.config();

const authRouter: Router = express.Router();

authRouter.post("/login", (req: Request, res: Response) => {
  try {
    // take email and password, validate them, then give a jwt
    // ensure email and password are present.
    const data = UserSchema.omit({ id: true }).parse(req.body);
    const email: string = data.email || "";
    const password: string = data.password || "";
    if (email === "") {
      return res.status(400).json({ message: "empty email" });
    }
    if (password === "") {
      return res.status(400).json({ message: "empty password" });
    }

    // find a user with matching email and password
    const matchedUser: User | undefined = users.find(
      (user) => user.email === email,
    );
    if (matchedUser === undefined) {
      console.log(
        "error: user tried to login with an account that we have no email of.",
      );
      return res
        .status(400)
        .json({ message: "no account with that email found" });
    }
    if (matchedUser.password !== password) {
      return res
        .status(400)
        .json({ message: "incorrect password for account" });
    }
    const userID: string = matchedUser.id;

    const { token, expirationTimeSeconds } = createUserJWT(userID);
    const maxAge = expirationTimeSeconds * 1000;
    // console.log(`maxAge: ${maxAge}`);
    //

    console.log("[AUTH]: Attempting to set cookie");
    console.log(`[AUTH]: Token: ${token}`);
    console.log(`[AUTH]: MaxAge: ${maxAge}`);

    // Set JWT in cookie and respond ok
    res.cookie("auth_token_DIT", token, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      maxAge: maxAge, // field unit is milliseconds
      path: "/",
      // domain: CLIENT_ORIGIN,
      sameSite: "none",
    });

    console.log("[AUTH]: Cookie set attempt completed");

    return res.status(200).json({ message: "Account logged in." });
  } catch (err) {
    console.error(`[AUTH]: ERROR - ${err}`);
    return res.status(500).json(err);
  }
});

authRouter.get(
  "/status",
  authenticateToken,
  (req: MaybeAuthenticatedRequest, res: Response) => {
    if (req?.user === undefined) {
      res.status(400).json(false);
    } else {
      res.status(200).json(true);
    }
  },
);

// TODO: logout the user by invalidating their refresh token and remove their access token from cookies
authRouter.get(
  "/logout",
  authenticateToken,
  (req: MaybeAuthenticatedRequest, res: Response) => {},
);

// TODO: refresh the user's access token
authRouter.get(
  "/refresh",
  authenticateToken,
  (req: MaybeAuthenticatedRequest, res: Response) => {},
);

export default authRouter;
