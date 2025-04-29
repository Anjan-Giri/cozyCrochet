const request = require("supertest");
const mongoose = require("mongoose");
const Product = require("../../backend/model/product");
const Shop = require("../../backend/model/shop");
const Order = require("../../backend/model/order");
const User = require("../../backend/model/user");

const app = require("../../backend/app");

//mock mail service
jest.mock("../../backend/utils/mail", () => jest.fn().mockResolvedValue(true));

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

describe("Create Order", () => {
  let testShop, testProduct, testUser;

  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Product.deleteMany({});
    await Shop.deleteMany({});
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

    //test shop
    testShop = new Shop({
      _id: new mongoose.Types.ObjectId(),
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

    //test product
    testProduct = await Product.create({
      name: "Test Product",
      description: "Test description",
      category: "Electronics",
      originalPrice: 100,
      discountPrice: 80,
      stock: 10,
      sold_out: 0,
      images: [{ public_id: "products/image1.jpg", url: "uploads/image1.jpg" }],
      shopId: testShop._id,
      shop: testShop,
      reviews: [],
      ratings: 0,
    });
  });

  describe("POST /api/v2/order/create-order", () => {
    it("should create a new order successfully", async () => {
      const orderData = {
        cart: [
          {
            _id: new mongoose.Types.ObjectId().toString(),
            product: { _id: testProduct._id },
            name: "Test Product",
            price: 80,
            quantity: 2,
            shopId: testShop._id,
          },
        ],
        shippingAddress: {
          address1: "123 Test Ave",
          address2: "Apt 4",
          city: "Test City",
          zipCode: "12345",
          country: "Test Country",
        },
        user: {
          _id: testUser._id,
          name: testUser.name,
          email: testUser.email,
        },
        totalPrice: 168,
        paymentInfo: {
          type: "Credit Card",
          status: "Processing",
        },
      };

      const res = await request(app)
        .post("/api/v2/order/create-order")
        .send(orderData);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.orders).toHaveLength(1);
      expect(res.body.orders[0].totalPrice).toBe(168);
      expect(res.body.orders[0].status).toBe("Processing");

      const updatedProduct = await Product.findById(testProduct._id);
      expect(updatedProduct.stock).toBe(8);
      expect(updatedProduct.sold_out).toBe(2);
    });

    it("should handle multiple products from the same shop", async () => {
      const testProduct2 = await Product.create({
        name: "Second Test Product",
        description: "Another test description",
        category: "Electronics",
        originalPrice: 150,
        discountPrice: 120,
        stock: 5,
        sold_out: 0,
        images: [
          { public_id: "products/image2.jpg", url: "uploads/image2.jpg" },
        ],
        shopId: testShop._id,
        shop: testShop,
        reviews: [],
        ratings: 0,
      });

      const orderData = {
        cart: [
          {
            _id: new mongoose.Types.ObjectId().toString(),
            product: { _id: testProduct._id },
            name: "Test Product",
            price: 80,
            quantity: 1,
            shopId: testShop._id,
          },
          {
            _id: new mongoose.Types.ObjectId().toString(),
            product: { _id: testProduct2._id },
            name: "Second Test Product",
            price: 120,
            quantity: 1,
            shopId: testShop._id,
          },
        ],
        shippingAddress: {
          address1: "123 Test Ave",
          address2: "Apt 4",
          city: "Test City",
          zipCode: "12345",
          country: "Test Country",
        },
        user: {
          _id: testUser._id,
          name: testUser.name,
          email: testUser.email,
        },
        totalPrice: 210,
        paymentInfo: {
          type: "Credit Card",
          status: "Processing",
        },
      };

      const res = await request(app)
        .post("/api/v2/order/create-order")
        .send(orderData);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      expect(res.body.orders).toHaveLength(1);
      expect(res.body.orders[0].cart).toHaveLength(2);
      expect(res.body.orders[0].totalPrice).toBe(210);

      const updatedProduct1 = await Product.findById(testProduct._id);
      expect(updatedProduct1.stock).toBe(9);
      expect(updatedProduct1.sold_out).toBe(1);

      const updatedProduct2 = await Product.findById(testProduct2._id);
      expect(updatedProduct2.stock).toBe(4);
      expect(updatedProduct2.sold_out).toBe(1);
    });

    it("should handle products from multiple shops", async () => {
      // second shop
      const testShop2 = new Shop({
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

      //product for second shop
      const testProduct2 = await Product.create({
        name: "Shop 2 Product",
        description: "Product from second shop",
        category: "Clothing",
        originalPrice: 50,
        discountPrice: 40,
        stock: 15,
        sold_out: 0,
        images: [
          { public_id: "products/shop2img.jpg", url: "uploads/shop2img.jpg" },
        ],
        shopId: testShop2._id,
        shop: testShop2,
        reviews: [],
        ratings: 0,
      });

      const orderData = {
        cart: [
          {
            _id: new mongoose.Types.ObjectId().toString(),
            product: { _id: testProduct._id },
            name: "Test Product",
            price: 80,
            quantity: 1,
            shopId: testShop._id,
          },
          {
            _id: new mongoose.Types.ObjectId().toString(),
            product: { _id: testProduct2._id },
            name: "Shop 2 Product",
            price: 40,
            quantity: 2,
            shopId: testShop2._id,
          },
        ],
        shippingAddress: {
          address1: "123 Test Ave",
          city: "Test City",
          zipCode: "12345",
          country: "Test Country",
        },
        user: {
          _id: testUser._id,
          name: testUser.name,
          email: testUser.email,
        },
        totalPrice: 168,
        paymentInfo: {
          type: "Credit Card",
          status: "Processing",
        },
      };

      const res = await request(app)
        .post("/api/v2/order/create-order")
        .send(orderData);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      expect(res.body.orders).toHaveLength(2);

      const updatedProduct1 = await Product.findById(testProduct._id);
      expect(updatedProduct1.stock).toBe(9);

      const updatedProduct2 = await Product.findById(testProduct2._id);
      expect(updatedProduct2.stock).toBe(13);
    });

    it("should return error with invalid data", async () => {
      const invalidOrderData = {
        //missing cart data
        shippingAddress: {
          address1: "123 Test Ave",
          city: "Test City",
          zipCode: "12345",
          country: "Test Country",
        },
        //missing user data
        totalPrice: 100,
      };

      const res = await request(app)
        .post("/api/v2/order/create-order")
        .send(invalidOrderData);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
