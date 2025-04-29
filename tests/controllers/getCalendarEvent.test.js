const request = require("supertest");
const mongoose = require("mongoose");
const User = require("../../backend/model/user");
const CalendarEvent = require("../../backend/model/calendarEvent");

//mock authentication middleware to simplify testing
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

describe("Calendar Get Events", () => {
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

  describe("GET /api/v2/calendar/events", () => {
    it("should return empty array when user has no events", async () => {
      const res = await request(app)
        .get("/api/v2/calendar/events")
        .set("Cookie", "token=test-token");

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.events).toEqual([]);
    });

    it("should return all events for the authenticated user", async () => {
      //test events
      const event1 = new CalendarEvent({
        userId: userId,
        eventType: "birthday",
        date: new Date("2023-05-15"),
        relatedPerson: "John Doe",
      });
      await event1.save();

      const event2 = new CalendarEvent({
        userId: userId,
        eventType: "anniversary",
        date: new Date("2023-06-20"),
        relatedPerson: "Jane Doe",
      });
      await event2.save();

      const user = await User.findById(userId);
      user.calendarEvents.push(event1._id, event2._id);
      await user.save();

      const res = await request(app)
        .get("/api/v2/calendar/events")
        .set("Cookie", "token=test-token");

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.events.length).toBe(2);
      expect(res.body.events[0]).toHaveProperty("eventType", "birthday");
      expect(res.body.events[1]).toHaveProperty("eventType", "anniversary");
    });

    it("should not return events from other users", async () => {
      //another user
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

      //event for other user
      const otherEvent = new CalendarEvent({
        userId: otherUserId,
        eventType: "wedding",
        date: new Date("2023-07-10"),
        relatedPerson: "Someone Else",
      });
      await otherEvent.save();

      //event for test user
      const userEvent = new CalendarEvent({
        userId: userId,
        eventType: "birthday",
        date: new Date("2023-05-15"),
        relatedPerson: "John Doe",
      });
      await userEvent.save();

      const user = await User.findById(userId);
      user.calendarEvents.push(userEvent._id);
      await user.save();

      const res = await request(app)
        .get("/api/v2/calendar/events")
        .set("Cookie", "token=test-token");

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.events.length).toBe(1);
      expect(res.body.events[0]).toHaveProperty("eventType", "birthday");
    });

    it("should return error if not authenticated", async () => {
      const res = await request(app).get("/api/v2/calendar/events");

      expect(res.statusCode).toBe(401);
    });
  });
});
