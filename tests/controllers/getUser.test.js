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

describe("Get User", () => {
  const userId = new mongoose.Types.ObjectId("6548acd73d94c802451e0f8c");

  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});

    //test user
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

  describe("GET /api/v2/user/getuser", () => {
    it("should return authenticated user's details", async () => {
      const res = await request(app)
        .get("/api/v2/user/getuser")
        .set("Cookie", ["token=valid_token"]);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toHaveProperty("name", "Test User");
      expect(res.body.user).toHaveProperty("email", "testuser@example.com");
    });

    it("should return error if user not found", async () => {
      await User.deleteMany({});

      const res = await request(app)
        .get("/api/v2/user/getuser")
        .set("Cookie", ["token=valid_token"]);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("User not found");
    });
  });
});
