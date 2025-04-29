const request = require("supertest");
const mongoose = require("mongoose");
const User = require("../../backend/model/user");
const CalendarEvent = require("../../backend/model/calendarEvent");
const Product = require("../../backend/model/product");

//mock authentication middleware
jest.mock("../../backend/middleware/auth", () => ({
  isAuthenticatedUser: (req, res, next) => {
    if (!req.cookies.token) {
      return res.status(401).json({
        success: false,
        message: "Please login to access this resource",
      });
    }
    req.user = { id: "6548acd73d94c802451e0f8c" };
    next();
  },
}));

const app = require("../../backend/app");

describe("Calendar Recommendations", () => {
  const userId = new mongoose.Types.ObjectId("6548acd73d94c802451e0f8c");

  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await CalendarEvent.deleteMany({});
    await Product.deleteMany({});

    //test user
    await User.create({
      _id: userId,
      name: "Test User",
      email: "testuser@example.com",
      password: "Password123",
      avatar: {
        url: "test-image.jpg",
        public_id: "test-image-123456",
      },
      calendarEvents: [],
    });
  });

  describe("GET /api/v2/calendar/recommendations", () => {
    it("should return empty recommendations array when user has no upcoming events", async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);

      const event = new CalendarEvent({
        userId: userId.toString(),
        eventType: "birthday",
        date: futureDate,
        relatedPerson: "John Doe",
      });
      await event.save();

      const user = await User.findById(userId);
      user.calendarEvents.push(event._id);
      await user.save();

      const res = await request(app)
        .get("/api/v2/calendar/recommendations")
        .set("Cookie", "token=test-token");

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.recommendations).toEqual([]);
    });

    it("should return recommendations for upcoming events within 2 weeks", async () => {
      //products with matching tags
      const birthdayProduct = await Product.create({
        name: "Birthday Cake",
        description: "A delicious cake for birthdays",
        tags: "birthday,cake",
        category: "Gifts",
        originalPrice: 29.99,
        discountPrice: 25.99,
        stock: 10,
        shopId: "shop123",
        shop: { name: "Gift Shop", id: "shop123" },
        images: [{ public_id: "test-id-1", url: "test-url-1" }],
      });

      const weddingProduct = await Product.create({
        name: "Wedding Gift",
        description: "Beautiful wedding gift",
        tags: "wedding,gift",
        category: "Gifts",
        originalPrice: 59.99,
        discountPrice: 49.99,
        stock: 5,
        shopId: "shop123",
        shop: { name: "Gift Shop", id: "shop123" },
        images: [{ public_id: "test-id-2", url: "test-url-2" }],
      });

      const upcomingDate1 = new Date();
      upcomingDate1.setDate(upcomingDate1.getDate() + 5);

      const upcomingDate2 = new Date();
      upcomingDate2.setDate(upcomingDate2.getDate() + 10);
      const birthdayEvent = new CalendarEvent({
        userId: userId.toString(),
        eventType: "birthday",
        date: upcomingDate1,
        relatedPerson: "John Doe",
      });
      await birthdayEvent.save();

      const weddingEvent = new CalendarEvent({
        userId: userId.toString(),
        eventType: "wedding",
        date: upcomingDate2,
        relatedPerson: "Jane & Bob",
      });
      await weddingEvent.save();

      const user = await User.findById(userId);
      user.calendarEvents.push(birthdayEvent._id, weddingEvent._id);
      await user.save();

      const res = await request(app)
        .get("/api/v2/calendar/recommendations")
        .set("Cookie", "token=test-token");

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.recommendations.length).toBe(2);

      expect(res.body.recommendations[0].event).toHaveProperty(
        "eventType",
        "birthday"
      );
      expect(res.body.recommendations[0].products.length).toBe(1);
      expect(res.body.recommendations[0].products[0]._id).toBe(
        birthdayProduct._id.toString()
      );

      expect(res.body.recommendations[1].event).toHaveProperty(
        "eventType",
        "wedding"
      );
      expect(res.body.recommendations[1].products.length).toBe(1);
      expect(res.body.recommendations[1].products[0]._id).toBe(
        weddingProduct._id.toString()
      );
    });

    it("should only return recommendations for user's own events", async () => {
      //another user with events
      const otherUserId = new mongoose.Types.ObjectId();
      const otherUser = new User({
        _id: otherUserId,
        name: "Other User",
        email: "otheruser@example.com",
        password: "Password123",
        avatar: {
          url: "other-test-image.jpg",
          public_id: "other-test-image-123456",
        },
      });
      await otherUser.save();

      //create products with matching tags
      const birthdayProduct = await Product.create({
        name: "Birthday Cake",
        description: "A delicious cake for birthdays",
        tags: "birthday,cake",
        category: "Gifts",
        originalPrice: 29.99,
        discountPrice: 25.99,
        stock: 10,
        shopId: "shop123",
        shop: { name: "Gift Shop", id: "shop123" },
        images: [{ public_id: "test-id-3", url: "test-url-3" }],
      });

      //upcoming event for test user
      const upcomingDate1 = new Date();
      upcomingDate1.setDate(upcomingDate1.getDate() + 5);

      const birthdayEvent = new CalendarEvent({
        userId: userId.toString(),
        eventType: "birthday",
        date: upcomingDate1,
        relatedPerson: "John Doe",
      });
      await birthdayEvent.save();

      //upcoming event for other user
      const otherUserEvent = new CalendarEvent({
        userId: otherUserId.toString(),
        eventType: "birthday",
        date: upcomingDate1,
        relatedPerson: "Jane Doe",
      });
      await otherUserEvent.save();

      const user = await User.findById(userId);
      user.calendarEvents.push(birthdayEvent._id);
      await user.save();

      otherUser.calendarEvents.push(otherUserEvent._id);
      await otherUser.save();

      const res = await request(app)
        .get("/api/v2/calendar/recommendations")
        .set("Cookie", "token=test-token");

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.recommendations.length).toBe(1);
      expect(res.body.recommendations[0].event._id).toBe(
        birthdayEvent._id.toString()
      );
      expect(res.body.recommendations[0].event).not.toHaveProperty(
        "_id",
        otherUserEvent._id.toString()
      );
    });

    it("should not include events with no matching products", async () => {
      const birthdayProduct = await Product.create({
        name: "Birthday Cake",
        description: "A delicious cake for birthdays",
        tags: "birthday,cake",
        category: "Gifts",
        originalPrice: 29.99,
        discountPrice: 25.99,
        stock: 10,
        shopId: "shop123",
        shop: { name: "Gift Shop", id: "shop123" },
        images: [{ public_id: "test-id-4", url: "test-url-4" }],
      });

      const upcomingDate1 = new Date();
      upcomingDate1.setDate(upcomingDate1.getDate() + 5);

      const upcomingDate2 = new Date();
      upcomingDate2.setDate(upcomingDate2.getDate() + 10);

      const birthdayEvent = new CalendarEvent({
        userId: userId.toString(),
        eventType: "birthday",
        date: upcomingDate1,
        relatedPerson: "John Doe",
      });
      await birthdayEvent.save();

      const weddingEvent = new CalendarEvent({
        userId: userId.toString(),
        eventType: "wedding",
        date: upcomingDate2,
        relatedPerson: "Jane & Bob",
      });
      await weddingEvent.save();

      const user = await User.findById(userId);
      user.calendarEvents.push(birthdayEvent._id, weddingEvent._id);
      await user.save();

      const res = await request(app)
        .get("/api/v2/calendar/recommendations")
        .set("Cookie", "token=test-token");

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.recommendations.length).toBe(1);
      expect(res.body.recommendations[0].event.eventType).toBe("birthday");
    });

    it("should return error if not authenticated", async () => {
      const res = await request(app).get("/api/v2/calendar/recommendations");

      expect(res.statusCode).toBe(401);
    });
  });
});
