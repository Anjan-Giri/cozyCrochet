const request = require("supertest");
const mongoose = require("mongoose");
const User = require("../../backend/model/user");
const CalendarEvent = require("../../backend/model/calendarEvent");

//mock authentication middleware
jest.mock("../../backend/middleware/auth", () => ({
  isAuthenticatedUser: (req, res, next) => {
    if (req.headers["x-skip-auth"] === "true") {
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

describe("Calendar Add Event", () => {
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
    });
  });

  describe("POST /api/v2/calendar/add-event", () => {
    it("should add a new calendar event with all fields", async () => {
      const eventData = {
        eventType: "birthday",
        date: "2023-05-15",
        relatedPerson: "John Doe",
      };

      const res = await request(app)
        .post("/api/v2/calendar/add-event")
        .send(eventData);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.event).toHaveProperty("eventType", "birthday");
      expect(res.body.event).toHaveProperty("relatedPerson", "John Doe");
      expect(new Date(res.body.event.date)).toEqual(new Date("2023-05-15"));

      const updatedUser = await User.findById(userId);
      expect(updatedUser.calendarEvents.map((id) => id.toString())).toContain(
        res.body.event._id.toString()
      );
    });

    it("should add a new calendar event without relatedPerson", async () => {
      const eventData = {
        eventType: "new year",
        date: "2023-01-01",
      };

      const res = await request(app)
        .post("/api/v2/calendar/add-event")
        .send(eventData);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.event).toHaveProperty("eventType", "new year");
      expect(res.body.event).toHaveProperty("relatedPerson", "");
    });

    it("should return error if eventType is missing", async () => {
      const eventData = {
        date: "2023-05-15",
        relatedPerson: "John Doe",
      };

      const res = await request(app)
        .post("/api/v2/calendar/add-event")
        .send(eventData);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Event type and date are required");
    });

    it("should return error if date is missing", async () => {
      const eventData = {
        eventType: "birthday",
        relatedPerson: "John Doe",
      };

      const res = await request(app)
        .post("/api/v2/calendar/add-event")
        .send(eventData);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Event type and date are required");
    });

    it("should return error if not authenticated", async () => {
      const eventData = {
        eventType: "birthday",
        date: "2023-05-15",
        relatedPerson: "John Doe",
      };

      const res = await request(app)
        .post("/api/v2/calendar/add-event")
        .set("x-skip-auth", "true")
        .send(eventData);

      expect(res.statusCode).toBe(401);
    });
  });
});
