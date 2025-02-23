const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Product = require("../model/product");
const Shop = require("../model/shop");
const ErrorHandler = require("../utils/ErrorHandler");
const { upload } = require("../multer");
const { isSeller } = require("../middleware/auth");
const fs = require("fs");

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

      // Validate shop exists
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop not found", 404));
      }

      // Validate required fields
      if (!req.body.name || !req.body.description || !req.body.category) {
        return next(new ErrorHandler("Please fill all required fields", 400));
      }

      // Handle image uploads
      if (!req.files || req.files.length === 0) {
        return next(
          new ErrorHandler("Please upload at least one product image", 400)
        );
      }

      // Format images according to the schema
      const images = req.files.map((file) => ({
        public_id: `products/${file.filename}`, // Create a public_id using filename
        url: `uploads/${file.filename}`, // Create URL path to the uploaded file
      }));

      // Create product with validated data
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

// delete product of a shop
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

      // Fix image deletion
      productData.images.forEach((image) => {
        // Extract filename from the url path
        const filename = image.url.split("/").pop(); // This gets just the filename
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
        // Changed from 201 to 200 for consistency
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// Add this to your product routes file
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

// get all products
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

module.exports = router;
