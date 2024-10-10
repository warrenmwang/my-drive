import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWTPayload } from "../schema";
import { JWT_SECRET } from "../config";

// auth middleware function
export type AuthenticatedRequest = Request & {
  user?: JWTPayload;
};

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.auth_token_DIT;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid token." });
  }
};
