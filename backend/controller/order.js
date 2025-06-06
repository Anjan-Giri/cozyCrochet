const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const ErrorHandler = require("../utils/ErrorHandler.js");
const Order = require("../model/order.js");
const Product = require("../model/product.js");
const sendMail = require("../utils/mail.js");

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
        let shopId;
        if (item.shopId && typeof item.shopId === "object" && item.shopId._id) {
          shopId = item.shopId._id;
        } else if (item.shopId) {
          shopId = item.shopId;
        } else if (item.product && item.product.shopId) {
          shopId = item.product.shopId;
        } else if (item.product && item.product.shop && item.product.shop._id) {
          shopId = item.product.shop._id;
        } else if (item.product && item.product.shop) {
          shopId = item.product.shop;
        } else {
          console.log("Warning: Could not determine shop for item:", item);
          continue;
        }

        console.log(
          `Processing item: ${
            item.product?._id || "unknown"
          } for shop: ${shopId}`
        );

        if (!shopItemsMap[shopId]) {
          shopItemsMap[shopId] = [];
        }

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

        //update product inventory
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

      if (user && user.email) {
        const orderDate = new Date().toLocaleDateString();
        const orderItems = cart
          .map((item) => {
            const productName = item.product?.name || item.name || "Product";
            const price = item.price || 0;
            const quantity = item.quantity || 1;
            return `${productName} x ${quantity} - Nrs. ${price * quantity}`;
          })
          .join("\n");

        const shippingDetails = `
          ${shippingAddress.address1 || ""}
          ${shippingAddress.address2 || ""}
          ${shippingAddress.city || ""}, ${shippingAddress.country || ""}
          ${shippingAddress.zipCode || ""}
        `;

        const paymentMethod = paymentInfo?.type || "Online Payment";
        const orderStatus = "Processing";

        const emailMessage = `
          Hello ${user.name},

          Thank you for your order! We're excited to confirm that your order has been received and is being processed.

          Order Details:
          --------------
          Order Date: ${orderDate}
          Order Number: ${orders[0]?._id || "N/A"}
          Payment Method: ${paymentMethod}
          Order Status: ${orderStatus}

          Products:
          ---------
          ${orderItems}

          Shipping Details:
          ----------------
          ${shippingDetails}

          Order Summary:
          -------------
          Subtotal: Nrs. ${overallSubtotal}
          Shipping: Nrs. ${(overallSubtotal * 0.05).toFixed(2)}
          ${
            totalPrice !== overallSubtotal
              ? `Discount: Nrs. ${(
                  overallSubtotal -
                  totalPrice +
                  overallSubtotal * 0.05
                ).toFixed(2)}`
              : ""
          }
          Total: Nrs. ${totalPrice}

          If you have any questions about your order, please don't hesitate to visit the website or contact us.

          Thank you for shopping with us!
        `;

        try {
          await sendMail({
            email: user.email,
            subject: "Order Confirmation",
            message: emailMessage,
          });
          console.log(`Order confirmation email sent to ${user.email}`);
        } catch (emailError) {
          console.error("Failed to send order confirmation email:", emailError);
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

      let orders = await Order.find({ shopId: shopId }).sort({ createdAt: -1 });

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

//order status update by seller
router.put(
  "/update-order-status/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found", 404));
      }

      //update order status
      order.status = req.body.status;

      //delivered date if status is delivered
      if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();

        if (order.paymentInfo) {
          order.paymentInfo.status = "Succeeded";
        }
      }

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

module.exports = router;
