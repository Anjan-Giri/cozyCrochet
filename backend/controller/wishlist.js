const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticatedUser } = require("../middleware/auth");
const ErrorHandler = require("../utils/ErrorHandler");
const Wishlist = require("../model/wishlist");
const Product = require("../model/product");

router.get(
  "/list",
  isAuthenticatedUser,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const wishlist = await Wishlist.findOne({ user: req.user.id })
        .populate("items.product")
        .sort({ createdAt: -1 });

      if (!wishlist) {
        return res.status(200).json({
          success: true,
          wishlist: { items: [] },
        });
      }

      res.status(200).json({
        success: true,
        wishlist,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// Add to wishlist - changed from /add to /create
router.post(
  "/create",
  isAuthenticatedUser,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { productId } = req.body;
      const userId = req.user.id;

      // Check if product exists
      const product = await Product.findById(productId);
      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }

      // Find existing wishlist or create new
      let wishlist = await Wishlist.findOne({ user: userId });

      if (!wishlist) {
        wishlist = new Wishlist({
          user: userId,
          items: [],
        });
      }

      // Check if product already in wishlist
      const existingItemIndex = wishlist.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (existingItemIndex === -1) {
        // Add new item to wishlist
        wishlist.items.push({ product: productId });
        await wishlist.save();
      }

      const populatedWishlist = await Wishlist.findById(wishlist._id).populate(
        "items.product"
      );

      res.status(201).json({
        success: true,
        wishlist: populatedWishlist,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// Remove item from wishlist - changed from /remove/:productId to /delete/:productId
router.delete(
  "/delete/:productId",
  isAuthenticatedUser,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.productId;
      const userId = req.user.id;

      const wishlist = await Wishlist.findOne({ user: userId });

      if (!wishlist) {
        return next(new ErrorHandler("Wishlist not found", 404));
      }

      wishlist.items = wishlist.items.filter(
        (item) => item.product.toString() !== productId
      );

      await wishlist.save();

      const populatedWishlist = await Wishlist.findById(wishlist._id).populate(
        "items.product"
      );

      res.status(200).json({
        success: true,
        wishlist: populatedWishlist,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

module.exports = router;
