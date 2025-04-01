const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const ErrorHandler = require("../utils/ErrorHandler.js");
const Order = require("../model/order.js");
const Product = require("../model/product.js");

// create order
router.post(
  "/create-order",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

      console.log("Cart received:", JSON.stringify(cart, null, 2));

      const shopItemsMap = {};

      //properly identify the shop for each item
      for (const item of cart) {
        // Extract the shopId using the correct path based on item structure
        let shopId;
        if (item.shopId && typeof item.shopId === "object" && item.shopId._id) {
          shopId = item.shopId._id; // Handle case where shopId is an object with _id
        } else if (item.shopId) {
          shopId = item.shopId; // Handle case where shopId is already a string
        } else if (item.product && item.product.shopId) {
          shopId = item.product.shopId; // Use product's shopId if available
        } else if (item.product && item.product.shop && item.product.shop._id) {
          shopId = item.product.shop._id; // Handle case where shop is an object with _id
        } else if (item.product && item.product.shop) {
          shopId = item.product.shop; // Handle case where shop is already a string
        } else {
          console.log("Warning: Could not determine shop for item:", item);
          continue;
        }

        console.log(
          `Processing item: ${
            item.product?._id || "unknown"
          } for shop: ${shopId}`
        );

        // Initialize array for this shop if it doesn't exist
        if (!shopItemsMap[shopId]) {
          shopItemsMap[shopId] = [];
        }

        // Add item to appropriate shop's array
        shopItemsMap[shopId].push(item);
      }

      const orders = [];

      //overall subtotal
      const overallSubtotal = cart.reduce(
        (acc, item) => acc + item.quantity * (item.price || 0),
        0
      );

      //each shop order
      for (const [shopId, items] of Object.entries(shopItemsMap)) {
        console.log(
          `Creating order for shop ${shopId} with ${items.length} items`
        );

        //subtotal for shop's items
        const shopSubtotal = items.reduce(
          (acc, item) => acc + item.quantity * (item.price || 0),
          0
        );

        //shipping for shop
        const shopShipping = shopSubtotal * 0.05;

        //apply any discount
        const shopDiscountPortion =
          (shopSubtotal / overallSubtotal) *
          (totalPrice
            ? overallSubtotal - totalPrice + overallSubtotal * 0.05
            : 0);

        //calculate total for this shop
        const shopTotal = shopSubtotal + shopShipping - shopDiscountPortion;

        //create order for specific shop
        const orderData = {
          cart: items,
          shippingAddress,
          user,
          totalPrice: parseFloat(shopTotal.toFixed(2)),
          paymentInfo,
          shopId,
        };

        const order = await Order.create(orderData);
        orders.push(order);

        // Update product inventory for each item in this order
        for (const item of items) {
          if (item.product && item.product._id) {
            const product = await Product.findById(item.product._id);
            if (product) {
              product.stock -= item.quantity;
              product.sold_out += item.quantity;
              await product.save();
            }
          }
        }
      }

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

//get orders of user
router.get(
  "/get-user-orders/:userId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find({ "user._id": req.params.userId }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

//get all orders of seller
router.get(
  "/get-seller-orders/:shopId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.params.shopId;
      console.log("Looking for orders with shopId:", shopId);

      // Try to find orders where shopId is directly in the document
      let orders = await Order.find({ shopId: shopId }).sort({ createdAt: -1 });

      // If no orders found, try alternative approach - checking if shopId is in the cart items
      if (orders.length === 0) {
        orders = await Order.find({
          $or: [
            { shopId: shopId },
            { "cart.shopId": shopId },
            { "cart.product.shopId": shopId },
            { "cart.product.shop": shopId },
          ],
        }).sort({ createdAt: -1 });
      }

      console.log(`Found ${orders.length} orders for shop ${shopId}`);

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      console.error("Error in get-seller-orders:", error);
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

module.exports = router;
