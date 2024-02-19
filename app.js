const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

const todoRouter = require("./router/Todo");
const authRouter = require("./router/auth");

const corsOptions = require("./config/corsOptions");
require("dotenv").config();

//middlewares
app.use(express.json());
app.use(cors(corsOptions));

//   routes
app.use("/auth", authRouter)
app.use("/todo", todoRouter);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("connected to the database");
  })
  .catch((err) => {
    console.log(`Error in connecting to the database::`, err);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App is listening to the port 8080`);
});
