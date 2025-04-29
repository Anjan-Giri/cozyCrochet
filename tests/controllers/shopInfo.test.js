const request = require("supertest");
const mongoose = require("mongoose");
const Shop = require("../../backend/model/shop");
const Product = require("../../backend/model/product");

const app = require("../../backend/app");

describe("Get Shop Info", () => {
  const shopId = new mongoose.Types.ObjectId("6548acd73d94c802451e0f8c");

  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Shop.deleteMany({});
    await Product.deleteMany({});

    //test shop
    await Shop.create({
      _id: shopId,
      name: "Test Shop",
      email: "testshop@example.com",
      password: "Password123",
      phoneNumber: 1234567890,
      address: "123 Test St",
      zipCode: 12345,
      description: "This is a test shop",
      avatar: {
        url: "test-image.jpg",
        public_id: "test-image-123456",
      },
    });

    //some products for the shop
    for (let i = 0; i < 5; i++) {
      await Product.create({
        name: `Product ${i + 1}`,
        description: "Test product",
        price: 10.99,
        category: "Test",
        shopId: shopId.toString(),
        shop: shopId,
        stock: 10,
        discountPrice: 9.99,
      });
    }
  });

  describe("GET /api/v2/shop/get-shop-info/:id", () => {
    it("should return shop info and total products", async () => {
      const res = await request(app).get(
        `/api/v2/shop/get-shop-info/${shopId}`
      );

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.shop).toHaveProperty("name", "Test Shop");
      expect(res.body.shop).toHaveProperty(
        "description",
        "This is a test shop"
      );
      expect(res.body.shop).toHaveProperty("totalProducts", 5);

      expect(res.body.shop).not.toHaveProperty("password");
      expect(res.body.shop).not.toHaveProperty("email");
    });

    it("should return error if shop not found", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const res = await request(app).get(
        `/api/v2/shop/get-shop-info/${nonExistentId}`
      );

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Shop not found");
    });
  });
});
