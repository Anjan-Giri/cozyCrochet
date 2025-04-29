const request = require("supertest");
const mongoose = require("mongoose");
const Shop = require("../../backend/model/shop");

// Mock the authentication middleware
jest.mock("../../backend/middleware/auth", () => ({
  isSeller: (req, res, next) => {
    req.seller = { id: "6548acd73d94c802451e0f8c" };
    next();
  },
}));

const app = require("../../backend/app");

describe("Get Seller", () => {
  const sellerId = new mongoose.Types.ObjectId("6548acd73d94c802451e0f8c");

  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Shop.deleteMany({});

    //test seller
    await Shop.create({
      _id: sellerId,
      name: "Test Shop",
      email: "testshop@example.com",
      password: "Password123",
      phoneNumber: 1234567890,
      address: "123 Test St",
      zipCode: 12345,
      avatar: {
        url: "test-image.jpg",
        public_id: "test-image-123456",
      },
    });
  });

  describe("GET /api/shop/getseller", () => {
    it("should return authenticated seller's details", async () => {
      const res = await request(app)
        .get("/api/v2/shop/getseller")
        .set("Cookie", ["seller_token=valid_token"]);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.seller).toHaveProperty("name", "Test Shop");
      expect(res.body.seller).toHaveProperty("email", "testshop@example.com");
    });

    it("should return error if seller not found", async () => {
      await Shop.deleteMany({});

      const res = await request(app)
        .get("/api/v2/shop/getseller")
        .set("Cookie", ["seller_token=valid_token"]);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("User not found");
    });
  });
});
