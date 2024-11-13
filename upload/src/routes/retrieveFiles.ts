import express, { Request, Response } from "express";
import { FileRetrieveQueryParamsSchema } from "../schema";
import File from "../mongodb/models/File";
import { AuthLocals } from "../middleware/auth";

const router = express.Router();

// TODO: when files are large, they need to be streamed to the user chunk by chunk
// in a similar fashion to how they are retrieved from the user in the first place.

router.get(
  "/list",
  async (req: Request, res: Response<any, AuthLocals>) => {
    const userID = res.locals.user.userID;
    const queryParams = FileRetrieveQueryParamsSchema.parse(req.query);

    // get a list of all the files metadata for this user's files, no buffers
    const userFiles = await File.find(
      { userID: userID },
      { content: 0 },
    ).exec();

    res.status(200).send(userFiles);
  },
);

// TODO:
router.get("/file/single", async (req, res) => {});

// TODO:
router.get("/file/multipart", async (req, res) => {});

export default router;
