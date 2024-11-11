import express, { Request, Response } from "express";
import { FileRetrieveQueryParamsSchema } from "../schema";
import File from "../mongodb/models/File";
import { AuthLocals } from "../middleware/auth";

const fileRetrieveRouter = express.Router();

// TODO: when files are large, they need to be streamed to the user chunk by chunk
// in a similar fashion to how they are retrieved from the user in the first place.

fileRetrieveRouter.get(
  "/files",
  async (req: Request, res: Response<any, AuthLocals>) => {
    const userID = res.locals.user.userID;
    const queryParams = FileRetrieveQueryParamsSchema.parse(req.query);

    // TODO: apply the filters from the query params.
    const userFiles = await File.find({ userID: userID }).exec();
  },
);

export default fileRetrieveRouter;
