const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
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
    firstname: { type: String, required: true },
    phone: { type: String, required: true },
    quarter: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    // ✅ propriétaire de la commande
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    guestId: { type: String, required: false },

    // ✅ items de la commande
    orderItems: [orderItemSchema],

    // ✅ adresse de livraison
    shippingAddress: shippingAddressSchema,

    // ✅ infos paiement
    paymentMethod: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    paymentStatus: { type: String, default: "pending" },
    paymentDetails: { type: Object },

    // ✅ suivi
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    finalizedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
