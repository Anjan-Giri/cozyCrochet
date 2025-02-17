// const express = require("express");
// const catchAsyncErrors = require("../middleware/catchAsyncErrors");
// const Code = require("../model/code");
// const router = express.Router();
// const ErrorHandler = require("../utils/ErrorHandler");
// const { isSeller } = require("../middleware/auth");

// //create code

// router.post(
//   "/create-code",
//   isSeller,
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const codeExists = await code.find({ name: req.body.name });

//       if (codeExists) {
//         return next(new ErrorHandler("Code already exists", 400));
//       }

//       const code = await Code.create(req.body);

//       res.status(201).json({
//         success: true,
//         code,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error, 400));
//     }
//   })
// );

// // get all codes
// router.get(
//   "/get-code/:id",
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const codes = await Code.find({ shop: { _id: req.params.id } });

//       res.status(201).json({
//         success: true,
//         codes,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error, 400));
//     }
//   })
// );

// module.exports = router;

const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Code = require("../model/code");
const ErrorHandler = require("../utils/ErrorHandler");
const router = express.Router();
const { isSeller } = require("../middleware/auth");

// create code
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

      const codeData = {
        name: req.body.name,
        value: req.body.value,
        minAmount: req.body.minAmount || 0,
        maxAmount: req.body.maxAmount || 0,
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

// get all codes
router.get(
  "/get-code/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const codes = await Code.find({ shop: req.params.id }).sort({
        createdAt: -1,
      }); // Added sorting by creation date

      res.status(200).json({
        // Changed from 201 to 200 as it's a GET request
        success: true,
        codes,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// delete code route
router.delete(
  "/delete-code/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      // Add check to ensure seller can only delete their own codes
      const code = await Code.findOne({
        _id: req.params.id,
        shop: req.seller.id, // Assuming isSeller middleware adds seller to req
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

module.exports = router;
