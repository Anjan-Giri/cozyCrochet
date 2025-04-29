const request = require("supertest");
const mongoose = require("mongoose");
const Product = require("../../backend/model/product");
const Shop = require("../../backend/model/shop");
const fs = require("fs");
const path = require("path");

const app = require("../../backend/app");

//mock multer
jest.mock("../../backend/multer", () => {
  const path = require("path");

  return {
    upload: {
      array: (fieldname, maxCount) => (req, res, next) => {
        req.files = [
          {
            filename: "test-image-1.jpg",
            path: path.join(
              __dirname,
              "..",
              "..",
              "uploads",
              "test-image-1.jpg"
            ),
          },
          {
            filename: "test-image-2.jpg",
            path: path.join(
              __dirname,
              "..",
              "..",
              "uploads",
              "test-image-2.jpg"
            ),
          },
        ];
        next();
      },
    },
  };
});

jest.mock("../../backend/middleware/auth", () => ({
  isSeller: (req, res, next) => {
    req.seller = { _id: "seller123", role: "Seller" };
    next();
  },
  isAuthenticatedUser: (req, res, next) => {
    req.user = { _id: "user123" };
    next();
  },
}));

describe("Product Creation", () => {
  let testShop;

  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Product.deleteMany({});
    await Shop.deleteMany({});

    //test shop
    testShop = new Shop({
      name: "Test Shop",
      email: "shop@example.com",
      address: "123 Test St",
      phoneNumber: "1234567890",
      seller: "seller123",
      zipCode: "12345",
      avatar: {
        url: "test-shop-image.jpg",
        public_id: "test-shop-image-123",
      },
      password: "testshoppassword",
    });
    await testShop.save();
  });

  describe("POST /api/v2/product/create-product", () => {
    it("should create product successfully with valid data", async () => {
      const res = await request(app)
        .post("/api/v2/product/create-product")
        .send({
          shopId: testShop._id,
          name: "Test Product",
          description: "Test product description",
          category: "Electronics",
          tags: "test, product",
          originalPrice: 100,
          discountPrice: 80,
          stock: 10,
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.product).toHaveProperty("name", "Test Product");
      expect(res.body.product).toHaveProperty(
        "shopId",
        testShop._id.toString()
      );
      expect(res.body.product.images).toHaveLength(2);
    });

    it("should return error with missing shop ID", async () => {
      const res = await request(app)
        .post("/api/v2/product/create-product")
        .send({
          name: "Test Product",
          description: "Test product description",
          category: "Electronics",
          originalPrice: 100,
          discountPrice: 80,
          stock: 10,
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Shop ID is required");
    });

    it("should return error with non-existent shop", async () => {
      const res = await request(app)
        .post("/api/v2/product/create-product")
        .send({
          shopId: new mongoose.Types.ObjectId(),
          name: "Test Product",
          description: "Test product description",
          category: "Electronics",
          originalPrice: 100,
          discountPrice: 80,
          stock: 10,
        });

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Shop not found");
    });

    it("should return error with missing required fields", async () => {
      const res = await request(app)
        .post("/api/v2/product/create-product")
        .send({
          shopId: testShop._id,
          //missing name, description, and category
          originalPrice: 100,
          discountPrice: 80,
          stock: 10,
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Please fill all required fields");
    });
  });
});
