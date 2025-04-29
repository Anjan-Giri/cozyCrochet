const request = require("supertest");
const mongoose = require("mongoose");
const Admin = require("../../backend/model/admin");
const jwt = require("jsonwebtoken");

jest.mock("../../backend/controller/user", () => {
  const express = require("express");
  const router = express.Router();
  router.get("/getuser", (req, res) => res.status(200).json({ success: true }));
  return router;
});

//mock middleware
jest.mock("../../backend/middleware/auth", () => ({
  isAdmin: (req, res, next) => {
    req.admin = { id: "6548acd73d94c802451e0f8c" };
    next();
  },
  isAuthenticatedUser: (req, res, next) => {
    req.user = { id: "testuser123" };
    next();
  },
}));

const app = require("../../backend/app");

describe("Admin Authentication Controller", () => {
  let adminToken;

  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL);

    //test admin
    await Admin.deleteMany({});
    await Admin.create({
      _id: "6548acd73d94c802451e0f8c",
      name: "Test Admin",
      email: "testadmin@example.com",
      password: "password123",
      avatar: {
        url: "default-admin.png",
        public_id: "default-admin",
      },
    });
  });

  afterAll(async () => {
    await Admin.deleteMany({});
    await mongoose.connection.close();
  });

  describe("POST /api/v2/admin/login-admin", () => {
    it("should login admin with correct credentials", async () => {
      const res = await request(app).post("/api/v2/admin/login-admin").send({
        email: "testadmin@example.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty("token");
      adminToken = res.body.token;
    });

    it("should not login with incorrect password", async () => {
      const res = await request(app).post("/api/v2/admin/login-admin").send({
        email: "testadmin@example.com",
        password: "wrongpassword",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should not login with non-existent email", async () => {
      const res = await request(app).post("/api/v2/admin/login-admin").send({
        email: "nonexistent@example.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should validate required fields", async () => {
      const res = await request(app).post("/api/v2/admin/login-admin").send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/v2/admin/logout", () => {
    it("should logout admin successfully", async () => {
      const res = await request(app)
        .get("/api/v2/admin/logout")
        .set("Cookie", [`admin_token=${adminToken}`]);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Logged out successfully");
    });
  });

  describe("GET /api/v2/admin/admin-details", () => {
    it("should get admin details", async () => {
      const res = await request(app)
        .get("/api/v2/admin/admin-details")
        .set("Cookie", [`admin_token=${adminToken}`]);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.admin).toHaveProperty("name", "Test Admin");
      expect(res.body.admin).toHaveProperty("email", "testadmin@example.com");
    });
  });
});
