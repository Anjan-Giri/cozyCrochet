const request = require("supertest");
const mongoose = require("mongoose");
const User = require("../../backend/model/user");

//mock middleware
jest.mock("../../backend/middleware/auth", () => ({
  isAuthenticatedUser: (req, res, next) => {
    req.user = { id: "6548acd73d94c802451e0f8c" };
    next();
  },
}));

const app = require("../../backend/app");

describe("Update User", () => {
  const userId = new mongoose.Types.ObjectId("6548acd73d94c802451e0f8c");

  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});

    // test user
    await User.create({
      _id: userId,
      name: "Test User",
      email: "testuser@example.com",
      password: "Password123",
      avatar: {
        url: "test-image.jpg",
        public_id: "test-image-123456",
      },
    });
  });

  describe("PUT /api/v2/user/update-user", () => {
    it("should update user info", async () => {
      const res = await request(app)
        .put("/api/v2/user/update-user")
        .set("Cookie", ["token=valid_token"])
        .send({
          name: "Updated Name",
          email: "testuser@example.com",
          password: "Password123",
          phoneNumber: "1234567890",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.name).toBe("Updated Name");
      expect(res.body.user.phoneNumber).toBe(1234567890);
    });

    it("should return error with missing email or password", async () => {
      const res = await request(app)
        .put("/api/v2/user/update-user")
        .set("Cookie", ["token=valid_token"])
        .send({
          name: "Updated Name",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Email and password are required");
    });

    it("should return error with incorrect password", async () => {
      const res = await request(app)
        .put("/api/v2/user/update-user")
        .set("Cookie", ["token=valid_token"])
        .send({
          name: "Updated Name",
          email: "testuser@example.com",
          password: "WrongPassword",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid password");
    });

    it("should return error with non-existent user", async () => {
      const res = await request(app)
        .put("/api/v2/user/update-user")
        .set("Cookie", ["token=valid_token"])
        .send({
          name: "Updated Name",
          email: "nonexistent@example.com",
          password: "Password123",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("User not found");
    });
  });
});
