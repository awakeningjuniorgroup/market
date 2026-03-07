const mongoose = require("mongoose");

const checkoutItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    size: { type: String },
    color: { type: String },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    phone: { type: String, required: true },
    quarter: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
     shippingFee: { type: Number, default: 0 }, 
  },
  { _id: false }
);

const checkoutSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    guestId: { type: String, required: false },
    checkoutItems: [checkoutItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentMethod: {
      type: String,
      enum: ["COD", "PayPal", "OrangeMoney"],
      default: "COD",
    },
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Checkout", checkoutSchema);
