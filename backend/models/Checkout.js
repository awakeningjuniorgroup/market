const mongoose = require("mongoose");

const checkoutItemSchema = new mongoose.Schema(
  {
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
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    guestId: { type: String, required: false },

    checkoutItems: [checkoutItemSchema],

    shippingAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      quarter: { type: String, required: true },
      city: { type: String, required: true },
      region: { type: String, required: true },
      country: { type: String, required: true },
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "PayPal", "OrangeMoney", "pending"], // ✅ ajout "pending"
      required: true,
    },

    totalPrice: { type: Number, required: true },

    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    paymentStatus: { type: String, default: "pending" },
    paymentDetails: { type: mongoose.Schema.Types.Mixed },

    isFinalized: { type: Boolean, default: false },
    finalizedAt: { type: Date },

    invoiceNumber: { type: String, unique: true },
    invoiceDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ✅ Génération automatique d’un numéro de facture unique
checkoutSchema.pre("save", function (next) {
  if (!this.invoiceNumber) {
    this.invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

module.exports = mongoose.model("Checkout", checkoutSchema);
