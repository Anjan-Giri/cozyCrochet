const request = require("supertest");
const mongoose = require("mongoose");
const Order = require("../../backend/model/order");

// mock middleware
jest.mock("../../backend/middleware/auth", () => ({
  isAdmin: (req, res, next) => {
    req.admin = { id: "6548acd73d94c802451e0f8c" };
    next();
  },
}));

const app = require("../../backend/app");

describe("Admin Order Management", () => {
  const userId1 = new mongoose.Types.ObjectId();
  const userId2 = new mongoose.Types.ObjectId();
  const orderId1 = new mongoose.Types.ObjectId();
  const orderId2 = new mongoose.Types.ObjectId();
  const shopId = new mongoose.Types.ObjectId();
  const productId1 = new mongoose.Types.ObjectId();
  const productId2 = new mongoose.Types.ObjectId();

  const mockOrders = [
    {
      _id: orderId1,
      cart: [
        {
          _id: productId1,
          product: productId1,
          name: "Crochet Hook Set",
          description: "Complete set of ergonomic crochet hooks",
          price: 49.99,
          quantity: 1,
          shopId: shopId,
          images: [{ url: "hook-image1.jpg", public_id: "hook-1" }],
        },
      ],
      user: userId1,
      totalPrice: 49.99,
      shippingAddress: {
        address1: "123 Main St",
        city: "Craftville",
        state: "CA",
        zipCode: "12345",
        country: "USA",
      },
      paymentInfo: {
        id: "payment_123",
        status: "Processing",
        type: "Credit Card",
      },
      status: "Processing",
      createdAt: new Date(),
    },
    {
      _id: orderId2,
      cart: [
        {
          _id: productId2,
          product: productId2,
          name: "Premium Yarn Bundle",
          description: "High-quality yarn in assorted colors",
          price: 29.99,
          quantity: 2,
          shopId: shopId,
          images: [{ url: "yarn-image1.jpg", public_id: "yarn-1" }],
        },
      ],
      user: userId2,
      totalPrice: 59.98,
      shippingAddress: {
        address1: "456 Craft Lane",
        city: "Yarntown",
        state: "NY",
        zipCode: "67890",
        country: "USA",
      },
      paymentInfo: {
        id: "payment_456",
        status: "Pending",
        type: "PayPal",
      },
      status: "Pending",
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
    await Order.deleteMany({});
    await Order.create(mockOrders);
  });

  describe("GET /api/v2/admin/all-orders", () => {
    it("should list all orders", async () => {
      const res = await request(app)
        .get("/api/v2/admin/all-orders")
        .set("Cookie", ["admin_token=valid_token"]);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.orders)).toBe(true);
      expect(res.body.orders.length).toBe(2);

      expect(res.body.orders[0]).toHaveProperty("cart");
      expect(res.body.orders[0]).toHaveProperty("user");
      expect(res.body.orders[0]).toHaveProperty("totalPrice");
      expect(res.body.orders[0]).toHaveProperty("status");
    });
  });

  describe("PUT /api/v2/admin/update-order-status/:id", () => {
    it("should update order status to 'Shipped'", async () => {
      const res = await request(app)
        .put(`/api/v2/admin/update-order-status/${orderId1.toString()}`)
        .set("Cookie", ["admin_token=valid_token"])
        .send({ status: "Shipped" });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Order status updated successfully");

      const updatedOrder = await Order.findById(orderId1);
      expect(updatedOrder.status).toBe("Shipped");
      expect(updatedOrder.paymentInfo.status).not.toBe("Succeeded");
    });

    it("should update order status to 'Delivered' and set payment status to 'Succeeded'", async () => {
      const res = await request(app)
        .put(`/api/v2/admin/update-order-status/${orderId1.toString()}`)
        .set("Cookie", ["admin_token=valid_token"])
        .send({ status: "Delivered" });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Order status updated successfully");

      const updatedOrder = await Order.findById(orderId1);
      expect(updatedOrder.status).toBe("Delivered");
      expect(updatedOrder.paymentInfo.status).toBe("Succeeded");
      expect(updatedOrder.deliveredAt).toBeDefined();
    });

    it("should return 400 if order is already delivered", async () => {
      await Order.findByIdAndUpdate(orderId1, {
        status: "Delivered",
        deliveredAt: new Date(),
        "paymentInfo.status": "Succeeded",
      });

      const res = await request(app)
        .put(`/api/v2/admin/update-order-status/${orderId1.toString()}`)
        .set("Cookie", ["admin_token=valid_token"])
        .send({ status: "Delivered" });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should return 404 for non-existent order", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .put(`/api/v2/admin/update-order-status/${nonExistentId.toString()}`)
        .set("Cookie", ["admin_token=valid_token"])
        .send({ status: "Shipped" });

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
