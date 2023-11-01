import express from "express";
import CheckUser from "../controllers/login.js";
import InsertVerifyUser, { InsertSignUpUser } from "../controllers/signUp.js";

const signUpRouter = express.Router();

signUpRouter.get("/:token", async (req, res) => {
  try {
    const response = await InsertSignUpUser(req.params.token);

    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

signUpRouter.post("/verify", async (req, res) => {
  const { name, email, password } = await req.body;
  console.log(name, email, password);

  //we have to check whether the user already exists, with controller
  try {
    const isUserExist = await CheckUser(email);

    if (isUserExist === false) {
      // create token , add to verifyuserModel, send mail

      const result = await InsertVerifyUser(name, email, password);

      return res.status(200).send("mail sent successfully");
    } else if (isUserExist === true)
      return res.status(200).send("user already exists");
  } catch (error) {
    return res.status(500).send("server busy");
  }
});

export default signUpRouter;
