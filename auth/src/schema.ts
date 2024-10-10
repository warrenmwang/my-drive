import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().toLowerCase().email(),
  password: z.string(),
});

export type User = z.infer<typeof UserSchema>;

export const JWTPayloadSchema = z.object({
  userID: z.string(),
  exp: z.number(),
});

export type JWTPayload = z.infer<typeof JWTPayloadSchema>;
