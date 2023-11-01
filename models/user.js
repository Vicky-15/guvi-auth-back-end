import mongoose from "mongoose";

// we skipped required since we add it from server
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    joinedOn: {
      type: Date,
      default: Date.now(),
    },
    forgetPassword: {
      time: Date,
      otp: String,
    },
    token: {
      type: String,
    },
  },
  {
    collection: "user",
  }
);

// if we dont gave the collection in schema,
// {
//   collection: "users",
// }
// it will consider collection name same as model
// mongoose.model("users", userSchema);

const userModel = mongoose.model("user", userSchema);

export default userModel;
