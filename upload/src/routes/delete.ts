import express, { Response } from "express";
import { consoleLogError } from "../utils";
import { AuthLocals } from "../middleware/auth";
import FileModel from "../mongodb/models/File";

const router = express.Router();

router.delete("/all", async (_, res: Response<any, AuthLocals>) => {
  try {
    const userID = res.locals.user.userID;
    const deleteFilesRes = await FileModel.deleteMany({
      userID: userID,
    }).exec();
    if (!deleteFilesRes.acknowledged)
      throw new Error("Could not delete user files.");
    return res.status(200).send({ message: "All files deleted. " });
  } catch (err) {
    consoleLogError(err as Error);
    return res
      .status(500)
      .send({ message: `Server encountered an unexpected error.` });
  }
});

router.delete("/:fileID", async (req, res: Response<any, AuthLocals>) => {
  try {
    const userID = res.locals.user.userID;
    const fileID = req.params.fileID;
    await FileModel.deleteOne({ userID: userID, fileID: fileID }).exec();
    res.status(200).send({ message: "File deleted.", fileID: fileID });
  } catch (err) {
    consoleLogError(err as Error);
    res
      .status(500)
      .send({ message: `Server encountered an unexpected error.` });
  }
});


export default router;
