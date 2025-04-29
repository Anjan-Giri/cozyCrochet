const request = require("supertest");
const mongoose = require("mongoose");
const User = require("../../backend/model/user");

//mock middleware
jest.mock("../../backend/middleware/auth", () => ({
  isAuthenticatedUser: (req, res, next) => {
    req.user = { id: "6548acd73d94c802451e0f8c" };
    next();
  },
}));

const app = require("../../backend/app");

describe("Update Address", () => {
  const userId = new mongoose.Types.ObjectId("6548acd73d94c802451e0f8c");

  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});

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
      addresses: [
        {
          _id: new mongoose.Types.ObjectId(),
          addressType: "Home",
          address1: "123 Home St",
          address2: "Apt 1",
          city: "Homeville",
          state: "HM",
          zipCode: "12345",
          country: "USA",
        },
      ],
    });
  });

  describe("PUT /api/v2/user/update-address", () => {
    it("should add new address with different type", async () => {
      const newAddress = {
        addressType: "Work",
        address1: "456 Work Ave",
        address2: "Suite 2",
        city: "Workville",
        state: "WK",
        zipCode: "67890",
        country: "USA",
      };

      const res = await request(app)
        .put("/api/v2/user/update-address")
        .set("Cookie", ["token=valid_token"])
        .send(newAddress);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.addresses).toHaveLength(2);
      expect(res.body.user.addresses[1].addressType).toBe("Work");
    });

    it("should return error if address type already exists", async () => {
      const duplicateTypeAddress = {
        addressType: "Home",
        address1: "999 Another St",
        city: "Another City",
        state: "AC",
        zipCode: "11111",
        country: "USA",
      };

      const res = await request(app)
        .put("/api/v2/user/update-address")
        .set("Cookie", ["token=valid_token"])
        .send(duplicateTypeAddress);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Home already exists");
    });
  });
});
