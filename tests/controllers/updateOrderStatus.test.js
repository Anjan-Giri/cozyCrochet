const request = require("supertest");
const mongoose = require("mongoose");
const Order = require("../../backend/model/order");

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

describe("Update Order Status", () => {
  let testOrder, testOrderId;

  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Order.deleteMany({});

    //test order
    testOrder = new Order({
      cart: [
        {
          _id: new mongoose.Types.ObjectId(),
          product: {
            _id: new mongoose.Types.ObjectId(),
            name: "Test Product",
          },
          name: "Test Product",
          price: 100,
          quantity: 2,
        },
      ],
      shippingAddress: {
        address1: "123 Test Ave",
        city: "Test City",
        zipCode: "12345",
        country: "Test Country",
      },
      user: {
        _id: new mongoose.Types.ObjectId(),
        name: "Test User",
        email: "user@example.com",
      },
      totalPrice: 210,
      paymentInfo: {
        type: "Credit Card",
        status: "Processing",
      },
      status: "Processing",
    });

    await testOrder.save();
    testOrderId = testOrder._id;
  });

  describe("PUT /api/v2/order/update-order-status/:id", () => {
    it("should update order status to 'Shipped'", async () => {
      const updateData = {
        status: "Shipped",
      };

      const res = await request(app)
        .put(`/api/v2/order/update-order-status/${testOrderId}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.order.status).toBe("Shipped");

      expect(res.body.order.deliveredAt).toBeUndefined();

      expect(res.body.order.paymentInfo.status).toBe("Processing");

      const updatedOrder = await Order.findById(testOrderId);
      expect(updatedOrder.status).toBe("Shipped");
    });

    it("should update order status to 'Delivered' and set deliveredAt date", async () => {
      const updateData = {
        status: "Delivered",
      };

      const beforeUpdate = new Date();

      const res = await request(app)
        .put(`/api/v2/order/update-order-status/${testOrderId}`)
        .send(updateData);

      const afterUpdate = new Date();

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.order.status).toBe("Delivered");

      expect(res.body.order.deliveredAt).toBeDefined();
      const deliveredAtDate = new Date(res.body.order.deliveredAt);
      expect(deliveredAtDate >= beforeUpdate).toBe(true);
      expect(deliveredAtDate <= afterUpdate).toBe(true);

      expect(res.body.order.paymentInfo.status).toBe("Succeeded");

      const updatedOrder = await Order.findById(testOrderId);
      expect(updatedOrder.status).toBe("Delivered");
      expect(updatedOrder.paymentInfo.status).toBe("Succeeded");
    });

    it("should return 404 error for non-existent order", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const updateData = {
        status: "Shipped",
      };

      const res = await request(app)
        .put(`/api/v2/order/update-order-status/${nonExistentId}`)
        .send(updateData);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Order not found");
    });

    it("should handle invalid order ID format", async () => {
      const invalidId = "invalid-id-format";
      const updateData = {
        status: "Shipped",
      };

      const res = await request(app)
        .put(`/api/v2/order/update-order-status/${invalidId}`)
        .send(updateData);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
