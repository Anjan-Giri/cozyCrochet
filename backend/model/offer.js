const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter offer product name"],
  },
  description: {
    type: String,
    required: [true, "Please enter offer product description"],
  },
  category: {
    type: String,
    required: [true, "Please enter offer product category"],
  },
  startDate: {
    type: Date,
    required: [true, "Please enter offer start date"],
  },
  endDate: {
    type: Date,
    required: [true, "Please enter offer end date"],
  },
  status: {
    type: String,
    default: "active",
  },
  tags: {
    type: String,
  },
  originalPrice: {
    type: Number,
  },
  discountPrice: {
    type: Number,
    required: [true, "Please enter offer product price"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter offer product stock"],
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  shopId: {
    type: String,
    required: true,
  },
  shop: {
    type: Object,
    required: true,
  },
  sold_out: {
    type: Number,
    default: 0,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Offer", offerSchema);
