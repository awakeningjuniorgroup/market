const mongoose = require("mongoose");

const checkoutItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
  },
  { _id: false }
);

const checkoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ✅ corriger la casse
      required: false, // ✅ rendre optionnel pour les invités
    },
    guestId: {
      type: String, // ✅ identifiant invité
      required: false,
    },
    checkoutItems: [checkoutItemSchema],

    shippingAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      quarter: { type: String },
      city: { type: String, required: true },
      region: { type: String },
      postalCode: { type: String },
      country: { type: String, required: true },
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "PayPal", "OrangeMoney"], // ✅ modes de paiement
      required: true,
    },

    totalPrice: { type: Number, required: true },

    // Statut paiement
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    paymentStatus: { type: String, default: "pending" },
    paymentDetails: { type: mongoose.Schema.Types.Mixed },

    // Statut commande
    isFinalized: { type: Boolean, default: false },
    finalizedAt: { type: Date },

    // ✅ Facture
    invoiceNumber: { type: String, unique: true },
    invoiceDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Checkout", checkoutSchema);
