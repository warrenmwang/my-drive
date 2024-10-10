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

export const MONGO_ORIGIN = z.string().min(1).parse(process.env.MONGO_ORIGIN);
export const MONGO_INITDB_ROOT_USERNAME = z
  .string()
  .min(1)
  .parse(process.env.MONGO_INITDB_ROOT_USERNAME);
export const MONGO_INITDB_ROOT_PASSWORD = z
  .string()
  .min(1)
  .parse(process.env.MONGO_INITDB_ROOT_PASSWORD);
export const MONGO_INITDB_DATABASE = z
  .string()
  .min(1)
  .parse(process.env.MONGO_INITDB_DATABASE);
