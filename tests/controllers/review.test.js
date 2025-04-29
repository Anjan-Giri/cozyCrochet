const request = require("supertest");
const mongoose = require("mongoose");
const Product = require("../../backend/model/product");
const Shop = require("../../backend/model/shop");
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

describe("Product Reviews", () => {
  let testShop, testProduct, testUser, testOrder;

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
      images: [{ public_id: "products/image1.jpg", url: "uploads/image1.jpg" }],
      shopId: testShop._id,
      shop: testShop,
      reviews: [],
      ratings: 0,
    });

    // test order
    testOrder = await Order.create({
      user: testUser._id,
      cart: [
        {
          _id: new mongoose.Types.ObjectId(),
          product: testProduct._id,
          name: "Test Product",
          price: 80,
          quantity: 1,
          isReviewed: false,
        },
      ],
      totalPrice: 80,
      shippingAddress: {
        address: "123 Test Ave",
        city: "Test City",
        zipCode: "12345",
        country: "Test Country",
      },
      status: "Delivered",
    });
  });

  describe("PUT /api/v2/product/create-review", () => {
    it("should add a new review successfully", async () => {
      const reviewData = {
        user: testUser,
        rating: 4,
        comment: "Great product!",
        productId: testProduct._id.toString(),
        orderId: testOrder._id.toString(),
        cartItemId: testOrder.cart[0]._id.toString(),
      };

      const res = await request(app)
        .put("/api/v2/product/create-review")
        .send(reviewData);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Review submitted successfully!");
      expect(res.body.product).toHaveProperty(
        "_id",
        testProduct._id.toString()
      );
      expect(res.body.product).toHaveProperty("ratings", 4);
      expect(res.body.product).toHaveProperty("reviewCount", 1);

      const updatedProduct = await Product.findById(testProduct._id);
      expect(updatedProduct.reviews).toHaveLength(1);
      expect(updatedProduct.reviews[0].rating).toBe(4);
      expect(updatedProduct.reviews[0].comment).toBe("Great product!");

      const updatedOrder = await Order.findById(testOrder._id);
      expect(updatedOrder.cart[0].isReviewed).toBe(true);
    });

    it("should update existing review if user already reviewed product", async () => {
      //add a review
      await Product.findByIdAndUpdate(testProduct._id, {
        $push: {
          reviews: {
            user: testUser,
            rating: 3,
            comment: "Original review",
            productId: testProduct._id,
            orderId: testOrder._id,
            createdAt: new Date(),
          },
        },
        ratings: 3,
      });

      //update the review
      const updatedReviewData = {
        user: testUser,
        rating: 5,
        comment: "Updated review - much better!",
        productId: testProduct._id.toString(),
        orderId: testOrder._id.toString(),
        cartItemId: testOrder.cart[0]._id.toString(),
      };

      const res = await request(app)
        .put("/api/v2/product/create-review")
        .send(updatedReviewData);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const updatedProduct = await Product.findById(testProduct._id);
      expect(updatedProduct.reviews).toHaveLength(1);
      expect(updatedProduct.reviews[0].rating).toBe(5);
      expect(updatedProduct.reviews[0].comment).toBe(
        "Updated review - much better!"
      );
      expect(updatedProduct.ratings).toBe(5);
    });

    it("should return error with missing IDs", async () => {
      const reviewData = {
        user: testUser,
        rating: 4,
        comment: "Great product!",
        //missing productId, orderId, cartItemId
      };

      const res = await request(app)
        .put("/api/v2/product/create-review")
        .send(reviewData);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("All IDs are required for review");
    });

    it("should return error for non-existent product", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const reviewData = {
        user: testUser,
        rating: 4,
        comment: "Great product!",
        productId: nonExistentId.toString(),
        orderId: testOrder._id.toString(),
        cartItemId: testOrder.cart[0]._id.toString(),
      };

      const res = await request(app)
        .put("/api/v2/product/create-review")
        .send(reviewData);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Product not found");
    });

    it("should return error for non-existent order", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const reviewData = {
        user: testUser,
        rating: 4,
        comment: "Great product!",
        productId: testProduct._id.toString(),
        orderId: nonExistentId.toString(),
        cartItemId: testOrder.cart[0]._id.toString(),
      };

      const res = await request(app)
        .put("/api/v2/product/create-review")
        .send(reviewData);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Order not found");
    });

    it("should return error for non-existent cart item", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const reviewData = {
        user: testUser,
        rating: 4,
        comment: "Great product!",
        productId: testProduct._id.toString(),
        orderId: testOrder._id.toString(),
        cartItemId: nonExistentId.toString(),
      };

      const res = await request(app)
        .put("/api/v2/product/create-review")
        .send(reviewData);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Cart item not found in order");
    });
  });
});
