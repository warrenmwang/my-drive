import { Schema, model, Document } from "mongoose";

type TDocument = {
  fileName: string;
  fileID: string;
  fileLastModified: number;
  fileSize: number;
  fileMIMEType: string;
  fileExtension: string;
  content: Buffer;
  createdAt: Date;
} & Document;

const DocumentSchema = new Schema<TDocument>({
  fileName: { type: String, required: true },
  fileID: { type: String, required: true },
  fileLastModified: { type: Number, required: true },
  fileSize: { type: Number, required: true },
  fileMIMEType: { type: String, required: true },
  content: { type: Buffer, required: true },
  createdAt: { type: Date, default: Date.now },
});

const DocumentModel = model<TDocument>("Document", DocumentSchema);

export default DocumentModel;
