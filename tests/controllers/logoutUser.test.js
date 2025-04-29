const request = require("supertest");
const mongoose = require("mongoose");

//mock middleware
jest.mock("../../backend/middleware/auth", () => ({
  isAuthenticatedUser: (req, res, next) => {
    req.user = { id: "6548acd73d94c802451e0f8c" };
    next();
  },
}));

const app = require("../../backend/app");

describe("User Logout", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("GET /api/v2/user/logout", () => {
    it("should logout user and clear cookie", async () => {
      const res = await request(app)
        .get("/api/v2/user/logout")
        .set("Cookie", ["token=valid_token"]);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Logged out Successfully");

      const cookies = res.headers["set-cookie"];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toMatch(/token=j%3Anull;/);
      expect(cookies[0]).toMatch(/Expires=/);
    });
  });
});
