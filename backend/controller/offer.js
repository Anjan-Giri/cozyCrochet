const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { upload } = require("../multer");
const Shop = require("../model/shop");
const Product = require("../model/product");
const router = express.Router();
const Offer = require("../model/offer");
const { isSeller } = require("../middleware/auth");
const fs = require("fs");
const ErrorHandler = require("../utils/ErrorHandler");

// create offer
router.post(
  "/create-offer",
  upload.array("images", 5),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const productId = req.body.productId;

      if (!shopId) {
        return next(new ErrorHandler("Shop ID is required", 400));
      }

      //validating shop
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop not found", 404));
      }

      //find original product
      let originalProduct = null;
      if (productId) {
        originalProduct = await Product.findById(productId);
        if (!originalProduct) {
          return next(new ErrorHandler("Original product not found", 404));
        }

        //verify the product is of same shop
        if (originalProduct.shopId.toString() !== shopId.toString()) {
          return next(
            new ErrorHandler("Product does not belong to this shop", 403)
          );
        }
      }

      if (!req.body.name || !req.body.description || !req.body.category) {
        return next(new ErrorHandler("Please fill all required fields", 400));
      }

      //image uploads
      let images = [];

      if (req.files && req.files.length > 0) {
        //formatting images
        images = req.files.map((file) => ({
          public_id: `products/${file.filename}`,
          url: `uploads/${file.filename}`,
        }));
      } else if (originalProduct) {
        //using original product images if no new images are uploaded
        images = originalProduct.images;
      } else {
        return next(
          new ErrorHandler("Please upload at least one product image", 400)
        );
      }

      //offer dates
      if (!req.body.startDate || !req.body.endDate) {
        return next(
          new ErrorHandler("Start and end dates are required for offers", 400)
        );
      }

      const startDate = new Date(req.body.startDate);
      const endDate = new Date(req.body.endDate);

      if (startDate >= endDate) {
        return next(new ErrorHandler("End date must be after start date", 400));
      }

      //create offer with validated data
      const offerData = {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        startDate: startDate,
        endDate: endDate,
        status: req.body.status || "active",
        tags: req.body.tags || "",
        originalPrice: req.body.originalPrice,
        discountPrice: req.body.discountPrice,
        stock: req.body.stock,
        images: images,
        shopId: shopId,
        shop: shop,
        sold_out: 0,
        productId: productId || null,
      };

      const offerProduct = await Offer.create(offerData);

      res.status(201).json({
        success: true,
        offerProduct,
      });
    } catch (error) {
      console.error("Offer creation error:", error);
      return next(
        new ErrorHandler(error.message || "Error creating offer", 500)
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

      //delete images if they're not of original product
      if (!offerData.productId) {
        //offer images
        offerData.images.forEach((image) => {
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
      }

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

// get all offers
router.get(
  "/get-all-offers",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const offers = await Offer.find();
      res.status(200).json({
        success: true,
        offers,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

module.exports = router;
