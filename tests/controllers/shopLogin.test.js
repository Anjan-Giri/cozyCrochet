const request = require("supertest");
const mongoose = require("mongoose");
const Shop = require("../../backend/model/shop");

const app = require("../../backend/app");

describe("Shop Login", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Shop.deleteMany({});

    //test shop
    const testShop = new Shop({
      name: "Test Shop",
      email: "testshop@example.com",
      password: "Password123",
      phoneNumber: 1234567890,
      address: "123 Test St",
      zipCode: 12345,
      avatar: {
        url: "test-image.jpg",
        public_id: "test-image-123456",
      },
    });

    await testShop.save();
  });

  describe("POST /api/v2/shop/login-shop", () => {
    it("should login shop with valid credentials", async () => {
      const res = await request(app).post("/api/v2/shop/login-shop").send({
        email: "testshop@example.com",
        password: "Password123",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("token");
      expect(res.body.success).toBe(true);
    });

    it("should return error with invalid email", async () => {
      const res = await request(app).post("/api/v2/shop/login-shop").send({
        email: "nonexistent@example.com",
        password: "Password123",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("No user found");
    });

    it("should return error with invalid password", async () => {
      const res = await request(app).post("/api/v2/shop/login-shop").send({
        email: "testshop@example.com",
        password: "WrongPassword",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid email or password");
    });

    it("should return error with missing credentials", async () => {
      const res = await request(app).post("/api/v2/shop/login-shop").send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Please enter email and password");
    });
  });
});
