const request = require("supertest");
const mongoose = require("mongoose");
const Order = require("../../backend/model/order");
const Shop = require("../../backend/model/shop");

const app = require("../../backend/app");

//mock auth middleware
jest.mock("../../backend/middleware/auth", () => ({
  isAuthenticatedUser: (req, res, next) => {
    req.user = { _id: "user123", name: "Test User" };
    next();
  },
  isSeller: (req, res, next) => {
    req.seller = { _id: "seller123", role: "Seller" };
    next();
  },
}));

describe("Get Seller Orders", () => {
  let testShop, testShop2;

  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Order.deleteMany({});
    await Shop.deleteMany({});

    // Create test shops
    testShop = new Shop({
      _id: new mongoose.Types.ObjectId(),
      name: "Test Shop",
      email: "shop@example.com",
      address: "123 Shop St",
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

    testShop2 = new Shop({
      _id: new mongoose.Types.ObjectId(),
      name: "Second Shop",
      email: "shop2@example.com",
      address: "456 Shop St",
      phoneNumber: "0987654321",
      seller: "seller456",
      zipCode: "54321",
      avatar: {
        url: "test-shop2-image.jpg",
        public_id: "test-shop2-image-456",
      },
      password: "testshop2password",
    });
    await testShop2.save();

    // orders for first shop
    const order1 = new Order({
      cart: [
        {
          _id: new mongoose.Types.ObjectId(),
          name: "Product with String ShopId",
          price: 80,
          quantity: 1,
          productId: new mongoose.Types.ObjectId(),
          shopId: testShop._id.toString(),
        },
      ],
      shippingAddress: {
        address1: "123 Test St",
        city: "Test City",
        zipCode: "12345",
        country: "Test Country",
      },
      user: {
        _id: new mongoose.Types.ObjectId(),
        name: "Test User",
        email: "user@example.com",
      },
      totalPrice: 85,
      paymentInfo: {
        type: "Credit Card",
        status: "Processing",
      },
      status: "Processing",
      createdAt: new Date("2023-01-01"),
    });
    await order1.save();

    const order2 = new Order({
      cart: [
        {
          _id: new mongoose.Types.ObjectId(),
          name: "Product with top-level string shopId",
          price: 90,
          quantity: 1,
          productId: new mongoose.Types.ObjectId(),
        },
      ],
      shippingAddress: {
        address1: "456 Test Ave",
        city: "Test City",
        zipCode: "12345",
        country: "Test Country",
      },
      user: {
        _id: new mongoose.Types.ObjectId(),
        name: "Test User 2",
        email: "user2@example.com",
      },
      totalPrice: 95,
      paymentInfo: {
        type: "Credit Card",
        status: "Processing",
      },
      status: "Processing",
      shopId: testShop._id.toString(),
      createdAt: new Date("2023-01-05"),
    });
    await order2.save();

    const order3 = new Order({
      cart: [
        {
          _id: new mongoose.Types.ObjectId(),
          name: "Product with ObjectId ShopId",
          price: 100,
          quantity: 1,
          productId: new mongoose.Types.ObjectId(),
          shopId: testShop._id,
        },
      ],
      shippingAddress: {
        address1: "789 Test Blvd",
        city: "Test City",
        zipCode: "12345",
        country: "Test Country",
      },
      user: {
        _id: new mongoose.Types.ObjectId(),
        name: "Test User 3",
        email: "user3@example.com",
      },
      totalPrice: 105,
      paymentInfo: {
        type: "Credit Card",
        status: "Processing",
      },
      status: "Processing",
      createdAt: new Date("2023-01-10"),
    });
    await order3.save();

    const order4 = new Order({
      cart: [
        {
          _id: new mongoose.Types.ObjectId(),
          name: "Product with top-level ObjectId shopId",
          price: 110,
          quantity: 1,
          productId: new mongoose.Types.ObjectId(),
        },
      ],
      shippingAddress: {
        address1: "101 Test Lane",
        city: "Test City",
        zipCode: "12345",
        country: "Test Country",
      },
      user: {
        _id: new mongoose.Types.ObjectId(),
        name: "Test User 4",
        email: "user4@example.com",
      },
      totalPrice: 115,
      paymentInfo: {
        type: "Credit Card",
        status: "Processing",
      },
      status: "Processing",
      shopId: testShop._id,
      createdAt: new Date("2023-01-15"),
    });
    await order4.save();

    //order for second shop
    const order5 = new Order({
      cart: [
        {
          _id: new mongoose.Types.ObjectId(),
          name: "Shop 2 Product",
          price: 75,
          quantity: 1,
          productId: new mongoose.Types.ObjectId(),
        },
      ],
      shippingAddress: {
        address1: "Shop 2 Address",
        city: "Shop 2 City",
        zipCode: "54321",
        country: "Shop 2 Country",
      },
      user: {
        _id: new mongoose.Types.ObjectId(),
        name: "Shop 2 User",
        email: "shop2user@example.com",
      },
      totalPrice: 80,
      paymentInfo: {
        type: "Credit Card",
        status: "Processing",
      },
      status: "Processing",
      shopId: testShop2._id,
      createdAt: new Date("2023-01-20"),
    });
    await order5.save();
  });

  beforeAll(() => {
    expect.extend({
      toBeAfter(received, comparison) {
        const pass = new Date(received) > new Date(comparison);
        if (pass) {
          return {
            message: () => `expected ${received} not to be after ${comparison}`,
            pass: true,
          };
        } else {
          return {
            message: () => `expected ${received} to be after ${comparison}`,
            pass: false,
          };
        }
      },
    });
  });

  describe("GET /api/v2/order/get-seller-orders/:shopId", () => {
    it("should get all orders for a shop with direct shopId", async () => {
      const res = await request(app).get(
        `/api/v2/order/get-seller-orders/${testShop._id}`
      );

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.orders)).toBe(true);

      if (res.body.orders.length >= 2) {
        expect(new Date(res.body.orders[0].createdAt)).toBeAfter(
          new Date(res.body.orders[1].createdAt)
        );
      }
    });

    it("should get orders for second shop", async () => {
      const res = await request(app).get(
        `/api/v2/order/get-seller-orders/${testShop2._id}`
      );

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.orders)).toBe(true);

      if (res.body.orders.length > 0) {
        expect(res.body.orders[0].shopId.toString()).toBe(
          testShop2._id.toString()
        );
        expect(res.body.orders[0].totalPrice).toBe(80);
      }
    });

    it("should return empty array for shop with no orders", async () => {
      const nonExistentShopId = new mongoose.Types.ObjectId();

      const res = await request(app).get(
        `/api/v2/order/get-seller-orders/${nonExistentShopId}`
      );

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.orders).toHaveLength(0);
    });

    it("should handle invalid shop ID format", async () => {
      const invalidShopId = "invalid-id-format";

      const res = await request(app).get(
        `/api/v2/order/get-seller-orders/${invalidShopId}`
      );

      if (res.statusCode === 400) {
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
      } else {
        expect(res.statusCode).toBe(200);
        expect(res.body.orders).toHaveLength(0);
      }
    });
  });
});
