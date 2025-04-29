const dotenv = require("dotenv");
dotenv.config();

process.env.NODE_ENV = "test";
process.env.DB_URL = "mongodb://localhost:27017/test";
process.env.JWT_EXPIRES = "1h";
process.env.JWT_SECRET_KEY = "test-jwt-secret";
process.env.ACTIVATION_SECRET_KEY = "testsecretkey";

//mock implementations for all controllers
const mockControllerFactory = () => {
  const express = require("express");
  const router = express.Router();
  router.get("/", (req, res) => res.status(200).json({ success: true }));
  return router;
};

// jest.mock("../backend/controller/user", () => mockControllerFactory());
jest.mock("../backend/controller/shop", () => mockControllerFactory());
jest.mock("../backend/controller/product", () => mockControllerFactory());
jest.mock("../backend/controller/order", () => mockControllerFactory());
// jest.mock("../backend/controller/calendar", () => mockControllerFactory());
jest.mock("../backend/controller/admin", () => mockControllerFactory());
