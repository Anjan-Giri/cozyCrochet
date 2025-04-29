const request = require("supertest");
const mongoose = require("mongoose");
const Product = require("../../backend/model/product");
const fs = require("fs");

//mock required files
jest.mock("../../backend/controller/product", () => {
  const express = require("express");
  const router = express.Router();
  router.get("/", (req, res) => res.status(200).json({ success: true }));
  return router;
});

//mock fs
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

const app = require("../../backend/app");

describe("Admin Product Management", () => {
  const shop123 = new mongoose.Types.ObjectId();
  const shop456 = new mongoose.Types.ObjectId();
  const product123 = new mongoose.Types.ObjectId();
  const product456 = new mongoose.Types.ObjectId();

  const mockProducts = [
    {
      _id: product123,
      name: "Crochet Blanket",
      shopId: shop123,
      description: "A beautiful hand-crocheted blanket",
      category: "Home Decor",
      shop: shop123,
      discountPrice: 19.99,
      originalPrice: 49.99,
      stock: 10,
      images: [
        {
          url: "blanket1.jpg",
          public_id: "blanket1",
        },
        {
          url: "blanket2.jpg",
          public_id: "blanket2",
        },
      ],
      createdAt: new Date(),
    },
    {
      _id: product456,
      name: "Crochet Hat",
      shopId: shop456,
      description: "A warm crochet hat for winter",
      category: "Apparel",
      shop: shop456,
      discountPrice: 19.99,
      originalPrice: 19.99,
      stock: 25,
      images: [
        {
          url: "hat1.jpg",
          public_id: "hat1",
        },
      ],
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
    await Product.deleteMany({});
    await Product.create(mockProducts);

    jest.clearAllMocks();
  });

  describe("GET /api/v2/admin/all-products", () => {
    it("should list all products", async () => {
      const res = await request(app)
        .get("/api/v2/admin/all-products")
        .set("Cookie", ["admin_token=valid_token"]);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.products)).toBe(true);
      expect(res.body.products.length).toBe(2);

      expect(res.body.products[0]).toHaveProperty("name");
      expect(res.body.products[0]).toHaveProperty("description");
      expect(res.body.products[0]).toHaveProperty("discountPrice");
      expect(res.body.products[0]).toHaveProperty("images");
    });
  });

  describe("DELETE /api/v2/admin/delete-product/:id", () => {
    it("should delete a product and its images", async () => {
      const res = await request(app)
        .delete(`/api/v2/admin/delete-product/${product123.toString()}`)
        .set("Cookie", ["admin_token=valid_token"]);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Product deleted successfully");

      const productExists = await Product.findById(product123);
      expect(productExists).toBeFalsy();

      expect(fs.existsSync).toHaveBeenCalledTimes(2);
      expect(fs.unlinkSync).toHaveBeenCalledTimes(2);
    });

    it("should return 404 for non-existent product", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .delete(`/api/v2/admin/delete-product/${nonExistentId.toString()}`)
        .set("Cookie", ["admin_token=valid_token"]);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
