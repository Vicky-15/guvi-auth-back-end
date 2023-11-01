import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.Mongoose_Url;

const connectDb = async () => {
  try {
    await mongoose.connect(connectionString);
    console.log("connect to db");
  } catch (error) {
    console.log("got error connecting DB", error);
  }
};

export default connectDb;
