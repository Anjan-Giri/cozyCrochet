// const mongoose = require("mongoose");

// const codeSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, "Please enter your coupoun code name"],
//     unique: true,
//   },
//   value: {
//     type: Number,
//     required: true,
//   },
//   minAmount: {
//     type: Number,
//   },
//   maxAmount: {
//     type: Number,
//   },
//   shop: {
//     type: Object,
//     required: true,
//   },
//   selectedProducts: {
//     type: String,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now(),
//   },
// });

// module.exports = mongoose.model("code", codeSchema);

const mongoose = require("mongoose");

const codeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your coupon code name"],
    unique: true,
  },
  value: {
    type: Number,
    required: [true, "Please enter discount value"],
    min: [0, "Discount cannot be negative"],
    max: [100, "Discount cannot exceed 100%"],
  },
  minAmount: {
    type: Number,
    default: 0,
    min: [0, "Minimum amount cannot be negative"],
  },
  maxAmount: {
    type: Number,
    default: 0,
    min: [0, "Maximum amount cannot be negative"],
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
  selectedProducts: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add index for better query performance
codeSchema.index({ shop: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Code", codeSchema);
