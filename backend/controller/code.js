const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Code = require("../model/code");
const ErrorHandler = require("../utils/ErrorHandler");
const router = express.Router();
const { isSeller } = require("../middleware/auth");

//create code
router.post(
  "/create-code",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const codeExists = await Code.findOne({
        name: req.body.name,
        shop: req.body.shopId,
      });

      if (codeExists) {
        return next(new ErrorHandler("Code already exists for this shop", 400));
      }

      const minAmount = parseFloat(req.body.minAmount) || 0;
      const maxAmount = parseFloat(req.body.maxAmount) || 0;

      if (minAmount < 0) {
        return next(new ErrorHandler("Minimum amount cannot be negative", 400));
      }

      if (maxAmount < 0) {
        return next(
          new ErrorHandler("Maximum discount cannot be negative", 400)
        );
      }

      const codeData = {
        name: req.body.name,
        value: req.body.value,
        minAmount: minAmount,
        maxAmount: maxAmount,
        shop: req.body.shopId,
        selectedProducts: req.body.selectedProducts || null,
      };

      const code = await Code.create(codeData);

      res.status(201).json({
        success: true,
        code,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

//get all codes
router.get(
  "/get-code/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const codes = await Code.find({ shop: req.params.id }).sort({
        createdAt: -1,
      }); //sorting by creation date

      res.status(200).json({
        success: true,
        codes,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

//delete code route
router.delete(
  "/delete-code/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const code = await Code.findOne({
        _id: req.params.id,
        shop: req.seller.id,
      });

      if (!code) {
        return next(new ErrorHandler("Code not found or unauthorized", 404));
      }

      await Code.deleteOne({ _id: req.params.id });

      res.status(200).json({
        success: true,
        message: "Code deleted successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

//get code value by its name
router.get(
  "/get-code-value/:name",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const code = await Code.findOne({ name: req.params.name });

      res.status(200).json({
        success: true,
        code,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);
module.exports = router;
