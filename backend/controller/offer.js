const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { upload } = require("../multer");
const Shop = require("../model/shop");
const router = express.Router();
const Offer = require("../model/offer");
const { isSeller } = require("../middleware/auth");
const fs = require("fs");

// create offer
router.post(
  "/create-offer",
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
      const offerData = {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        status: req.body.status || "active",
        tags: req.body.tags || "",
        originalPrice: req.body.originalPrice,
        discountPrice: req.body.discountPrice,
        stock: req.body.stock,
        images: images,
        shopId: shopId,
        shop: shop,
        sold_out: 0,
      };

      const offerProduct = await Offer.create(offerData);

      res.status(201).json({
        success: true,
        offerProduct,
      });
    } catch (error) {
      console.error("Product creation error:", error);
      return next(
        new ErrorHandler(error.message || "Error creating product", 500)
      );
    }
  })
);

// get all offers of a shop
router.get(
  "/get-all-offers-shop/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const offers = await Offer.find({ shopId: req.params.id });

      res.status(201).json({
        success: true,
        offers,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// delete offer of a shop
router.delete(
  "/delete-shop-offer/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.id;

      const offerData = await Offer.findById(productId);

      if (!offerData) {
        return next(new ErrorHandler("Offer not found", 500));
      }

      // Fix image deletion
      offerData.images.forEach((image) => {
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

      const offer = await Offer.findByIdAndDelete(productId);

      res.status(200).json({
        success: true,
        message: "Deleted Offer",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

module.exports = router;
