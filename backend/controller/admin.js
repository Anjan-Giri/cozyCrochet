const express = require("express");
const { upload } = require("../multer.js");
const { isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Admin = require("../model/admin");
const ErrorHandler = require("../utils/ErrorHandler");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/mail.js");
const User = require("../model/user.js");
const Shop = require("../model/shop.js");
const Product = require("../model/product.js");
const Order = require("../model/order.js");
const router = express.Router();
const sendAdminToken = require("../utils/adminToken");

// Create a predefined admin (run once or through a script)
// This is just for reference; you should create your admin through a secure method
router.post(
  "/create-admin",
  upload.single("avatar"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      // Check if admin already exists
      const adminExist = await Admin.findOne({ email });
      if (adminExist) {
        // Delete uploaded file if user exists
        if (req.file) {
          const filename = req.file.filename;
          const filePath = `uploads/${filename}`;
          fs.unlinkSync(filePath);
        }
        return next(new ErrorHandler("Admin already exists", 400));
      }

      if (!req.file) {
        return next(new ErrorHandler("Please upload avatar image", 400));
      }

      const filename = req.file.filename;
      const fileUrl = filename;

      const admin = await Admin.create({
        name,
        email,
        password,
        avatar: {
          url: fileUrl,
          public_id: filename,
        },
      });

      sendAdminToken(admin, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Login admin
router.post(
  "/login-admin",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide email and password", 400));
      }

      const admin = await Admin.findOne({ email }).select("+password");

      if (!admin) {
        return next(new ErrorHandler("Admin not found", 401));
      }

      const isPasswordMatched = await admin.comparePassword(password);

      if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid credentials", 401));
      }

      sendAdminToken(admin, 200, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Admin logout
router.get(
  "/logout",
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("admin_token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });

      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Get admin details
router.get(
  "/admin-details",
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    try {
      console.log("Admin ID from token:", req.admin.id); // Debug log
      const admin = await Admin.findById(req.admin.id);

      if (!admin) {
        console.log("Admin not found in database"); // Debug log
        return next(new ErrorHandler("Admin not found", 404));
      }

      res.status(200).json({
        success: true,
        admin,
      });
    } catch (error) {
      console.error("Admin details error:", error); // Detailed error log
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Get all users
router.get(
  "/all-users",
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const users = await User.find().sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        users,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Delete a user
router.delete(
  "/delete-user/:id",
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      // Delete user avatar if exists
      if (user.avatar && user.avatar.public_id) {
        const filePath = `uploads/${user.avatar.public_id}`;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await User.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Get all shops
router.get(
  "/all-shops",
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shops = await Shop.find().sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        shops,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Delete a shop
router.delete(
  "/delete-shop/:id",
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shop = await Shop.findById(req.params.id);

      if (!shop) {
        return next(new ErrorHandler("Shop not found", 404));
      }

      // Delete shop avatar if exists
      if (shop.avatar && shop.avatar.public_id) {
        const filePath = `uploads/${shop.avatar.public_id}`;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      // Optional: Delete all products associated with this shop
      await Product.deleteMany({ shopId: req.params.id });

      await Shop.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Shop deleted successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Get all products
router.get(
  "/all-products",
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Delete a product
router.delete(
  "/delete-product/:id",
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }

      // Delete product images
      for (let i = 0; i < product.images.length; i++) {
        const filename = product.images[i].url.split("/").pop();
        const filePath = `uploads/${filename}`;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await Product.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Get all orders
router.get(
  "/all-orders",
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find().sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Update order status
router.put(
  "/update-order-status/:id",
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found", 404));
      }

      if (req.body.status === "Delivered") {
        if (order.status === "Delivered") {
          return next(new ErrorHandler("Order is already delivered", 400));
        }
        order.deliveredAt = Date.now();
        order.paymentInfo.status = "Succeeded";
      }

      order.status = req.body.status;

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        message: "Order status updated successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Get dashboard stats
router.get(
  "/dashboard-stats",
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    try {
      // Basic counts
      const userCount = await User.countDocuments();
      const shopCount = await Shop.countDocuments();
      const productCount = await Product.countDocuments();
      const orderCount = await Order.countDocuments();

      // Calculate total revenue from ALL orders, not just delivered ones
      const allOrders = await Order.find();
      const totalRevenue = allOrders.reduce(
        (acc, order) => acc + (order.totalPrice || 0),
        0
      );

      // Get recent orders (last 10) - increasing the number to have more data for time-of-day chart
      const recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(10) // Increased from 5 to 10 for better time of day data
        .populate("user", "name");

      // Monthly revenue statistics - last 12 months with all months included
      const today = new Date();
      const twelveMonthsAgo = new Date(today);
      twelveMonthsAgo.setMonth(today.getMonth() - 12);

      // First get all months in the period to ensure we have all months
      const allMonths = [];
      for (let i = 0; i < 12; i++) {
        const date = new Date(today);
        date.setMonth(today.getMonth() - i);
        allMonths.push({
          month: date.getMonth() + 1, // 1-12
          year: date.getFullYear(),
          name: date.toLocaleString("default", { month: "short" }),
          total: 0, // Initialize to 0
          count: 0,
        });
      }

      // Get actual order data - include ALL orders, not just delivered
      const monthlyOrderData = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: twelveMonthsAgo },
            // Remove status filter to count all orders
          },
        },
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
              year: { $year: "$createdAt" },
            },
            total: { $sum: "$totalPrice" },
            count: { $sum: 1 },
          },
        },
      ]);

      // Merge the actual data with all months
      const monthlyRevenue = allMonths
        .map((month) => {
          const found = monthlyOrderData.find(
            (data) =>
              data._id.month === month.month && data._id.year === month.year
          );
          return {
            month: month.month,
            year: month.year,
            name: month.name,
            total: found ? found.total : 0,
            count: found ? found.count : 0,
          };
        })
        .reverse(); // Show oldest to newest

      // Get all orders for time of day analysis
      const allOrdersForTimeAnalysis = await Order.find()
        .sort({ createdAt: -1 })
        .limit(100); // Get a good sample size for time analysis

      res.status(200).json({
        success: true,
        stats: {
          userCount,
          shopCount,
          productCount,
          orderCount,
          totalRevenue,
          recentOrders,
          monthlyRevenue,
          allOrdersForTimeAnalysis,
        },
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// // Temporary route to create first admin - REMOVE AFTER USE
// router.post(
//   "/init-first-admin",
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       //checking if any admin already exists
//       const adminExists = await Admin.findOne({});
//       if (adminExists) {
//         return next(new ErrorHandler("Initial admin already exists", 400));
//       }

//       const admin = await Admin.create({
//         name: "Anjan Giri",
//         email: "anjannn7768@gmail.com",
//         password: "anjan@55441",
//         avatar: {
//           url: "default-admin.png",
//           public_id: "default-admin",
//         },
//       });

//       res.status(201).json({
//         success: true,
//         message: "Initial admin created successfully",
//         credentials: {
//           email: "anjannn7768@gmail.com",
//           password: "anjan@55441",
//         },
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   })
// );

module.exports = router;
