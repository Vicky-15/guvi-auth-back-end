import userModel from "../models/user.js";
import bcrypt from "bcrypt";
import { configDotenv } from "dotenv";
import jwt from "jsonwebtoken";
import redisClient from "../redis.js";

configDotenv();

// we use this ti check if user exists or not, also for login, since user exits
const CheckUser = async (email) => {
  try {
    const user = await userModel.findOne({ email });

    if (user) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
};

export const AuthenticateUser = async (email, password) => {
  try {
    //first we try is there a user exist
    const validUser = await userModel.findOne({ email });
    if (validUser) {
      const validPassword = await bcrypt.compare(password, validUser.password);

      if (validPassword) {
        // have to generate token and add it to the user, and respond token to client
        // also make a copy to redis

        const dynamicToken = Date.now();

        const token = jwt.sign(
          JSON.stringify({ email, dynamicToken }),
          process.env.jwt_login_privateKey
        );

        const response = {
          id: validUser._id,
          name: validUser.name,
          email: validUser.email,
          token,
          status: true,
        };

        // copying into redis
        await redisClient.set(`key-${email}`, JSON.stringify(response));

        //we did not used it anyway,  new:true for returning modified doc, otherwise returns old Doc details
        await userModel.findOneAndUpdate(
          { email },
          { $set: { token } }
          // { new: true }
        );

        return response;
      } else {
        return "Invalid Password";
      }
    } else {
      return "User Not Found";
    }
  } catch (error) {
    throw new Error("Server Busy");
  }
};

export const AuthorizeUser = async (token) => {
  try {
    const email = jwt.verify(token, process.env.jwt_login_privateKey).email;

    if (email) {
      const cachedValue = await redisClient.get(`key-${email}`);

      if (cachedValue) {
        console.log("from redis");
        const UserData = JSON.parse(cachedValue);
        return UserData;
      } else {
        console.log("from db");
        const UserData = await userModel.findOne({ email });

        const response = {
          id: UserData._id,
          name: UserData.name,
          email: UserData.email,
          token: UserData.token,
          status: true,
        };

        return response;
      }
    }

    return false;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default CheckUser;
