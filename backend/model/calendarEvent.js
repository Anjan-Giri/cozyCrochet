const mongoose = require("mongoose");

const calendarEventSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  eventType: {
    type: String,
    required: true,
    enum: [
      "birthday",
      "valentine",
      "anniversary",
      "new year",
      "graduation",
      "wedding",
    ],
  },
  date: {
    type: Date,
    required: true,
  },
  relatedPerson: {
    type: String,
    default: "",
  },
  notificationSent: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("CalendarEvent", calendarEventSchema);
