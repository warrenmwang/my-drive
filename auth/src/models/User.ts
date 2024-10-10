import mongoose from "mongoose";

const UserSchemaDB = new mongoose.Schema({
  id: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const UserModelDB = mongoose.model("User", UserSchemaDB);

export { UserModelDB };
