const request = require("supertest");
const mongoose = require("mongoose");
const Order = require("../../backend/model/order");
const User = require("../../backend/model/user");

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

describe("Get User Orders", () => {
  let testUser, testOrders;

  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Order.deleteMany({});
    await User.deleteMany({});

    //test user
    testUser = new User({
      _id: new mongoose.Types.ObjectId(),
      name: "Test User",
      email: "user@example.com",
      password: "password123",
      avatar: {
        url: "test-avatar.jpg",
        public_id: "avatar-123",
      },
    });
    await testUser.save();

    //another user
    const otherUser = new User({
      _id: new mongoose.Types.ObjectId(),
      name: "Other User",
      email: "other@example.com",
      password: "password456",
      avatar: {
        url: "other-avatar.jpg",
        public_id: "avatar-456",
      },
    });
    await otherUser.save();

    //order fot test user
    testOrders = [
      {
        cart: [
          {
            _id: new mongoose.Types.ObjectId(),
            name: "Product 1",
            price: 50,
            quantity: 1,
            product: new mongoose.Types.ObjectId(),
          },
        ],
        shippingAddress: {
          address1: "123 Test Ave",
          city: "Test City",
          zipCode: "12345",
          country: "Test Country",
        },
        user: {
          _id: testUser._id.toString(),
          name: testUser.name,
          email: testUser.email,
        },
        totalPrice: 52.5,
        paymentInfo: {
          type: "Credit Card",
          status: "Processing",
        },
        status: "Processing",
        createdAt: new Date("2023-01-15"),
      },
      {
        cart: [
          {
            _id: new mongoose.Types.ObjectId(),
            name: "Product 2",
            price: 100,
            quantity: 2,
            product: new mongoose.Types.ObjectId(),
          },
        ],
        shippingAddress: {
          address1: "123 Test Ave",
          city: "Test City",
          zipCode: "12345",
          country: "Test Country",
        },
        user: {
          _id: testUser._id.toString(),
          name: testUser.name,
          email: testUser.email,
        },
        totalPrice: 210,
        paymentInfo: {
          type: "Credit Card",
          status: "Succeeded",
        },
        status: "Delivered",
        createdAt: new Date("2023-01-20"),
      },
    ];

    //order for other user
    const otherUserOrder = {
      cart: [
        {
          _id: new mongoose.Types.ObjectId(),
          name: "Product 3",
          price: 75,
          quantity: 1,
          product: new mongoose.Types.ObjectId(),
        },
      ],
      shippingAddress: {
        address1: "456 Other Ave",
        city: "Other City",
        zipCode: "54321",
        country: "Other Country",
      },
      user: {
        _id: otherUser._id.toString(),
        name: otherUser.name,
        email: otherUser.email,
      },
      totalPrice: 78.75,
      paymentInfo: {
        type: "Credit Card",
        status: "Processing",
      },
      status: "Processing",
      createdAt: new Date("2023-01-25"),
    };

    await Order.insertMany([...testOrders, otherUserOrder]);

    const insertedOrders = await Order.find({});
    console.log(`Inserted ${insertedOrders.length} orders`);
  });

  describe("GET /api/v2/order/get-user-orders/:userId", () => {
    it("should get all orders for a specific user", async () => {
      const res = await request(app).get(
        `/api/v2/order/get-user-orders/${testUser._id}`
      );

      console.log("Response:", JSON.stringify(res.body));

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.orders).toHaveLength(2);

      const firstDate = new Date(res.body.orders[0].createdAt);
      const secondDate = new Date(res.body.orders[1].createdAt);
      expect(firstDate > secondDate).toBe(true);

      expect(res.body.orders[0].totalPrice).toBe(210);
      expect(res.body.orders[0].status).toBe("Delivered");
      expect(res.body.orders[1].totalPrice).toBe(52.5);
      expect(res.body.orders[1].status).toBe("Processing");
    });

    it("should return empty array for user with no orders", async () => {
      const nonExistentUserId = new mongoose.Types.ObjectId();

      const res = await request(app).get(
        `/api/v2/order/get-user-orders/${nonExistentUserId}`
      );

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.orders).toHaveLength(0);
    });
  });
});
