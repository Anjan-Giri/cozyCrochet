const request = require("supertest");
const mongoose = require("mongoose");
const Product = require("../../backend/model/product");
const Shop = require("../../backend/model/shop");

const app = require("../../backend/app");

describe("Get Products", () => {
  let testShop1, testShop2, emptyShop;
  let product1, product2, product3;

  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Product.deleteMany({});
    await Shop.deleteMany({});

    //test shops
    testShop1 = new Shop({
      name: "Test Shop 1",
      email: "shop1@example.com",
      address: "123 Test St",
      phoneNumber: "1234567890",
      seller: "seller123",
      zipCode: "12345",
      avatar: { url: "test-shop-image1.jpg", public_id: "test-shop-image-123" },
      password: "testshoppassword1",
    });
    await testShop1.save();

    testShop2 = new Shop({
      name: "Test Shop 2",
      email: "shop2@example.com",
      address: "456 Test Ave",
      phoneNumber: "0987654321",
      seller: "seller456",
      zipCode: "67890",
      avatar: { url: "test-shop-image2.jpg", public_id: "test-shop-image-456" },
      password: "testshoppassword2",
    });
    await testShop2.save();

    //empty shop
    emptyShop = new Shop({
      name: "Empty Shop",
      email: "empty@example.com",
      address: "789 Empty St",
      phoneNumber: "5555555555",
      seller: "seller789",
      zipCode: "11223",
      avatar: {
        url: "test-empty-image.jpg",
        public_id: "test-empty-image-789",
      },
      password: "testemptypassword",
    });
    await emptyShop.save();

    //test products
    product1 = await Product.create({
      name: "Laptop",
      description: "High-end laptop",
      category: "Electronics",
      originalPrice: 1000,
      discountPrice: 900,
      stock: 15,
      images: [{ public_id: "products/laptop.jpg", url: "uploads/laptop.jpg" }],
      shopId: testShop1._id,
      shop: testShop1,
    });

    product2 = await Product.create({
      name: "Smartphone",
      description: "Latest smartphone",
      category: "Electronics",
      originalPrice: 500,
      discountPrice: 450,
      stock: 20,
      images: [{ public_id: "products/phone.jpg", url: "uploads/phone.jpg" }],
      shopId: testShop1._id,
      shop: testShop1,
    });

    product3 = await Product.create({
      name: "Headphones",
      description: "Wireless headphones",
      category: "Audio",
      originalPrice: 200,
      discountPrice: 180,
      stock: 30,
      images: [
        { public_id: "products/headphones.jpg", url: "uploads/headphones.jpg" },
      ],
      shopId: testShop2._id,
      shop: testShop2,
    });
  });

  describe("GET /api/v2/product/get-all-products-shop/:id", () => {
    it("should return all products of a specific shop", async () => {
      const res = await request(app).get(
        `/api/v2/product/get-all-products-shop/${testShop1._id}`
      );
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.products).toHaveLength(2);
      expect(res.body.products[0].shopId).toBe(testShop1._id.toString());
      expect(res.body.products[1].shopId).toBe(testShop1._id.toString());
    });

    it("should return empty array for shop with no products", async () => {
      const res = await request(app).get(
        `/api/v2/product/get-all-products-shop/${emptyShop._id}`
      );
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.products).toHaveLength(0);
    });
  });

  describe("GET /api/v2/product/get-all-products", () => {
    it("should return all products from all shops", async () => {
      const res = await request(app).get("/api/v2/product/get-all-products");
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.products).toHaveLength(3);
    });
  });
});
