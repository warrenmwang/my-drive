import { z } from "zod";

export const FileMetaDataSchema = z.object({
  sessionID: z.string(),
  fileID: z.string(),
  fileName: z.string(),
  fileSize: z.coerce.number(),
  fileMIMEType: z.string(),
  fileExtension: z.string(),
  fileLastModified: z.coerce.number(),
});
export type FileMetaData = z.infer<typeof FileMetaDataSchema>;

export const FileMetaDataMapSchema = z.map(z.string(), FileMetaDataSchema);

export const ChunkMetaDataSchema = z.object({
  sessionID: z.string(),
  fileID: z.string(),
  chunkIndex: z.coerce.number(),
  chunkSize: z.coerce.number(),
  uploadedBytes: z.coerce.number(),
  totalChunks: z.coerce.number(),
});
export type ChunkMetaData = z.infer<typeof ChunkMetaDataSchema>;

export const ChunkSchema = ChunkMetaDataSchema.extend({
  buffer: z.instanceof(Buffer),
});
export type Chunk = z.infer<typeof ChunkSchema>;

export const SessionMapSchema = z.map(
  z.string(),
  z.map(z.string(), FileMetaDataSchema),
);
export type SessionMap = z.infer<typeof SessionMapSchema>;

export const SessionMetaDataSchema = z.object({
  id: z.string(),
  files: z.array(FileMetaDataSchema),
});
export type SessionMetaData = z.infer<typeof SessionMetaDataSchema>;

export enum UploadStatus {
  Pending = "pending",
  Uploading = "uploading",
  Completed = "completed",
  Failed = "failed",
}

export const FileUploadProgressSchema = z.object({
  sessionID: z.string(),
  fileID: z.string(),
  uploadedBytes: z.coerce.number(),
  totalBytes: z.coerce.number(),
  status: z.nativeEnum(UploadStatus),
  error: z.string().optional(),
});

export type FileUploadProgress = z.infer<typeof FileUploadProgressSchema>;

export const JWTPayloadSchema = z.object({
  userID: z.string(),
  exp: z.number(),
});

export type JWTPayload = z.infer<typeof JWTPayloadSchema>;

export const FileRetrieveQueryParamsSchema = z.object({
  orderBy: z.enum(["uploadDate", "name"]).optional(),
  limit: z.number().optional(),
});
export type FileRetrieveQueryParams = z.infer<
  typeof FileRetrieveQueryParamsSchema
>;
