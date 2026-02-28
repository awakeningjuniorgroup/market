const express = require("express");
const Order = require("../models/Order");
const { protect, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// @route GET /api/admin/orders
// @desc Get all orders (only admin)
// @access Private/Admin
router.get("/", protect, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      orders,
      totalOrders: orders.length,
      totalSales: orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0),
    });
  } catch (error) {
    console.error("Erreur GET /api/admin/orders:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route PUT /api/admin/orders/:id
// @desc Update order status
// @access Private/Admin
router.put("/:id", protect, isAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (order) {
      order.status = req.body.status || order.status;

      if (req.body.status === "Delivered") {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }

      const updatedOrder = await order.save();
      res.json({ message: "Order updated successfully", order: updatedOrder });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error("Erreur PUT /api/admin/orders/:id:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route DELETE /api/admin/orders/:id
// @desc Delete an order
// @access Private/Admin
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.deleteOne();
      res.json({ message: "Order deleted successfully" });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error("Erreur DELETE /api/admin/orders/:id:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
