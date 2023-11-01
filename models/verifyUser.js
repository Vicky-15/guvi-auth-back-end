import mongoose from "mongoose";

const verifyUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  {
    collection: "verifyUser",
  }
);

const verifyUserModel = mongoose.model("verifyUser", verifyUserSchema);

export default verifyUserModel;
