const express = require("express");
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Méthodes de paiement valides
const validMethods = ["COD", "PayPal", "OrangeMoney", "pending"];

/**
 * @route POST /api/checkout
 * @desc Créer un checkout (utilisateur connecté)
 * @access Private
 */
router.post("/", protect, async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;

  console.log("📦 [CHECKOUT USER] Payload reçu:", req.body);

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "No items in checkout" });
  }

  if (!shippingAddress?.firstName || !shippingAddress?.phone || !shippingAddress?.city || !shippingAddress?.country || !shippingAddress?.quarter) {
    return res.status(400).json({ message: "Missing required shipping fields" });
  }

  try {
    const method = validMethods.includes(paymentMethod) ? paymentMethod : "COD";

    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems,
      shippingAddress,
      paymentMethod: method,
      totalPrice,
      paymentStatus: "pending",
      isPaid: false,
      isFinalized: false,
    });

    console.log("✅ Checkout utilisateur créé:", newCheckout);
    res.status(201).json(newCheckout);
  } catch (error) {
    console.error("❌ Error creating checkout session:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/**
 * @route POST /api/checkout/guest
 * @desc Créer un checkout invité
 * @access Public
 */
router.post("/guest", async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;

  console.log("📦 [CHECKOUT GUEST] Payload reçu:", req.body);

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "No items in checkout" });
  }

  if (!shippingAddress?.firstName ||  !shippingAddress?.phone || !shippingAddress?.city || !shippingAddress?.country || !shippingAddress?.quarter) {
    return res.status(400).json({ message: "Missing required shipping fields" });
  }

  try {
    const method = validMethods.includes(paymentMethod) ? paymentMethod : "COD";

    const newCheckout = await Checkout.create({
      user: null,
      guestId: `GUEST-${Date.now()}`,
      checkoutItems,
      shippingAddress,
      paymentMethod: method,
      totalPrice,
      paymentStatus: "pending",
      isPaid: false,
      isFinalized: false,
    });

    console.log("✅ Checkout invité créé:", newCheckout);
    res.status(201).json(newCheckout);
  } catch (error) {
    console.error("❌ Error creating guest checkout session:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/**
 * @route PUT /api/checkout/:id/pay
 * @desc Marquer un checkout comme payé
 * @access Private
 */
router.put("/:id/pay", protect, async (req, res) => {
  const { paymentStatus, paymentDetails } = req.body;
  console.log("💳 [PAYMENT] Payload reçu:", req.body);

  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) return res.status(404).json({ message: "Checkout not found" });

    if (paymentStatus === "paid") {
      checkout.isPaid = true;
      checkout.paymentStatus = paymentStatus;
      checkout.paymentDetails = paymentDetails;
      checkout.paidAt = Date.now();
      await checkout.save();

      console.log("✅ Checkout payé:", checkout);
      res.status(200).json(checkout);
    } else {
      res.status(400).json({ message: "Invalid Payment Status" });
    }
  } catch (error) {
    console.error("❌ Error updating payment:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/**
 * @route POST /api/checkout/:id/finalize
 * @desc Finaliser un checkout et créer une commande
 * @access Public (pour autoriser les invités aussi)
 */
router.post("/:id/finalize", async (req, res) => {
  console.log("🔒 [FINALIZE] Checkout ID:", req.params.id);

  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) return res.status(404).json({ message: "Checkout not found" });

    if (checkout.isPaid && !checkout.isFinalized) {
      const finalOrder = await Order.create({
        user: checkout.user || null,
        orderItems: checkout.checkoutItems,
        shippingAddress: checkout.shippingAddress,
        paymentMethod: checkout.paymentMethod,
        totalPrice: checkout.totalPrice,
        isPaid: true,
        paidAt: checkout.paidAt,
        isDelivered: false,
        paymentStatus: "paid",
        paymentDetails: checkout.paymentDetails,
      });

      checkout.isFinalized = true;
      checkout.finalizedAt = Date.now();
      await checkout.save();

      if (checkout.user) {
        await Cart.findOneAndDelete({ user: checkout.user });
      }

      console.log("✅ Checkout finalisé, commande créée:", finalOrder);
      res.status(201).json(finalOrder);
    } else if (checkout.isFinalized) {
      res.status(400).json({ message: "Checkout already finalized" });
    } else {
      res.status(400).json({ message: "Checkout is not paid" });
    }
  } catch (error) {
    console.error("❌ Error finalizing checkout:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
