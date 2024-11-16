import express, { Request, Response } from "express";
import { FileRetrieveQueryParamsSchema } from "../schema";
import File from "../mongodb/models/File";
import { AuthLocals } from "../middleware/auth";
import { consoleLogError } from "../utils";
import { ZodError } from "zod";

const router = express.Router();

// TODO: when files are large, they need to be streamed to the user chunk by chunk
// in a similar fashion to how they are retrieved from the user in the first place.

router.get(
  "/list",
  async (req: Request, res: Response<any, AuthLocals>) => {
    try {
      const userID = res.locals.user.userID;
      const queryParams = FileRetrieveQueryParamsSchema.parse(req.query);

      // get a list of all the files metadata for this user's files, no buffers
      const userFiles = await File.find(
        { userID: userID },
        { content: 0 },
      ).exec();

      res.status(200).send(userFiles);
    } catch (err) {
      consoleLogError(err as Error | ZodError);
      res.status(500).send({ message: `Server encountered an unexpected error.`});
    }
  },
);

// TODO:
router.get("/file/single", async (req, res) => {

});

// TODO:
router.get("/file/multipart", async (req, res) => {

});

export default router;
