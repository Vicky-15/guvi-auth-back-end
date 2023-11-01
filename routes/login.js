import express from "express";
import { AuthenticateUser } from "../controllers/login.js";

const loginRouter = express.Router();

loginRouter.post("/", async (req, res) => {
  const { email, password } = await req.body;

  try {
    const response = await AuthenticateUser(email, password);

    if (typeof response !== "string") {
      res.status(200).json({ token: response.token });
    } else {
      res.status(401).send(response);
    }
  } catch (error) {
    res.status(401).send(error.message);
  }
});

export default loginRouter;
