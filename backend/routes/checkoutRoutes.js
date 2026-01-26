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

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "No items in checkout" });
  }

  if (!shippingAddress?.firstName || !shippingAddress?.lastName || !shippingAddress?.email || !shippingAddress?.phone || !shippingAddress?.city || !shippingAddress?.country) {
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

    res.status(201).json(newCheckout);
  } catch (error) {
    console.error("Error creating checkout session:", error.message);
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

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "No items in checkout" });
  }

  if (!shippingAddress?.firstName || !shippingAddress?.lastName || !shippingAddress?.email || !shippingAddress?.phone || !shippingAddress?.city || !shippingAddress?.country) {
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

    res.status(201).json(newCheckout);
  } catch (error) {
    console.error("Error creating guest checkout session:", error.message);
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

  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) return res.status(404).json({ message: "Checkout not found" });

    if (paymentStatus === "paid") {
      checkout.isPaid = true;
      checkout.paymentStatus = paymentStatus;
      checkout.paymentDetails = paymentDetails;
      checkout.paidAt = Date.now();
      await checkout.save();

      res.status(200).json(checkout);
    } else {
      res.status(400).json({ message: "Invalid Payment Status" });
    }
  } catch (error) {
    console.error("Error updating payment:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/**
 * @route POST /api/checkout/:id/finalize
 * @desc Finaliser un checkout et créer une commande
 * @access Public (pour autoriser les invités aussi)
 */
router.post("/:id/finalize", async (req, res) => {
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

      res.status(201).json(finalOrder);
    } else if (checkout.isFinalized) {
      res.status(400).json({ message: "Checkout already finalized" });
    } else {
      res.status(400).json({ message: "Checkout is not paid" });
    }
  } catch (error) {
    console.error("Error finalizing checkout:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
