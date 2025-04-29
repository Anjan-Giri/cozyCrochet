const request = require("supertest");
const mongoose = require("mongoose");
const User = require("../../backend/model/user");
const fs = require("fs");

//mock required files to avoid loading actual implementation
jest.mock("../../backend/controller/user", () => {
  const express = require("express");
  const router = express.Router();
  router.get("/", (req, res) => res.status(200).json({ success: true }));
  return router;
});

//mock fs module
jest.mock("fs", () => ({
  existsSync: jest.fn(() => true),
  unlinkSync: jest.fn(),
}));

//mock middleware
jest.mock("../../backend/middleware/auth", () => ({
  isAdmin: (req, res, next) => {
    req.admin = { id: "6548acd73d94c802451e0f8c" };
    next();
  },
}));

//load app
const app = require("../../backend/app");

describe("Admin User Management", () => {
  const userId1 = new mongoose.Types.ObjectId();
  const userId2 = new mongoose.Types.ObjectId();

  const mockUsers = [
    {
      _id: userId1,
      name: "Test User",
      email: "testuser@example.com",
      password: "hashedpassword123",
      avatar: {
        url: "test-avatar.jpg",
        public_id: "test-avatar",
      },
      createdAt: new Date(),
    },
    {
      _id: userId2,
      name: "Another User",
      email: "anotheruser@example.com",
      password: "hashedpassword456",
      avatar: {
        url: "another-avatar.jpg",
        public_id: "another-avatar",
      },
      createdAt: new Date(),
    },
  ];

  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await User.create(mockUsers);
  });

  describe("GET /api/v2/admin/all-users", () => {
    it("should list all users", async () => {
      const res = await request(app)
        .get("/api/v2/admin/all-users")
        .set("Cookie", ["admin_token=valid_token"]);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.users)).toBe(true);
      expect(res.body.users.length).toBe(2);

      expect(res.body.users[0]).toHaveProperty("name");
      expect(res.body.users[0]).toHaveProperty("email");
      expect(res.body.users[0]).toHaveProperty("avatar");
    });
  });

  describe("DELETE /api/v2/admin/delete-user/:id", () => {
    it("should delete a user by ID", async () => {
      const res = await request(app)
        .delete(`/api/v2/admin/delete-user/${userId1.toString()}`)
        .set("Cookie", ["admin_token=valid_token"]);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("User deleted successfully");

      const userExists = await User.findById(userId1);
      expect(userExists).toBeFalsy();

      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.unlinkSync).toHaveBeenCalled();
    });

    it("should return 404 for non-existent user", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .delete(`/api/v2/admin/delete-user/${nonExistentId.toString()}`)
        .set("Cookie", ["admin_token=valid_token"]);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
