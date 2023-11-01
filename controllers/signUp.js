import { configDotenv } from "dotenv";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import sendMail from "../controllers/mailService.js";
import verifyUserModel from "../models/verifyUser.js";
import UserModel from "../models/user.js";
configDotenv();

const InsertVerifyUser = async (name, email, password) => {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const token = generateToken(email);

    const activationLink = `https://express-bees.onrender.com/signup/${token}`;

    const mailContent = `
    <h1>Welcome to our app</h1>
<p>
  Thanks for signing up with us! Click the following link to activate your
  account:
</p>
<br />
<a target="_blank" href="${activationLink}">Activation Link</a>
    `;

    const newVerifyUser = new verifyUserModel({
      name,
      email,
      password: hashedPassword,
      token,
    });

    await newVerifyUser.save();

    sendMail(email, "Verify User", mailContent);
  } catch (error) {
    throw error;
  }
};

export default InsertVerifyUser;

export const InsertSignUpUser = async (token) => {
  try {
    const verifyUser = await verifyUserModel.findOne({ token });

    if (verifyUser) {
      const { name, email, password } = verifyUser;

      const user = new UserModel({
        name,
        email,
        password,
        forgetPassword: {},
        // forgotPassword, is stored temporarly when needed
        // token: we add when user login
        //joinedOn: its by default value
      });

      await user.save();

      await verifyUser.deleteOne();

      const mailContent = `
          <h1>Registration Successfull</h1>
      <p>
        Thanks for signing up with us!
      </p>
          `;

      sendMail(user.email, "Registration Successfull", mailContent);

      return `
          <h1>Registration Successfull</h1>
      <p>
        Thanks for signing up with us!
      </p>
          `;
    } else {
      return `
      <h1>Registration Failed</h1>
  <p>
    Link Expired, try again later
  </p>
      `;
    }
  } catch (error) {
    throw new Error(`
    <h1>Registration Failed</h1>
<p>
  Unexpected Error happened, try again later
</p>
    `);
  }
};

function generateToken(email) {
  const token = jwt.sign(email, process.env.jwt_signup_privateKey);
  return token;
}
