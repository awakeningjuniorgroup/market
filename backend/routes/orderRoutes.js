const express = require("express");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// @route GET /api/orders/my-orders
// @desc Get logged-in user's orders
// @access Private
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Erreur GET /api/orders/my-orders:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route GET /api/orders/:id
// @desc Get order details by ID
// @access Private
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Vérifier que l'utilisateur est propriétaire de la commande
    if (order.user && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (error) {
    console.error("Erreur GET /api/orders/:id:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route POST /api/orders
// @desc Create new order
// @access Private (ou Guest si tu veux autoriser sans compte)
router.post("/", protect, async (req, res) => {
  try {
    console.log("Nouvelle commande reçue:", req.body); 
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      quarter,
      phone
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const order = new Order({
      user: req.user ? req.user._id : null, // ✅ supporte guest checkout
      orderItems,
      shippingAddress: {
        ...shippingAddress,
        phone
      },
      paymentMethod,
      totalPrice,
      quarter
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder); // ✅ renvoie la commande complète
  } catch (error) {
    console.error("Erreur POST /api/orders:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
