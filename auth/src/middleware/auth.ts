import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWTPayload, JWTPayloadSchema } from "../schema";
import { JWT_SECRET } from "../config";

// auth middleware function

export type MaybeAuthenticatedRequest = Request & {
  user?: JWTPayload;
};

export const authenticateToken = (
  req: MaybeAuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  // Check existence of token in cookie
  const token = req.cookies.auth_token_DIT;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  // Validate the JWT with server-kept secret
  try {
    req.user = JWTPayloadSchema.parse(jwt.verify(token, JWT_SECRET));
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid token." });
  }
};

// Similar to authenticateToken except will return with an OK status with a JSON body of false
// to indicate failure.
export const softAuthenticateToken = (
  req: MaybeAuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  // Check existence of token in cookie
  const token = req.cookies.auth_token_DIT;
  if (!token) {
    return res.status(200).json(false);
  }

  // Validate the JWT with server-kept secret
  try {
    req.user = JWTPayloadSchema.parse(jwt.verify(token, JWT_SECRET));
    next();
  } catch (err) {
    return res.status(200).json(false);
  }
};
