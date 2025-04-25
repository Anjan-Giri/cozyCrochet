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
const crypto = require("crypto");

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

    // const activationUrl = `http://localhost:3000/seller/activation/${activationToken}`;
    const activationUrl =
      process.env.NODE_ENV === "production"
        ? `https://cozycrochet.netlify.app/seller/activation/${activationToken}`
        : `http://localhost:3000/seller/activation/${activationToken}`;

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
  isSeller,
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

//update shop avatar
router.put(
  "/update-shop-avatar",
  isSeller,
  upload.single("image"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      // Check if file was uploaded
      if (!req.file) {
        return next(new ErrorHandler("No image file provided", 400));
      }

      const userExist = await Shop.findById(req.seller._id);

      // Check if user exists
      if (!userExist) {
        return next(new ErrorHandler("User not found", 404));
      }

      console.log("Current user avatar:", userExist.avatar);
      console.log("New file uploaded:", req.file);

      // Handle existing avatar deletion with better error handling
      if (userExist.avatar && userExist.avatar.url) {
        try {
          const existAvatarPath = `uploads/${userExist.avatar.public_id}`;
          console.log("Attempting to delete:", existAvatarPath);

          // Only attempt to delete if the file exists
          if (fs.existsSync(existAvatarPath)) {
            fs.unlinkSync(existAvatarPath);
            console.log("Previous avatar deleted successfully");
          } else {
            console.log("Previous avatar file not found, continuing");
          }
        } catch (deleteErr) {
          console.log("Error deleting previous avatar:", deleteErr);
          // Continue with the update even if deletion fails
        }
      }

      const fileUrl = path.join(req.file.filename);
      console.log("New avatar file URL:", fileUrl);

      const user = await Shop.findByIdAndUpdate(
        req.seller._id,
        {
          avatar: {
            url: fileUrl,
            public_id: req.file.filename,
          },
        },
        { new: true }
      );

      console.log("Seller updated successfully:", user);

      // Send a response back to the client
      res.status(200).json({
        success: true,
        message: "Avatar updated successfully",
        user,
      });
    } catch (error) {
      console.error("Avatar update error:", error);
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//update seller info
router.put(
  "/update-seller",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { name, description, address, phoneNumber, zipCode } = req.body;

      const shop = await Shop.findById(req.seller._id);

      if (!shop) {
        return next(new ErrorHandler("Shop not found", 400));
      }

      shop.name = name;
      shop.description = description;
      shop.address = address;
      shop.phoneNumber = phoneNumber;
      shop.zipCode = zipCode;

      await shop.save();

      res.status(200).json({
        success: true,
        message: "Shop info updated successfully!",
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Request password reset for shops
router.post(
  "/forgot-password",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email } = req.body;

      if (!email) {
        return next(new ErrorHandler("Please provide an email", 400));
      }

      const shop = await Shop.findOne({ email });

      if (!shop) {
        return next(new ErrorHandler("Shop not found with this email", 404));
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(20).toString("hex");

      // Hash and add to shop document
      shop.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      // Token valid for 15 minutes
      shop.resetPasswordTime = Date.now() + 15 * 60 * 1000;

      await shop.save({ validateBeforeSave: false });

      // Create reset URL
      // const resetUrl = `http://localhost:3000/seller/reset-password/${resetToken}`;
      const resetUrl =
        process.env.NODE_ENV === "production"
          ? `https://cozycrochet.netlify.app/seller/reset-password/${resetToken}`
          : `http://localhost:3000/seller/reset-password/${resetToken}`;

      // Email message
      const message = `
        Hello ${shop.name},

        You requested a password reset for your shop account. Please use the link below to reset your password:

        ${resetUrl}

        If you didn't request this, please ignore this email.

        This link is valid for 15 minutes.
      `;

      try {
        await sendMail({
          email: shop.email,
          subject: "cozyCrochet Shop Password Reset",
          message,
        });

        res.status(200).json({
          success: true,
          message: `Reset password email sent to ${shop.email}`,
        });
      } catch (error) {
        shop.resetPasswordToken = undefined;
        shop.resetPasswordTime = undefined;
        await shop.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Reset password for shops
router.post(
  "/reset-password/:token",
  catchAsyncErrors(async (req, res, next) => {
    try {
      // Hash the token from URL
      const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

      // Find shop with this token and valid expiry time
      const shop = await Shop.findOne({
        resetPasswordToken,
        resetPasswordTime: { $gt: Date.now() },
      });

      if (!shop) {
        return next(
          new ErrorHandler("Reset token is invalid or has expired", 400)
        );
      }

      // Validate passwords
      const { password, confirmPassword } = req.body;

      if (!password || !confirmPassword) {
        return next(new ErrorHandler("Please provide both passwords", 400));
      }

      if (password !== confirmPassword) {
        return next(new ErrorHandler("Passwords do not match", 400));
      }

      // Update password
      shop.password = password;
      shop.resetPasswordToken = undefined;
      shop.resetPasswordTime = undefined;

      await shop.save();

      res.status(200).json({
        success: true,
        message: "Password has been reset successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
