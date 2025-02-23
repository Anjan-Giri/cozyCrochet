const express = require("express");
const path = require("path");
const router = express.Router();
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/mail.js");
const { isAuthenticatedUser, isSeller } = require("../middleware/auth.js");

const { upload } = require("../multer.js");
const Shop = require("../model/shop.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const ErrorHandler = require("../utils/ErrorHandler.js");
const sendShopToken = require("../utils/shopToken.js");
const Product = require("../model/product.js");

router.post("/create-shop", upload.single("avatar"), async (req, res, next) => {
  try {
    const { email } = req.body;
    const sellerEmail = await Shop.findOne({ email });

    if (sellerEmail) {
      const filename = req.file.filename;
      const filePath = `uploads/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
          res.status(500).json("Error deleting file");
        }
      });

      return next(new ErrorHandler("User already exists", 400));
    }

    const filename = req.file.filename;
    const fileUrl = path.join(filename);

    const seller = {
      name: req.body.name,
      email: email,
      password: req.body.password,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      zipCode: req.body.zipCode,
      avatar: {
        url: fileUrl,
        public_id: filename,
      },
    };

    const activationToken = createActivationToken(seller);

    const activationUrl = `http://localhost:3000/seller/activation/${activationToken}`;

    try {
      await sendMail({
        email: seller.email,
        subject: "Activation Link",
        message: `Hello ${seller.name}, Please click on the link to activate your account. ${activationUrl}`,
      });

      res.status(201).json({
        success: true,
        message: `please check your mail ${seller.email} for activation`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

//activationTojen

const createActivationToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET_KEY, {
    expiresIn: "5m",
  });
};

//seller activate

router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      const newSeller = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET_KEY
      );

      if (!newSeller) {
        return next(new ErrorHandler("Invalid token", 400));
      }

      const { name, email, password, avatar, address, phoneNumber, zipCode } =
        newSeller;

      let seller = await Shop.findOne({ email });

      if (seller) {
        return next(new ErrorHandler("User already exists", 400));
      }

      seller = await Shop.create({
        name,
        email,
        password,
        avatar,
        address,
        phoneNumber,
        zipCode,
      });

      sendShopToken(seller, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//seller login

router.post(
  "/login-shop",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
      }

      const user = await Shop.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("No user found", 400));
      }

      const isPasswordMatched = await user.comparePassword(password);

      if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      sendShopToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//seller load

router.get(
  "/getseller",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      // console.log(req.seller);
      const seller = await Shop.findById(req.seller.id);

      if (!seller) {
        return next(new ErrorHandler("User not found", 400));
      }

      res.status(200).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//logout

router.get(
  "/logout",
  isAuthenticatedUser,
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("seller_token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });

      res.status(201).json({
        success: true,
        message: "Logged out Successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// top shops
router.get(
  "/top-shops",
  catchAsyncErrors(async (req, res, next) => {
    try {
      // First get all shops
      const shops = await Shop.find().select("name avatar");

      // Get product counts for each shop using your existing schema
      const shopsWithProducts = await Promise.all(
        shops.map(async (shop) => {
          // Count products for this shop using string ID
          const productCount = await Product.countDocuments({
            shopId: shop._id.toString(),
          });

          return {
            _id: shop._id,
            name: shop.name,
            avatar: shop.avatar,
            productCount: productCount,
          };
        })
      );

      // Sort by product count and get top shops
      const topShops = shopsWithProducts
        .sort((a, b) => b.productCount - a.productCount)
        .slice(0, 3);

      res.status(200).json({
        success: true,
        shops: topShops,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Get shop info by ID (public route)
router.get(
  "/get-shop-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shop = await Shop.findById(req.params.id);

      if (!shop) {
        return next(new ErrorHandler("Shop not found", 404));
      }

      // Count total products for this shop
      const totalProducts = await Product.countDocuments({
        shopId: shop._id.toString(),
      });

      // Create a shop object without sensitive information
      const safeShopData = {
        _id: shop._id,
        name: shop.name,
        description: shop.description,
        address: shop.address,
        phoneNumber: shop.phoneNumber,
        avatar: shop.avatar,
        ratings: shop.ratings,
        createdAt: shop.createdAt,
        totalProducts: totalProducts,
      };

      res.status(200).json({
        success: true,
        shop: safeShopData,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
