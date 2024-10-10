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
  next: NextFunction
) => {
  const token = req.cookies.auth_token_DIT;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    req.user = JWTPayloadSchema.parse(jwt.verify(token, JWT_SECRET));
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid token." });
  }
};
