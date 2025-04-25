const express = require("express");
const path = require("path");
const router = express.Router();
const { upload } = require("../multer.js");
const User = require("../model/user.js");
const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/mail.js");
const sendToken = require("../utils/jwtToken.js");
const { isAuthenticatedUser } = require("../middleware/auth.js");
const crypto = require("crypto");

router.post("/create-user", upload.single("avatar"), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userEmail = await User.findOne({ email });

    if (userEmail) {
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

    const user = {
      name: name,
      email: email,
      password: password,
      avatar: {
        url: fileUrl,
        public_id: filename,
      },
    };

    // console.log(user);

    // const newUser = await User.create(user);

    const activationToken = createActivationToken(user);

    // const activationUrl = `http://localhost:3000/activation/${activationToken}`;
    const activationUrl =
      process.env.NODE_ENV === "production"
        ? `https://cozycrochet.netlify.app/activation/${activationToken}`
        : `http://localhost:3000/activation/${activationToken}`;

    try {
      await sendMail({
        email: user.email,
        subject: "Activation Link",
        message: `Hello ${user.name}, Please click on the link to activate your account. ${activationUrl}`,
      });

      res.status(201).json({
        success: true,
        message: `please check your mail ${user.email} for activation`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
  // res.status(201).json({ success: true, newUser });
});

//activationTojen

const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET_KEY, {
    expiresIn: "5m",
  });
};

//user activate

router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET_KEY
      );

      if (!newUser) {
        return next(new ErrorHandler("Invalid token", 400));
      }

      const { name, email, password, avatar } = newUser;

      let user = await User.findOne({ email });

      if (user) {
        return next(new ErrorHandler("User already exists", 400));
      }

      user = await User.create({
        name,
        email,
        password,
        avatar,
      });

      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//login user

router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
      }

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("No user found", 400));
      }

      const isPasswordMatched = await user.comparePassword(password);

      if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//user load

router.get(
  "/getuser",
  isAuthenticatedUser,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }

      res.status(200).json({
        success: true,
        user,
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
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "None", // Match the setting options
        secure: true,
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

//user update

router.put(
  "/update-user",
  isAuthenticatedUser,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { name, email, password, phoneNumber } = req.body;

      // Validate inputs
      if (!email || !password) {
        return next(new ErrorHandler("Email and password are required", 400));
      }

      // Find user by email - fixed syntax
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }

      const isPasswordMatched = await user.comparePassword(password);

      if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid password", 400));
      }

      // Update user fields
      user.name = name;
      user.email = email;
      if (phoneNumber !== undefined) {
        user.phoneNumber = phoneNumber;
      }

      await user.save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.error("Update user error:", error);
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//update avatar
router.put(
  "/update-avatar",
  isAuthenticatedUser,
  upload.single("image"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      // Check if file was uploaded
      if (!req.file) {
        return next(new ErrorHandler("No image file provided", 400));
      }

      const userExist = await User.findById(req.user.id);

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

      const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          avatar: {
            url: fileUrl,
            public_id: req.file.filename,
          },
        },
        { new: true }
      );

      console.log("User updated successfully:", user);

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

//update address
router.put(
  "/update-address",
  isAuthenticatedUser,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      const sameAddress = user.addresses.find(
        (address) => address.addressType === req.body.addressType
      );

      if (sameAddress) {
        return next(new ErrorHandler(`${req.body.addressType} already exists`));
      }

      const addressExist = user.addresses.find(
        (address) => address._id === req.body._id
      );

      if (addressExist) {
        Object.assign(addressExist, req.body);
      } else {
        user.addresses.push(req.body);
      }

      await user.save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//delete address
router.delete(
  "/delete-address/:addressId",
  isAuthenticatedUser,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const userId = req.user._id;
      const addressId = req.params.addressId; // Changed from req.params._id to req.params.addressId

      const result = await User.updateOne(
        { _id: userId },
        { $pull: { addresses: { _id: addressId } } }
      );

      const user = await User.findById(userId);

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.error("Delete address error:", error);
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//password update

router.put(
  "/update-password",
  isAuthenticatedUser,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select("+password");

      const isPasswordMatched = await user.comparePassword(
        req.body.oldPassword
      );

      if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password incorrect", 400));
      }

      if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("New passwords do not match", 400));
      }

      user.password = req.body.newPassword;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Request password reset
router.post(
  "/forgot-password",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email } = req.body;

      if (!email) {
        return next(new ErrorHandler("Please provide an email", 400));
      }

      const user = await User.findOne({ email });

      if (!user) {
        return next(new ErrorHandler("User not found with this email", 404));
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(20).toString("hex");

      // Hash and add to user document
      user.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      // Token valid for 15 minutes
      user.resetPasswordTime = Date.now() + 15 * 60 * 1000;

      await user.save({ validateBeforeSave: false });

      // Create reset URL
      // const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
      const resetUrl =
        process.env.NODE_ENV === "production"
          ? `https://cozycrochet.netlify.app/reset-password/${resetToken}`
          : `http://localhost:3000/reset-password/${resetToken}`;

      // Email message
      const message = `
        Hello ${user.name},

        You requested a password reset. Please use the link below to reset your password:

        ${resetUrl}

        If you didn't request this, please ignore this email.

        This link is valid for 15 minutes.
      `;

      try {
        await sendMail({
          email: user.email,
          subject: "cozyCrochet Password Reset",
          message,
        });

        res.status(200).json({
          success: true,
          message: `Reset password email sent to ${user.email}`,
        });
      } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordTime = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Reset password
router.post(
  "/reset-password/:token",
  catchAsyncErrors(async (req, res, next) => {
    try {
      // Hash the token from URL
      const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

      // Find user with this token and valid expiry time
      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordTime: { $gt: Date.now() },
      });

      if (!user) {
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
      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordTime = undefined;

      await user.save();

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
