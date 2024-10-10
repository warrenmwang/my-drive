import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

export const PORT = z.string().min(1).parse(process.env.PORT);
export const CLIENT_ORIGIN = z.string().min(1).parse(process.env.CLIENT_ORIGIN);
export const JWT_SECRET = z.string().parse(process.env.JWT_SECRET);
export const JWT_EXPIRATION_HOURS = z.coerce
  .number()
  .parse(process.env.JWT_EXPIRATION_HOURS);
export const NODE_ENV = z.string().min(1).parse(process.env.NODE_ENV);

if (NODE_ENV === "development") {
  console.log(`[AUTH]: PORT = ${PORT}`);
  console.log(`[AUTH]: CLIENT_ORIGIN = ${CLIENT_ORIGIN}`);
  console.log(`[AUTH]: JWT_SECRET = ${JWT_SECRET}`);
  console.log(`[AUTH]: JWT_EXPIRATION_HOURS = ${JWT_EXPIRATION_HOURS}`);
  console.log(`[AUTH]: NODE_ENV = ${NODE_ENV}`);
}
