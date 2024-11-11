import mongoose from "mongoose";

type File_T = {
  userID: string;
  fileID: string;
  fileName: string;
  fileSize: number;
  fileMIMEType: string;
  fileExtension: string;
  fileLastModified: number;
  content: Buffer;
  createdAt: Date;
} & mongoose.Document;

const FileSchema = new mongoose.Schema<File_T>({
  userID: { type: String, required: true },
  fileID: { type: String, required: true },
  fileName: { type: String, required: true },
  fileSize: { type: Number, required: true },
  fileMIMEType: { type: String, required: true },
  fileExtension: { type: String, required: true },
  fileLastModified: { type: Number, required: true },
  content: { type: Buffer, required: true },
  createdAt: { type: Date, default: Date.now },
});

const DocumentModel = mongoose.model<File_T>("File", FileSchema);

export default DocumentModel;
