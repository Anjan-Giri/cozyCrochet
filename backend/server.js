// const app = require("./app");
// const connectDatabase = require("./db/Database");

// //handle uncaught exceptions
// process.on("uncaughtException", (err) => {
//   console.log(`Error: ${err.message}`);
//   console.log("Shutting down the server to handle uncaught exception");
// });

// //config

// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config({
//     path: "backend/config/.env",
//   });
// }

// //database connect

// connectDatabase();

// //server creation

// const server = app.listen(process.env.PORT, () => {
//   console.log(`Server is running on http://localhost:${process.env.PORT}`);
// });

// //unhandled promise rejections

// process.on("unhandledRejection", (err) => {
//   console.log(`Error: ${err.message}`);
//   console.log("Shutting down the server due to unhandled promise rejection");

//   server.close(() => {
//     process.exit(1);
//   });
// });

const mongoose = require("mongoose");
const app = require("./app");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/.env" });

const database = process.env.DB_URL;

mongoose
  .connect(database)
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log("Failed to connect to the database", error.message);
  });

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
