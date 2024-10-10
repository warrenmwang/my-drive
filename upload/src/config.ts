import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

export const PORT = z.string().min(1).parse(process.env.PORT);
export const CLIENT_ORIGIN = z.string().min(1).parse(process.env.CLIENT_ORIGIN);
export const NODE_ENV = z.string().min(1).parse(process.env.NODE_ENV);
export const JWT_SECRET = z.string().min(1).parse(process.env.JWT_SECRET);
