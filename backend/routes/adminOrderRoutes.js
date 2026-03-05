const express = require("express");
const Order = require("../models/Order");
const { protect, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @route GET /api/admin/orders
 * @desc Get all orders (users + guests)
 * @access Private/Admin
 */
router.get("/", protect, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    // ✅ formatage pour distinguer user vs guest
    const formattedOrders = orders.map(order => ({
      ...order.toObject(),
      owner: order.user
        ? { type: "user", id: order.user._id, name: order.user.name, email: order.user.email }
        : { type: "guest", id: order.guestId }
    }));

    res.json({
      orders: formattedOrders,
      totalOrders: formattedOrders.length,
      totalSales: formattedOrders.reduce((acc, order) => acc + (order.totalPrice || 0), 0),
    });
  } catch (error) {
    console.error("❌ Erreur GET /api/admin/orders:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/**
 * @route GET /api/admin/orders/:id
 * @desc Get order details by ID (admin)
 * @access Private/Admin
 */
router.get("/:id", protect, isAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      ...order.toObject(),
      owner: order.user
        ? { type: "user", id: order.user._id, name: order.user.name, email: order.user.email }
        : { type: "guest", id: order.guestId }
    });
  } catch (error) {
    console.error("❌ Erreur GET /api/admin/orders/:id:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/**
 * @route PUT /api/admin/orders/:id
 * @desc Update order status
 * @access Private/Admin
 */
router.put("/:id", protect, isAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = req.body.status || order.status;

    if (req.body.status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error("❌ Erreur PUT /api/admin/orders/:id:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/**
 * @route DELETE /api/admin/orders/:id
 * @desc Delete an order
 * @access Private/Admin
 */
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.deleteOne();
    res.json({ message: "Order deleted successfully", id: req.params.id });
  } catch (error) {
    console.error("❌ Erreur DELETE /api/admin/orders/:id:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/**
 * @route POST /api/orders
 * @desc Create a new order (user or guest)
 * @access Public (guest) / Private (user)
 */
router.post("/", async (req, res) => {
  console.log("📦 [createOrder] Body reçu:", req.body);

  try {
    const order = new Order({
      user: req.user?._id || null, // si utilisateur connecté
      guestId: !req.user ? req.body.guestId : null, // si invité
      orderItems: req.body.orderItems,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      totalPrice: req.body.totalPrice,
    });

    const savedOrder = await order.save();
    console.log("✅ [createOrder] Order sauvegardé:", savedOrder);

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("❌ [createOrder] Erreur:", error.message);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
