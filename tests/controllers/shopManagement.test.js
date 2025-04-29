const request = require("supertest");
const mongoose = require("mongoose");
const Shop = require("../../backend/model/shop");
const Product = require("../../backend/model/product");
const fs = require("fs");

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

const app = require("../../backend/app");

describe("Admin Shop Management", () => {
  const shopId1 = new mongoose.Types.ObjectId();
  const shopId2 = new mongoose.Types.ObjectId();

  const mockShops = [
    {
      _id: shopId1,
      name: "Yarn Paradise",
      email: "yarn@example.com",
      password: "hashedpassword123",
      description: "Best crochet supplies shop",
      address: "123 Crafty Lane",
      phoneNumber: 1234567890,
      zipCode: "10001",
      avatar: {
        url: "shop-avatar1.jpg",
        public_id: "shop-avatar-1",
      },
      createdAt: new Date(),
    },
    {
      _id: shopId2,
      name: "Hook Heaven",
      email: "hooks@example.com",
      password: "hashedpassword456",
      description: "Specializing in crochet hooks",
      address: "456 Crafter Avenue",
      phoneNumber: 1234567890,
      zipCode: "10001",
      avatar: {
        url: "shop-avatar2.jpg",
        public_id: "shop-avatar-2",
      },
      createdAt: new Date(),
    },
  ];

  const mockShopProducts = [
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Bamboo Hook Set",
      description: "Premium bamboo hooks",
      price: 24.99,
      shopId: shopId1,
      shop: shopId1,
      stock: 25,
      discountPrice: 19.99,
      category: "Tools",
      images: [{ url: "hook-image.jpg", public_id: "hook-1" }],
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Merino Wool Yarn",
      description: "Soft merino wool",
      price: 12.99,
      shopId: shopId1,
      shop: shopId1,
      stock: 50,
      discountPrice: 9.99,
      category: "Yarn",
      images: [{ url: "yarn-image.jpg", public_id: "yarn-1" }],
    },
  ];

  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Shop.deleteMany({});
    await Product.deleteMany({});
    await Shop.create(mockShops);
    await Product.create(mockShopProducts);

    jest.clearAllMocks();
  });

  describe("GET /api/v2/admin/all-shops", () => {
    it("should list all shops", async () => {
      const res = await request(app)
        .get("/api/v2/admin/all-shops")
        .set("Cookie", ["admin_token=valid_token"]);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.shops)).toBe(true);
      expect(res.body.shops.length).toBe(2);

      expect(res.body.shops[0]).toHaveProperty("name");
      expect(res.body.shops[0]).toHaveProperty("email");
      expect(res.body.shops[0]).toHaveProperty("description");
      expect(res.body.shops[0]).toHaveProperty("avatar");
    });
  });

  describe("DELETE /api/v2/admin/delete-shop/:id", () => {
    it("should delete a shop and its products by ID", async () => {
      const res = await request(app)
        .delete(`/api/v2/admin/delete-shop/${shopId1.toString()}`)
        .set("Cookie", ["admin_token=valid_token"]);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Shop deleted successfully");

      const shopExists = await Shop.findById(shopId1);
      expect(shopExists).toBeFalsy();

      const productsExist = await Product.find({ shopId: shopId1 });
      expect(productsExist.length).toBe(0);

      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.unlinkSync).toHaveBeenCalled();
    });

    it("should return 404 for non-existent shop", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .delete(`/api/v2/admin/delete-shop/${nonExistentId.toString()}`)
        .set("Cookie", ["admin_token=valid_token"]);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
