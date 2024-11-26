import express, { Request, Response } from "express";
import { FileRetrieveQueryParamsSchema } from "../schema";
import FileModel from "../mongodb/models/File";
import { AuthLocals } from "../middleware/auth";
import { consoleLogError } from "../utils";
import { ZodError } from "zod";
import { BODY_PARSER_LIMIT_NUM_BYTES } from "../constants";
import { Types } from "mongoose";

const router = express.Router();

// TODO: when files are large, they need to be streamed to the user chunk by chunk
// in a similar fashion to how they are retrieved from the user in the first place.

router.get("/list", async (req: Request, res: Response<any, AuthLocals>) => {
  try {
    const userID = res.locals.user.userID;
    const queryParams = FileRetrieveQueryParamsSchema.parse(req.query); // TODO: limit and order (asc or dsc)

    // get a list of all the files metadata for this user's files, no buffers
    const userFiles = await FileModel.find(
      { userID: userID },
      { content: 0 },
    ).exec();

    res.status(200).send(userFiles);
  } catch (err) {
    consoleLogError(err as Error | ZodError);
    res
      .status(500)
      .send({ message: `Server encountered an unexpected error.` });
  }
});

router.get(
  "/file/:fileID",
  async (req: Request, res: Response<any, AuthLocals>) => {
    const userID = res.locals.user.userID;
    const fileID = req.params.fileID;

    const file = await FileModel.findOne(
      {
        fileID: fileID,
        userID: userID,
      },
      { content: 0 },
    ).exec();

    if (!file) {
      return res.status(404).send({ message: "File not found" });
    }

    res.setHeader("Content-Type", file.fileMIMEType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(file.fileName)}"`,
    );
    res.setHeader("Content-Length", file.fileSize);

    const cursor = FileModel.collection
      .find({ fileID: file.fileID }, { projection: { content: 1 } })
      .stream();

    cursor.on("data", (doc) => {
      if (doc.content) {
        res.write(doc.content);
      }
    });

    // if (file.fileSize > BODY_PARSER_LIMIT_NUM_BYTES) {
    //   // single req
    //   res.setHeader("Content-Type", file.fileMIMEType);
    //   res.setHeader(
    //     "Content-Disposition",
    //     `attachment; filename="${file.fileName}"`,
    //   );
    //   return res.send(file.content);
    // } else {
    //   // stream it
    //   res.setHeader("Content-Type", file.fileMIMEType);
    //   res.setHeader(
    //     "Content-Disposition",
    //     `attachment; filename="${file.fileName}"`,
    //   );
    //   res.setHeader("Content-Length", file.fileSize);
    //
    //   for (let i = 0; i < file.fileSize; i += BODY_PARSER_LIMIT_NUM_BYTES) {
    //     const chunk = file.content.subarray(
    //       i,
    //       Math.min(i + BODY_PARSER_LIMIT_NUM_BYTES, file.fileSize),
    //     );
    //     res.write(chunk);
    //   }
    //
    //   res.end();
    // }
  },
);

// router.get(
//   "/file/single:fileID",
//   async (req: Request, res: Response<any, AuthLocals>) => {
//     const userID = res.locals.user.userID;
//     const fileID = req.query.fileID;
//
//     const file = await File.findOne({
//       fileID: fileID,
//       userID: userID,
//     }).exec();
//
//     if (!file) {
//       return res.status(404).send({ message: "File not found" });
//     }
//   },
// );

// router.get(
//   "/file/multipart/:fileID",
//   async (req: Request, res: Response<any, AuthLocals>) => {
//     try {
//       const userID = res.locals.user.userID;
//       const fileID = req.query.fileID;
//
//       // FIXME: currently loading entire file in mem, what if file larger than RAM?
//       const file = await FileModel.findOne({
//         fileID: fileID,
//         userID: userID,
//       }).exec();
//
//       if (!file) {
//         return res.status(404).send({ message: "File not found" });
//       }
//
//       res.setHeader("Content-Type", file.fileMIMEType);
//       res.setHeader(
//         "Content-Disposition",
//         `attachment; filename="${file.fileName}"`,
//       );
//       res.setHeader("Content-Length", file.fileSize);
//
//       for (let i = 0; i < file.fileSize; i += BODY_PARSER_LIMIT_NUM_BYTES) {
//         const chunk = file.content.subarray(
//           i,
//           Math.min(i + BODY_PARSER_LIMIT_NUM_BYTES, file.fileSize),
//         );
//         res.write(chunk);
//       }
//
//       res.end();
//     } catch (err) {
//       consoleLogError(err as Error | ZodError);
//       res
//         .status(500)
//         .send({ message: "Server encountered an unexpected error." });
//     }
//   },
// );

export default router;
