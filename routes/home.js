import express from "express";
import { AuthorizeUser } from "../controllers/login.js";

const homeRouter = express.Router();

homeRouter.get("/", async (req, res) => {
  const { authtoken } = req.headers;

  try {
    const result = await AuthorizeUser(authtoken);

    if (result === false) {
      res.status(401).send("unauthenticated");
    } else {
      res.status(200).send(result);
    }
  } catch (error) {
    console.log(error);
    res.status(401).send("Server Busy");
  }
  //
});

export default homeRouter;
