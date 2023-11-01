import express from "express";
import cors from "cors";
// project imports
import connectDb from "./db.js";
import { connectRedis } from "./redis.js";

import signUpRouter from "./routes/signUp.js";
import loginRouter from "./routes/login.js";
import homeRouter from "./routes/home.js";

const app = express();
const PORT = 4000;

// json for parse and stringify the req and res, respectively
app.use(express.json());
// cors for setting constraints to access server from client ip, currently set to all ip's
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.send("hello there");
});

// on every req with signup route will be goig through this middleware
// middlewares generally used for checking authenticate users
app.use("/signup", signUpRouter);
app.use("/login", loginRouter);
app.use("/home", homeRouter);

connectDb().then(() => {
  connectRedis().then(() => {
    app.listen(PORT, () => {
      console.log("app running now at : ", PORT);
    });
  });
});
