const express = require("express");
const Order = require("../models/Order");
const Checkout = require("../models/Checkout");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Transformer un checkout en order
router.post("/:checkoutId/finalize", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.checkoutId);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems: checkout.checkoutItems,
      shippingAddress: checkout.shippingAddress,
      paymentMethod: checkout.paymentMethod,
      totalPrice: checkout.totalPrice,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("❌ Erreur finalize checkout:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Récupérer les commandes de l'utilisateur
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("❌ Erreur GET /api/orders/my-orders:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Récupérer une commande par ID
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (error) {
    console.error("❌ Erreur GET /api/orders/:id:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
