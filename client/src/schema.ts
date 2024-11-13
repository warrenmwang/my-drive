import { z } from "zod";

export const FileMetaDataSchema = z.object({
  sessionID: z.string(),
  fileID: z.string(),
  fileName: z.string(),
  fileSize: z.number(),
  fileMIMEType: z.string(),
  fileExtension: z.string(),
  fileLastModified: z.number(),
});
export type FileMetaData = z.infer<typeof FileMetaDataSchema>;

export const ChunkMetaDataSchema = z.object({
  sessionID: z.string(),
  fileID: z.string(),
  chunkIndex: z.number(),
  chunkSize: z.number(),
  uploadedBytes: z.number(),
  totalChunks: z.number(),
});
export type ChunkMetaData = z.infer<typeof ChunkMetaDataSchema>;

export interface UploadProgress {
  fileID: string;
  uploadedBytes: number;
  totalBytes: number;
  status: "pending" | "uploading" | "completed" | "failed";
  error?: string; // optional error message
}

export const SessionMetaDataSchema = z.object({
  id: z.string(),
  files: z.array(FileMetaDataSchema),
});
export type SessionMetaData = z.infer<typeof SessionMetaDataSchema>;

export const BasicLoginInfoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export type BasicLoginInfo = z.infer<typeof BasicLoginInfoSchema>;

export const FileMetaDataReceivedSchema = z.object({
  userID: z.string(),
  fileID: z.string(),
  fileName: z.string(),
  fileSize: z.number(),
  fileMIMEType: z.string(),
  fileExtension: z.string(),
  fileLastModified: z.number(),
  createdAt: z.string(),
});
export type FileMetaDataReceived = z.infer<typeof FileMetaDataReceivedSchema>;
