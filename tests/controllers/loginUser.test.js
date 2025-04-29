const request = require("supertest");
const mongoose = require("mongoose");
const User = require("../../backend/model/user");

const app = require("../../backend/app");

describe("User Login", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});

    //test user
    const testUser = new User({
      name: "Test User",
      email: "testuser@example.com",
      password: "Password123",
      avatar: {
        url: "test-image.jpg",
        public_id: "test-image-123456",
      },
    });

    await testUser.save();
  });

  describe("POST /api/v2/user/login-user", () => {
    it("should login user with valid credentials", async () => {
      const res = await request(app).post("/api/v2/user/login-user").send({
        email: "testuser@example.com",
        password: "Password123",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("token");
      expect(res.body.success).toBe(true);
      expect(res.body.user).toHaveProperty("name", "Test User");
    });

    it("should return error with invalid email", async () => {
      const res = await request(app).post("/api/v2/user/login-user").send({
        email: "nonexistent@example.com",
        password: "Password123",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("No user found");
    });

    it("should return error with invalid password", async () => {
      const res = await request(app).post("/api/v2/user/login-user").send({
        email: "testuser@example.com",
        password: "WrongPassword",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid email or password");
    });

    it("should return error with missing credentials", async () => {
      const res = await request(app).post("/api/v2/user/login-user").send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Please enter email and password");
    });
  });
});
