const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
// const fileUpload = require("express-fileupload");
const cors = require("cors");

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static("uploads"));
// app.use(fileUpload({ useTempFiles: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

//routes import

const user = require("./controller/user");

app.use("/api/v2/user", user);

//config

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({
    path: "backend/config/.env",
  });
}

//errorHandling

app.use(ErrorHandler);

module.exports = app;
