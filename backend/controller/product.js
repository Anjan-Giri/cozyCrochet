const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Product = require("../model/product");
const Shop = require("../model/shop");
const ErrorHandler = require("../utils/ErrorHandler");
const { upload } = require("../multer");
const { isSeller } = require("../middleware/auth");

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

      const product = await Product.findByIdAndDelete(productId);

      if (!product) {
        return next(new ErrorHandler("Product not found", 500));
      }

      // for (let i = 0; 1 < product.images.length; i++) {
      //   const result = await cloudinary.v2.uploader.destroy(
      //     product.images[i].public_id
      //   );
      // }

      // await product.remove();

      res.status(201).json({
        success: true,
        message: "Deleted Product",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

module.exports = router;
