const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Product = require("../model/product");
const Shop = require("../model/shop");
const ErrorHandler = require("../utils/ErrorHandler");
const { upload } = require("../multer");
const { isSeller, isAuthenticatedUser } = require("../middleware/auth");
const fs = require("fs");
const Order = require("../model/order");

// create product
router.post(
  "/create-product",
  upload.array("images", 5),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;

      if (!shopId) {
        return next(new ErrorHandler("Shop ID is required", 400));
      }

      //validate if shop exists
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop not found", 404));
      }

      //validate required fields
      if (!req.body.name || !req.body.description || !req.body.category) {
        return next(new ErrorHandler("Please fill all required fields", 400));
      }

      //handling images
      if (!req.files || req.files.length === 0) {
        return next(
          new ErrorHandler("Please upload at least one product image", 400)
        );
      }

      //formattin images according to the schema
      const images = req.files.map((file) => ({
        public_id: `products/${file.filename}`,
        url: `uploads/${file.filename}`,
      }));

      //create product with validated data
      const productData = {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        tags: req.body.tags || "",
        originalPrice: req.body.originalPrice,
        discountPrice: req.body.discountPrice,
        stock: req.body.stock,
        images: images,
        shopId: shopId,
        shop: shop,
        sold_out: 0,
      };

      const product = await Product.create(productData);

      res.status(201).json({
        success: true,
        product,
      });
    } catch (error) {
      console.error("Product creation error:", error);
      return next(
        new ErrorHandler(error.message || "Error creating product", 500)
      );
    }
  })
);

// get all products of a shop
router.get(
  "/get-all-products-shop/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find({ shopId: req.params.id });

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// delete product of shop
router.delete(
  "/delete-shop-product/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.id;
      const productData = await Product.findById(productId);

      if (!productData) {
        return next(new ErrorHandler("Product not found", 404));
      }

      //image deletion
      productData.images.forEach((image) => {
        //extracting filename from the url path
        const filename = image.url.split("/").pop();
        const filePath = `uploads/${filename}`;

        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Successfully deleted: ${filePath}`);
          } else {
            console.log(`File not found: ${filePath}`);
          }
        } catch (err) {
          console.log(`Error deleting file ${filePath}:`, err);
        }
      });

      const product = await Product.findByIdAndDelete(productId);

      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// get all products
router.get(
  "/get-all-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find();

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// all products search
router.get(
  "/search/:keyword",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const keyword = req.params.keyword;

      const products = await Product.find({
        name: { $regex: keyword, $options: "i" },
      });

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// update product
router.put(
  "/update-product/:id",
  isSeller,
  upload.array("images", 5),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.id;
      const product = await Product.findById(productId);

      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }

      //checking if seller owns product
      if (product.shopId !== req.body.shopId && req.seller.role !== "Admin") {
        return next(
          new ErrorHandler("You are not authorized to update this product", 403)
        );
      }

      //validate required fields
      if (!req.body.name || !req.body.description || !req.body.category) {
        return next(new ErrorHandler("Please fill all required fields", 400));
      }

      //update basic product data
      product.name = req.body.name;
      product.description = req.body.description;
      product.category = req.body.category;
      product.tags = req.body.tags || "";
      product.originalPrice = req.body.originalPrice;
      product.discountPrice = req.body.discountPrice;
      product.stock = req.body.stock;

      //new images if provided
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map((file) => ({
          public_id: `products/${file.filename}`,
          url: `uploads/${file.filename}`,
        }));

        //old images data
        if (req.body.oldImages) {
          let oldImages = [];

          try {
            oldImages = JSON.parse(req.body.oldImages);
          } catch (err) {
            return next(new ErrorHandler("Invalid old images data", 400));
          }

          //combinining old and new images
          product.images = [...oldImages, ...newImages];
        } else {
          product.images.forEach((image) => {
            const filename = image.url.split("/").pop();
            const filePath = `uploads/${filename}`;

            try {
              if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
              }
            } catch (err) {
              console.log(`Error deleting file ${filePath}:`, err);
            }
          });

          product.images = newImages;
        }
      }

      await product.save();

      res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      return next(
        new ErrorHandler(error.message || "Error updating product", 500)
      );
    }
  })
);

// get all product categories
router.get(
  "/get-all-categories",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const categories = await Product.distinct("category");

      res.status(200).json({
        success: true,
        categories,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

//product review
router.put(
  "/create-review",
  isAuthenticatedUser,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { user, rating, comment, productId, orderId, cartItemId } =
        req.body;

      if (!productId || !orderId || !cartItemId) {
        return next(new ErrorHandler("All IDs are required for review", 400));
      }

      //reviews
      const product = await Product.findById(productId);
      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }

      const reviewData = {
        user,
        rating: Number(rating),
        comment,
        productId,
        orderId,
        createdAt: new Date(),
      };

      //checking for existing review
      const existingReviewIndex = product.reviews.findIndex(
        (rev) => rev.user && rev.user._id.toString() === user._id.toString()
      );

      if (existingReviewIndex >= 0) {
        product.reviews[existingReviewIndex] = reviewData;
      } else {
        product.reviews.push(reviewData);
      }

      //update average rating
      product.ratings =
        product.reviews.reduce((acc, item) => acc + item.rating, 0) /
        product.reviews.length;
      await product.save({ validateBeforeSave: false });

      //update Order's Cart Item
      const order = await Order.findById(orderId);
      if (!order) {
        return next(new ErrorHandler("Order not found", 404));
      }

      //validate the cart item
      const cartItemIndex = order.cart.findIndex(
        (item) => item._id.toString() === cartItemId
      );

      if (cartItemIndex === -1) {
        return next(new ErrorHandler("Cart item not found in order", 404));
      }

      const cartItem = order.cart[cartItemIndex];

      //verify product matches
      const itemProductId =
        cartItem.product?._id?.toString() ||
        cartItem.product?.toString() ||
        cartItem.productId?.toString();

      if (itemProductId !== productId) {
        return next(new ErrorHandler("Product doesn't match cart item", 400));
      }

      //update the cart item
      order.cart[cartItemIndex] = {
        ...cartItem,
        isReviewed: true,
        reviewedAt: new Date(),
      };

      await order.save();

      res.status(200).json({
        success: true,
        message: "Review submitted successfully!",
        product: {
          _id: product._id,
          name: product.name,
          ratings: product.ratings,
          reviewCount: product.reviews.length,
        },
        orderId: order._id,
      });
    } catch (error) {
      console.error("Review submission error:", error);
      return next(
        new ErrorHandler(error.message || "Review submission failed", 500)
      );
    }
  })
);

module.exports = router;
