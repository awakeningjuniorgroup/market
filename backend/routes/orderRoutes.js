const express = require("express");
const Order = require("../models/Order");
const { protect, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();
// @route GET /api/orders
// @desc Get all orders (admin only)
// @access Private/Admin
router.get("/", protect, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/**
 * @route POST /api/orders
 * @desc Create a new order (user or guest)
 * @access Public (si guest) / Private (si user connecté)
 */
router.post("/", async (req, res) => {
  console.log("📦 [createOrder] Body reçu:", req.body);

  try {
    const order = new Order({
      // ✅ si utilisateur connecté, req.user est défini par protect
      user: req.user?._id || null,

      // ✅ si invité, on stocke guestId envoyé par le frontend
      guestId: !req.user ? req.body.guestId : null,

      orderItems: req.body.orderItems,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      totalPrice: req.body.totalPrice,
    });

    console.log("🛠 [createOrder] Order avant save:", order);

    const savedOrder = await order.save();
    console.log("✅ [createOrder] Order sauvegardé:", savedOrder);

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("❌ [createOrder] Erreur:", error.message);
    res.status(400).json({ message: error.message });
  }
});

/**
 * @route GET /api/orders/my-orders
 * @desc Get logged-in user's orders
 * @access Private
 */
router.get("/my-orders", protect, async (req, res) => {
  try {
    console.log("📦 [my-orders] User ID:", req.user._id);

    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    console.log("✅ [my-orders] Orders trouvées:", orders.length);

    res.json(orders);
  } catch (error) {
    console.error("❌ Erreur GET /api/orders/my-orders:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/**
 * @route GET /api/orders/:id
 * @desc Get order details by ID
 * @access Private (user) / Admin (via admin routes)
 */
router.get("/:id", protect, async (req, res) => {
  try {
    console.log("📦 [orderDetails] ID reçu:", req.params.id);

    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
      console.warn("⚠️ [orderDetails] Order introuvable pour ID:", req.params.id);
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ Vérifie que l’utilisateur connecté est bien propriétaire
    if (order.user && order.user._id.toString() !== req.user._id.toString()) {
      console.warn("⚠️ [orderDetails] User non autorisé:", req.user._id);
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    console.log("✅ [orderDetails] Order trouvé:", order._id);
    res.json(order);
  } catch (error) {
    console.error("❌ Erreur GET /api/orders/:id:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
