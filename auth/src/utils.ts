import express from "express";
import { ZodError } from "zod";
import { JWT_EXPIRATION_HOURS, JWT_SECRET, NODE_ENV } from "./config";
import { JWTPayloadSchema } from "./schema";
import jwt from "jsonwebtoken";

export function createAndSetUserJWT(
  userID: string,
  res: express.Response,
): express.Response {
  const expirationTimeSeconds: number = 3600 * JWT_EXPIRATION_HOURS;
  const payload = JWTPayloadSchema.parse({
    userID: userID,
    exp: Math.floor(Date.now() / 1000) + expirationTimeSeconds, // in seconds
  });

  const token: string = jwt.sign(payload, JWT_SECRET);
  const maxAge = 1000 * expirationTimeSeconds; // field unit is milliseconds;

  return res.cookie("auth_token_DIT", token, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    maxAge: maxAge,
    path: "/",
  });
}

export function removeUserJWT(res: express.Response): express.Response {
  return res.cookie("auth_token_DIT", "", {
    httpOnly: true,
    secure: NODE_ENV === "production",
    expires: new Date(0),
    path: "/",
  });
}

export function consoleLogError(err: Error | ZodError) {
  console.log(`[UPLOAD]: Error - ${err.message}`);
}
