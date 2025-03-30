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
