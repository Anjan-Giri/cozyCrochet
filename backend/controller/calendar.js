const express = require("express");
const router = express.Router();
const { isAuthenticatedUser } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const CalendarEvent = require("../model/calendarEvent");
const User = require("../model/user");
const Product = require("../model/product");

// Add a calendar event
router.post(
  "/add-event",
  isAuthenticatedUser,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { eventType, date, relatedPerson } = req.body;

      if (!eventType || !date) {
        return next(new ErrorHandler("Event type and date are required", 400));
      }

      // Create the calendar event
      const event = await CalendarEvent.create({
        userId: req.user.id,
        eventType,
        date: new Date(date),
        relatedPerson: relatedPerson || "",
      });

      // Add the event to the user's calendarEvents array
      await User.findByIdAndUpdate(req.user.id, {
        $push: { calendarEvents: event._id },
      });

      res.status(201).json({
        success: true,
        event,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Get all calendar events for a user
router.get(
  "/events",
  isAuthenticatedUser,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await CalendarEvent.find({ userId: req.user.id });

      res.status(200).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Update a calendar event
router.put(
  "/update-event/:id",
  isAuthenticatedUser,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { eventType, date, relatedPerson } = req.body;
      const eventId = req.params.id;

      const event = await CalendarEvent.findById(eventId);

      if (!event) {
        return next(new ErrorHandler("Event not found", 404));
      }

      // Check if the event belongs to the user
      if (event.userId !== req.user.id) {
        return next(new ErrorHandler("Unauthorized", 403));
      }

      // Update event fields
      if (eventType) event.eventType = eventType;
      if (date) event.date = new Date(date);
      if (relatedPerson !== undefined) event.relatedPerson = relatedPerson;

      await event.save();

      res.status(200).json({
        success: true,
        event,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Delete a calendar event
router.delete(
  "/delete-event/:id",
  isAuthenticatedUser,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const eventId = req.params.id;

      const event = await CalendarEvent.findById(eventId);

      if (!event) {
        return next(new ErrorHandler("Event not found", 404));
      }

      // Check if the event belongs to the user
      if (event.userId !== req.user.id) {
        return next(new ErrorHandler("Unauthorized", 403));
      }

      // Remove event from user's calendarEvents array
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { calendarEvents: eventId },
      });

      // Delete the event
      await CalendarEvent.findByIdAndDelete(eventId);

      res.status(200).json({
        success: true,
        message: "Event deleted successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Get upcoming event recommendations (for next 2 weeks)
router.get(
  "/recommendations",
  isAuthenticatedUser,
  catchAsyncErrors(async (req, res, next) => {
    try {
      // Get current date and date 2 weeks from now
      const currentDate = new Date();
      const twoWeeksFromNow = new Date();
      twoWeeksFromNow.setDate(currentDate.getDate() + 14);

      // Find events in the next 2 weeks
      const upcomingEvents = await CalendarEvent.find({
        userId: req.user.id,
        date: { $gte: currentDate, $lte: twoWeeksFromNow },
      });

      // Array to hold recommendations
      const recommendations = [];

      // Find matching products for each event
      for (const event of upcomingEvents) {
        // Find products with matching tag
        const matchingProducts = await Product.find({
          tags: { $regex: event.eventType, $options: "i" },
        }).limit(10);

        if (matchingProducts.length > 0) {
          recommendations.push({
            event: event,
            products: matchingProducts,
          });
        }
      }

      res.status(200).json({
        success: true,
        recommendations,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
