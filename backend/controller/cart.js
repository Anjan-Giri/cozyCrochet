const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticatedUser } = require("../middleware/auth");
const ErrorHandler = require("../utils/ErrorHandler");
const Cart = require("../model/cart");
const Product = require("../model/product");

// get user cart
router.get(
  "/my-cart",
  isAuthenticatedUser,
  catchAsyncErrors(async (req, res, next) => {
    try {
      console.log("Fetching cart for user ID:", req.user.id);

      const cart = await Cart.findOne({ user: req.user.id })
        .populate("items.product")
        .sort({ createdAt: -1 });

      console.log("Found Cart:", cart);

      if (!cart) {
        return res.status(200).json({
          success: true,
          cart: { items: [] },
        });
      }

      res.status(200).json({
        success: true,
        cart,
      });
    } catch (error) {
      console.error("Cart Fetch Error:", error);
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// update cart item quantity - CORRECTED ROUTE
router.put(
  "/update-quantity",
  isAuthenticatedUser,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { productId, quantity } = req.body;
      const userId = req.user.id;

      const cart = await Cart.findOne({ user: userId });

      if (!cart) {
        return next(new ErrorHandler("Cart not found", 404));
      }

      const product = await Product.findById(productId);
      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }

      // Validate stock
      if (quantity > product.stock) {
        return next(new ErrorHandler("Insufficient product stock", 400));
      }

      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
        await cart.save();
      } else {
        return next(new ErrorHandler("Item not in cart", 404));
      }

      const populatedCart = await Cart.findById(cart._id).populate(
        "items.product"
      );

      res.status(200).json({
        success: true,
        cart: populatedCart,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// remove item from cart - CORRECTED ROUTE
router.delete(
  "/remove/:productId",
  isAuthenticatedUser,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.productId;
      const userId = req.user.id;

      const cart = await Cart.findOne({ user: userId });

      if (!cart) {
        return next(new ErrorHandler("Cart not found", 404));
      }

      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId
      );

      await cart.save();

      const populatedCart = await Cart.findById(cart._id).populate(
        "items.product"
      );

      res.status(200).json({
        success: true,
        cart: populatedCart,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// add to cart - CORRECTED ROUTE
router.post(
  "/add",
  isAuthenticatedUser,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { productId, quantity = 1 } = req.body;
      const userId = req.user.id;

      // Check if product exists
      const product = await Product.findById(productId);
      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }

      // Check stock availability
      if (quantity > product.stock) {
        return next(new ErrorHandler("Insufficient product stock", 400));
      }

      // Find existing cart or create new
      let cart = await Cart.findOne({ user: userId });

      if (!cart) {
        cart = new Cart({
          user: userId,
          items: [],
        });
      }

      // Check if product already in cart
      const existingItemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        cart.items.push({
          product: productId,
          quantity: quantity,
          price: product.discountPrice || product.originalPrice,
        });
      }

      await cart.save();

      const populatedCart = await Cart.findById(cart._id).populate(
        "items.product"
      );

      res.status(201).json({
        success: true,
        cart: populatedCart,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// cart clear
router.delete(
  "/clear",
  isAuthenticatedUser,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const userId = req.user.id;

      const cart = await Cart.findOne({ user: userId });

      if (!cart) {
        return next(new ErrorHandler("Cart not found", 404));
      }

      // Empty the items array
      cart.items = [];
      await cart.save();

      res.status(200).json({
        success: true,
        cart,
        message: "Cart cleared successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

module.exports = router;
