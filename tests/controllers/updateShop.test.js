const request = require("supertest");
const mongoose = require("mongoose");
const fs = require("fs");
const Shop = require("../../backend/model/shop");

//mock the authentication middleware
jest.mock("../../backend/middleware/auth", () => ({
  isSeller: (req, res, next) => {
    req.seller = {
      id: "6548acd73d94c802451e0f8c",
      _id: "6548acd73d94c802451e0f8c",
    };
    next();
  },
}));

//mock fs operations
jest.mock("fs", () => ({
  existsSync: jest.fn().mockReturnValue(true),
  unlinkSync: jest.fn(),
}));

//mock multer upload
jest.mock("../../backend/multer", () => ({
  upload: {
    single: jest.fn(() => (req, res, next) => {
      req.file = {
        filename: "new-avatar.jpg",
        path: "uploads/new-avatar.jpg",
      };
      next();
    }),
  },
}));

const app = require("../../backend/app");

describe("Update Shop", () => {
  const sellerId = new mongoose.Types.ObjectId("6548acd73d94c802451e0f8c");

  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Shop.deleteMany({});
    jest.clearAllMocks();

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
        url: "old-avatar.jpg",
        public_id: "old-avatar-123456",
      },
    });
  });

  describe("PUT /api/v2/shop/update-shop-avatar", () => {
    it("should update shop avatar", async () => {
      const res = await request(app)
        .put("/api/v2/shop/update-shop-avatar")
        .set("Cookie", ["seller_token=valid_token"])
        .attach("image", Buffer.from("mock image"), "new-avatar.jpg");

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Avatar updated successfully");
      expect(res.body.user.avatar.url).toBe("new-avatar.jpg");
      expect(fs.unlinkSync).toHaveBeenCalled();
    });
  });

  describe("PUT /api/v2/shop/update-seller", () => {
    it("should update seller information", async () => {
      const updateData = {
        name: "Updated Shop Name",
        description: "Updated shop description",
        address: "456 New Street",
        phoneNumber: "9876543210",
        zipCode: "54321",
      };

      const res = await request(app)
        .put("/api/v2/shop/update-seller")
        .set("Cookie", ["seller_token=valid_token"])
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Shop info updated successfully!");
      expect(res.body.shop.name).toBe("Updated Shop Name");
      expect(res.body.shop.description).toBe("Updated shop description");
      expect(res.body.shop.address).toBe("456 New Street");
      expect(res.body.shop.phoneNumber).toBe(9876543210);
      expect(res.body.shop.zipCode).toBe(54321);
    });

    it("should return error if shop not found", async () => {
      await Shop.deleteMany({});

      const updateData = {
        name: "Updated Shop Name",
        description: "Updated shop description",
        address: "456 New Street",
        phoneNumber: "9876543210",
        zipCode: "54321",
      };

      const res = await request(app)
        .put("/api/v2/shop/update-seller")
        .set("Cookie", ["seller_token=valid_token"])
        .send(updateData);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Shop not found");
    });
  });
});
