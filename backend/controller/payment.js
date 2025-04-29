const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const stripe = require("stripe");

router.post(
  "/process",
  catchAsyncErrors(async (req, res, next) => {
    const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

    const myPayment = await stripeClient.paymentIntents.create({
      amount: req.body.amount,
      currency: "USD",
      metadata: {
        company: "cozyCrochet",
      },
    });
    res.status(200).json({
      success: true,
      client_secret: myPayment.client_secret,
    });
  })
);

router.get(
  "/stripeapikey",
  catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({ stripeApikey: process.env.STRIPE_API_KEY });
  })
);

module.exports = router;
