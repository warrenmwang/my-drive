import dotenv from "dotenv";
import { z } from "zod";
import { Chunk, FileMetaData, FileUploadProgress } from "./schema";
dotenv.config();

// TODO: the values that these three variables are holding should probably be synced with a database.
// create a class that wraps these variables privately and expose functions to modify them
// and everytime they are modified, they should be synced to a database.

// key: sessionID, value: {[fileID: string]: FileMetaData}
export const sessions = new Map<string, Map<string, FileMetaData>>();

// key: fileID, value: FileMetaData
export const fileUploadProgress = new Map<string, FileUploadProgress>();

// key: fileID, value: list of chunks
export const chunks = new Map<string, Chunk[]>();

export const PORT = z.string().min(1).parse(process.env.PORT);
export const CLIENT_ORIGIN = z.string().min(1).parse(process.env.CLIENT_ORIGIN);
export const NODE_ENV = z.string().min(1).parse(process.env.NODE_ENV);
export const JWT_SECRET = z.string().min(1).parse(process.env.JWT_SECRET);

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

