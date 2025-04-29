const express = require("express");
const router = express.Router();
const { isAuthenticatedUser } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const CalendarEvent = require("../model/calendarEvent");
const User = require("../model/user");
const Product = require("../model/product");
// const Order = require("../model/order");

//add a calendar event
router.post(
  "/add-event",
  isAuthenticatedUser,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { eventType, date, relatedPerson } = req.body;

      if (!eventType || !date) {
        return next(new ErrorHandler("Event type and date are required", 400));
      }

      //create the event
      const event = await CalendarEvent.create({
        userId: req.user.id,
        eventType,
        date: new Date(date),
        relatedPerson: relatedPerson || "",
      });

      //add the event to array
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

//get all calendar events for a user
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

//update calendar event
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

      //checking if the event belongs to the user
      if (event.userId !== req.user.id) {
        return next(new ErrorHandler("Unauthorized", 403));
      }

      //update event fields
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

//delete event
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

      if (event.userId !== req.user.id) {
        return next(new ErrorHandler("Unauthorized", 403));
      }

      //remove event
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { calendarEvents: eventId },
      });

      //delete
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

//get upcoming event recommendations for next 2 weeks
router.get(
  "/recommendations",
  isAuthenticatedUser,
  catchAsyncErrors(async (req, res, next) => {
    try {
      //current date and date 2 weeks from now
      const currentDate = new Date();
      const twoWeeksFromNow = new Date();
      twoWeeksFromNow.setDate(currentDate.getDate() + 14);

      //events in the next 2 weeks
      const upcomingEvents = await CalendarEvent.find({
        userId: req.user.id,
        date: { $gte: currentDate, $lte: twoWeeksFromNow },
      });

      const recommendations = [];

      //matching products for each event
      for (const event of upcomingEvents) {
        //products with matching tag
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

// router.get(
//   "/smart-recommendations",
//   isAuthenticatedUser,
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       // Get current date and date 2 weeks from now
//       const currentDate = new Date();
//       const twoWeeksFromNow = new Date();
//       twoWeeksFromNow.setDate(currentDate.getDate() + 14);

//       // Find user's upcoming events in the next 2 weeks
//       const upcomingEvents = await CalendarEvent.find({
//         userId: req.user.id,
//         date: { $gte: currentDate, $lte: twoWeeksFromNow },
//       });

//       // Get the user's complete order history
//       const userOrders = await Order.find({ "user._id": req.user.id }).sort({
//         createdAt: -1,
//       });

//       // STEP 1: BUILD USER PREFERENCE PROFILE
//       const userProfile = {
//         categories: {}, // Track preferred product categories
//         priceRanges: {}, // Track usual spending per event type
//         tags: {}, // Track interest in specific product tags
//         eventPreferences: {}, // Track what user usually buys for each event type
//         shops: {}, // Track preferred shops
//         recentSearches: [], // Could be populated from search history if available
//       };

//       // Analyze order history to build preference profile
//       for (const order of userOrders) {
//         // Process each item in the orders
//         for (const item of order.cart) {
//           // Extract product information
//           const product = item.product || {};
//           const price = item.price || 0;
//           const quantity = item.quantity || 1;

//           // Track category preferences
//           if (product.category) {
//             userProfile.categories[product.category] =
//               (userProfile.categories[product.category] || 0) + 1;
//           }

//           // Track tag preferences
//           if (product.tags && Array.isArray(product.tags)) {
//             product.tags.forEach((tag) => {
//               userProfile.tags[tag] = (userProfile.tags[tag] || 0) + 1;
//             });
//           }

//           // Track shop preferences
//           const shopId =
//             item.shopId || product.shopId || (product.shop && product.shop._id);
//           if (shopId) {
//             userProfile.shops[shopId] = (userProfile.shops[shopId] || 0) + 1;
//           }

//           // Track price ranges
//           const priceRange = getPriceRange(price);
//           userProfile.priceRanges[priceRange] =
//             (userProfile.priceRanges[priceRange] || 0) + 1;
//         }
//       }

//       // Calculate the user's average spend
//       let totalSpent = 0;
//       let orderCount = 0;

//       userOrders.forEach((order) => {
//         totalSpent += order.totalPrice || 0;
//         orderCount++;
//       });

//       const averageOrderValue = orderCount > 0 ? totalSpent / orderCount : 0;

//       // STEP 2: BUILD RECOMMENDATIONS FOR EACH UPCOMING EVENT
//       const smartRecommendations = [];

//       for (const event of upcomingEvents) {
//         // Calculate days until the event
//         const eventDate = new Date(event.date);
//         const daysUntilEvent = Math.ceil(
//           (eventDate - currentDate) / (1000 * 60 * 60 * 24)
//         );

//         // STEP 3: APPLY CONTEXTUAL FACTORS

//         // 3.1 Event type matching - basic matching as before
//         let baseProducts = await Product.find({
//           tags: { $regex: event.eventType, $options: "i" },
//           stock: { $gt: 0 }, // Only in-stock products
//         }).limit(50); // Get more initially for ranking

//         // 3.2 Add season-appropriate products
//         const currentMonth = currentDate.getMonth();
//         let seasonTags = [];

//         // Determine season based on month
//         if ([11, 0, 1].includes(currentMonth)) {
//           seasonTags = ["winter", "holiday", "new year"];
//         } else if ([2, 3, 4].includes(currentMonth)) {
//           seasonTags = ["spring", "fresh", "floral"];
//         } else if ([5, 6, 7].includes(currentMonth)) {
//           seasonTags = ["summer", "beach", "outdoor"];
//         } else {
//           seasonTags = ["autumn", "fall", "harvest"];
//         }

//         // Add seasonal products if not enough products initially
//         if (baseProducts.length < 10) {
//           const seasonalProducts = await Product.find({
//             tags: { $in: seasonTags },
//             stock: { $gt: 0 },
//           }).limit(20);

//           baseProducts = [...baseProducts, ...seasonalProducts];
//         }

//         // STEP 4: SCORE AND RANK PRODUCTS
//         const scoredProducts = baseProducts.map((product) => {
//           let score = 0;

//           // 4.1 Direct event type match score
//           if (product.tags) {
//             if (Array.isArray(product.tags)) {
//               // If tags is an array, use .some()
//               if (
//                 product.tags.some((tag) =>
//                   tag.toLowerCase().includes(event.eventType.toLowerCase())
//                 )
//               ) {
//                 score += 50;
//               }
//             } else if (typeof product.tags === "string") {
//               // If tags is a string, check if it includes the event type
//               if (
//                 product.tags
//                   .toLowerCase()
//                   .includes(event.eventType.toLowerCase())
//               ) {
//                 score += 50;
//               }
//             }
//           }

//           // 4.2 Add score based on user's category preferences
//           if (product.category && userProfile.categories[product.category]) {
//             score += userProfile.categories[product.category] * 5;
//           }

//           // 4.3 Tag preference score
//           // 4.3 Tag preference score
//           if (product.tags) {
//             if (Array.isArray(product.tags)) {
//               product.tags.forEach((tag) => {
//                 if (userProfile.tags[tag]) {
//                   score += userProfile.tags[tag] * 3;
//                 }

//                 // Seasonal relevance bonus
//                 if (seasonTags.includes(tag.toLowerCase())) {
//                   score += 10;
//                 }
//               });
//             } else if (typeof product.tags === "string") {
//               const tag = product.tags;
//               if (userProfile.tags[tag]) {
//                 score += userProfile.tags[tag] * 3;
//               }

//               // Seasonal relevance bonus for string tag
//               if (
//                 seasonTags.some((seasonTag) =>
//                   tag.toLowerCase().includes(seasonTag)
//                 )
//               ) {
//                 score += 10;
//               }
//             }
//           }

//           // 4.4 Price range alignment
//           const productPrice =
//             product.discountPrice || product.originalPrice || 0;
//           const priceRange = getPriceRange(productPrice);

//           if (userProfile.priceRanges[priceRange]) {
//             score += userProfile.priceRanges[priceRange] * 4;
//           }

//           // 4.5 Preferred shop bonus
//           const shopId = product.shopId || (product.shop && product.shop._id);
//           if (shopId && userProfile.shops[shopId]) {
//             score += userProfile.shops[shopId] * 8;
//           }

//           // 4.6 Urgency factor - boost score for events happening soon
//           if (daysUntilEvent <= 3) {
//             score *= 1.5; // 50% boost for very soon events
//           } else if (daysUntilEvent <= 7) {
//             score *= 1.25; // 25% boost for events within a week
//           }

//           // 4.7 Discount factor - boost products on sale
//           if (
//             product.discountPrice &&
//             product.originalPrice > product.discountPrice
//           ) {
//             const discountPercentage =
//               (product.originalPrice - product.discountPrice) /
//               product.originalPrice;
//             score += discountPercentage * 30; // Up to 30 points for highly discounted items
//           }

//           return {
//             product,
//             score,
//             reasons: buildPersonalizationReasons(
//               product,
//               event,
//               userProfile,
//               daysUntilEvent
//             ),
//           };
//         });

//         // Sort by score and get top products
//         scoredProducts.sort((a, b) => b.score - a.score);
//         const topRecommendations = scoredProducts.slice(0, 10);

//         if (topRecommendations.length > 0) {
//           smartRecommendations.push({
//             event,
//             products: topRecommendations.map((item) => item.product),
//             personalizationReasons: topRecommendations.map(
//               (item) => item.reasons
//             ),
//             urgency: getUrgencyLevel(daysUntilEvent),
//           });
//         }
//       }

//       res.status(200).json({
//         success: true,
//         recommendations: smartRecommendations,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   })
// );

// // Helper function to determine price range
// function getPriceRange(price) {
//   if (price < 500) return "budget";
//   if (price < 2000) return "mid-range";
//   if (price < 5000) return "premium";
//   return "luxury";
// }

// // Helper function to build personalized reasons for recommendations
// function buildPersonalizationReasons(
//   product,
//   event,
//   userProfile,
//   daysUntilEvent
// ) {
//   const reasons = [];

//   // Basic event match reason
//   reasons.push(
//     `Perfect for ${event.relatedPerson ? `${event.relatedPerson}'s` : "the"} ${
//       event.eventType
//     }`
//   );

//   // Check if this matches user's usual spending pattern
//   const productPrice = product.discountPrice || product.originalPrice;
//   const priceRange = getPriceRange(productPrice);

//   if (
//     userProfile.priceRanges[priceRange] &&
//     userProfile.priceRanges[priceRange] > 2
//   ) {
//     reasons.push(`Matches your usual price preference`);
//   }

//   // Check if it's from a preferred shop
//   const shopId = product.shopId || (product.shop && product.shop._id);
//   if (shopId && userProfile.shops[shopId] && userProfile.shops[shopId] > 1) {
//     reasons.push(`From a shop you've ordered from before`);
//   }

//   // Check if on sale
//   if (product.discountPrice && product.originalPrice > product.discountPrice) {
//     const discountPercent = Math.round(
//       ((product.originalPrice - product.discountPrice) /
//         product.originalPrice) *
//         100
//     );
//     if (discountPercent >= 15) {
//       reasons.push(`On sale: ${discountPercent}% off!`);
//     }
//   }

//   // Urgency reason
//   if (daysUntilEvent <= 3) {
//     reasons.push(`Get it quick - event is in ${daysUntilEvent} days!`);
//   }

//   return reasons;
// }

// // Helper function to determine urgency level
// function getUrgencyLevel(daysUntilEvent) {
//   if (daysUntilEvent <= 2) return "critical";
//   if (daysUntilEvent <= 5) return "high";
//   if (daysUntilEvent <= 10) return "medium";
//   return "low";
// }

module.exports = router;
