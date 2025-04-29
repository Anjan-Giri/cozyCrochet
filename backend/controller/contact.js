const express = require("express");
const router = express.Router();
const Shop = require("../model/shop.js");
const Admin = require("../model/admin.js");
const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticatedUser } = require("../middleware/auth.js");
const sendMail = require("../utils/mail.js");
const axios = require("axios");

const verifyCaptcha = async (token) => {
  if (!token) return false;

  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;

    //reCAPTCHA verification
    const response = await axios.post(verifyUrl, null, {
      params: {
        secret: secretKey,
        response: token,
      },
    });

    return response.data.success;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
};

//get all shops for the contact form dropdown
router.get(
  "/get-shops-for-contact",
  catchAsyncErrors(async (req, res, next) => {
    try {
      //getting all shops
      const shops = await Shop.find().select("name _id");

      res.status(200).json({
        success: true,
        shops,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//submit contact form to a shop
router.post(
  "/contact-shop",
  isAuthenticatedUser,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { shopId, subject, message, orderDetails } = req.body;

      if (!shopId || !subject || !message) {
        return next(
          new ErrorHandler("Please provide shop, subject and message", 400)
        );
      }

      const shop = await Shop.findById(shopId);

      if (!shop) {
        return next(new ErrorHandler("Shop not found", 404));
      }

      let orderDetailsText = "";
      if (orderDetails) {
        orderDetailsText = `
          
          Custom Order Details:
          ${orderDetails}
        `;
      }

      const messageToShop = `
        A customer has contacted you via the cozyCrochet marketplace:
        
        From: ${req.user.name} (${req.user.email})
        Subject: ${subject}
        
        Message:
        ${message}
        ${orderDetailsText}
        
        ---
        You can reply directly to the customer by responding to this email.
      `;

      await sendMail({
        email: shop.email,
        subject: `[cozyCrochet] Custom Order Request: ${subject}`,
        message: messageToShop,
        replyTo: req.user.email,
      });

      const confirmationToUser = `
        Your message has been sent to ${shop.name}!
        
        We've forwarded your custom order request to the shop owner. They will review your request and respond to you directly at ${req.user.email}.
        
        For your records, here's a copy of your message:
        
        Subject: ${subject}
        
        Message:
        ${message}
        ${orderDetailsText}
        
        Thank you for using cozyCrochet marketplace!
      `;

      await sendMail({
        email: req.user.email,
        subject: `[cozyCrochet] Your message to ${shop.name} has been sent`,
        message: confirmationToUser,
      });

      res.status(200).json({
        success: true,
        message: `Your message has been sent to ${shop.name}. A confirmation has been sent to your email.`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//public contact form (no login)
router.post(
  "/contact-shop-public",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { shopId, name, email, subject, message, orderDetails } = req.body;

      if (!shopId || !name || !email || !subject || !message) {
        return next(
          new ErrorHandler(
            "Please provide shop, name, email, subject and message",
            400
          )
        );
      }

      const { captchaToken } = req.body;
      //verify captcha for non-authenticated users
      const isCaptchaValid = await verifyCaptcha(captchaToken);
      if (!isCaptchaValid) {
        return next(
          new ErrorHandler(
            "CAPTCHA verification failed. Please try again.",
            400
          )
        );
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return next(new ErrorHandler("Please provide a valid email", 400));
      }

      const shop = await Shop.findById(shopId);

      if (!shop) {
        return next(new ErrorHandler("Shop not found", 404));
      }

      let orderDetailsText = "";
      if (orderDetails) {
        orderDetailsText = `
          
          Custom Order Details:
          ${orderDetails}
        `;
      }

      const messageToShop = `
        A visitor has contacted you via the cozyCrochet marketplace:
        
        From: ${name} (${email})
        Subject: ${subject}
        
        Message:
        ${message}
        ${orderDetailsText}
        
        ---
        You can reply directly to the customer by responding to this email.
      `;

      await sendMail({
        email: shop.email,
        subject: `[cozyCrochet] Contact Request: ${subject}`,
        message: messageToShop,
        replyTo: email,
      });

      const confirmationToUser = `
        Your message has been sent to ${shop.name}!
        
        We've forwarded your request to the shop owner. They will review your message and respond to you directly at ${email}.
        
        For your records, here's a copy of your message:
        
        Subject: ${subject}
        
        Message:
        ${message}
        ${orderDetailsText}
        
        Thank you for using cozyCrochet marketplace!
      `;

      await sendMail({
        email: email,
        subject: `[cozyCrochet] Your message to ${shop.name} has been sent`,
        message: confirmationToUser,
      });

      res.status(200).json({
        success: true,
        message: `Your message has been sent to ${shop.name}. A confirmation has been sent to your email.`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//get specific shop contact information
router.get(
  "/shop-contact-info/:shopId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shop = await Shop.findById(req.params.shopId).select(
        "name description phoneNumber"
      );

      if (!shop) {
        return next(new ErrorHandler("Shop not found", 404));
      }

      res.status(200).json({
        success: true,
        shopInfo: shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//get admin contact information
router.get(
  "/admin-contact-info",
  catchAsyncErrors(async (req, res, next) => {
    try {
      //get admin
      const admin = await Admin.findOne().select("name email");

      if (!admin) {
        return next(new ErrorHandler("Admin information not found", 404));
      }

      res.status(200).json({
        success: true,
        adminInfo: admin,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//submit contact form to admin (authenticated users)
router.post(
  "/contact-admin",
  isAuthenticatedUser,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { subject, message, category } = req.body;

      if (!subject || !message) {
        return next(
          new ErrorHandler("Please provide subject and message", 400)
        );
      }

      const admin = await Admin.findOne();

      if (!admin) {
        return next(new ErrorHandler("Admin not found", 404));
      }

      let categoryText = "";
      if (category) {
        categoryText = `Category: ${category}`;
      }

      const messageToAdmin = `
        A user has submitted a contact form through the cozyCrochet marketplace:
        
        From: ${req.user.name} (${req.user.email})
        ${categoryText}
        Subject: ${subject}
        
        Message:
        ${message}
        
        ---
        You can reply directly to the user by responding to this email.
      `;

      await sendMail({
        email: admin.email,
        subject: `[cozyCrochet] Contact Form: ${subject}`,
        message: messageToAdmin,
        replyTo: req.user.email,
      });

      const confirmationToUser = `
        Your message has been sent to the cozyCrochet Admin Team!
        
        We've received your message and will respond to you as soon as possible at ${
          req.user.email
        }.
        
        For your records, here's a copy of your message:
        
        ${categoryText ? categoryText + "\n" : ""}
        Subject: ${subject}
        
        Message:
        ${message}
        
        Thank you for using cozyCrochet marketplace!
      `;

      await sendMail({
        email: req.user.email,
        subject: `[cozyCrochet] Your message to Admin has been sent`,
        message: confirmationToUser,
      });

      res.status(200).json({
        success: true,
        message:
          "Your message has been sent to the Admin. A confirmation has been sent to your email.",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//public contact form for admin (no login)
router.post(
  "/contact-admin-public",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { name, email, subject, message, category } = req.body;

      if (!name || !email || !subject || !message) {
        return next(
          new ErrorHandler(
            "Please provide name, email, subject and message",
            400
          )
        );
      }

      const { captchaToken } = req.body;
      //verify captcha
      const isCaptchaValid = await verifyCaptcha(captchaToken);
      if (!isCaptchaValid) {
        return next(
          new ErrorHandler(
            "CAPTCHA verification failed. Please try again.",
            400
          )
        );
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return next(new ErrorHandler("Please provide a valid email", 400));
      }

      const admin = await Admin.findOne();

      if (!admin) {
        return next(new ErrorHandler("Admin not found", 404));
      }

      let categoryText = "";
      if (category) {
        categoryText = `Category: ${category}`;
      }

      const messageToAdmin = `
        A visitor has submitted a contact form through the cozyCrochet marketplace:
        
        From: ${name} (${email})
        ${categoryText}
        Subject: ${subject}
        
        Message:
        ${message}
        
        ---
        You can reply directly to the sender by responding to this email.
      `;

      await sendMail({
        email: admin.email,
        subject: `[cozyCrochet] Contact Form: ${subject}`,
        message: messageToAdmin,
        replyTo: email,
      });

      const confirmationToUser = `
        Your message has been sent to the cozyCrochet Admin Team!
        
        We've received your message and will respond to you as soon as possible at ${email}.
        
        For your records, here's a copy of your message:
        
        ${categoryText ? categoryText + "\n" : ""}
        Subject: ${subject}
        
        Message:
        ${message}
        
        Thank you for using cozyCrochet marketplace!
      `;

      await sendMail({
        email: email,
        subject: `[cozyCrochet] Your message to Admin has been sent`,
        message: confirmationToUser,
      });

      res.status(200).json({
        success: true,
        message:
          "Your message has been sent to the Admin. A confirmation has been sent to your email.",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
