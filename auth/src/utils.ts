import { JWT_EXPIRATION_HOURS, JWT_SECRET } from "./config";
import { JWTPayloadSchema } from "./schema";
import jwt from "jsonwebtoken";

export function createUserJWT(userID: string): {
  token: string;
  expirationTimeSeconds: number;
} {
  const expirationTimeSeconds: number = 3600 * JWT_EXPIRATION_HOURS;
  const payload = JWTPayloadSchema.parse({
    userID: userID,
    exp: Math.floor(Date.now() / 1000) + expirationTimeSeconds, // in seconds
  });

  // Sign JWT
  const token: string = jwt.sign(payload, JWT_SECRET);
  return { token, expirationTimeSeconds };
}
