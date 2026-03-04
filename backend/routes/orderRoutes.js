const express = require("express");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @route GET /api/orders/my-orders
 * @desc Récupérer les commandes de l'utilisateur connecté
 * @access Private
 */
router.get("/my-orders", protect, async (req, res) => {
  try {
    console.log("📦 [my-orders] Requête reçue pour user:", req.user._id);

    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    console.log("📦 [my-orders] Résultat MongoDB:", orders);
    res.json(orders);
  } catch (error) {
    console.error("❌ Erreur GET /api/orders/my-orders:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/**
 * @route GET /api/orders/:id
 * @desc Récupérer les détails d'une commande par ID
 * @access Private
 */
router.get("/:id", protect, async (req, res) => {
  try {
    console.log("📦 [order-details] Requête reçue pour ID:", req.params.id);

    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    console.log("📦 [order-details] Commande trouvée:", order._id);
    res.json(order);
  } catch (error) {
    console.error("❌ Erreur GET /api/orders/:id:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/**
 * @route POST /api/orders
 * @desc Créer une nouvelle commande
 * @access Private
 */
router.post("/", protect, async (req, res) => {
  try {
    console.log("📦 [create-order] Payload reçu:", req.body);

    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const newOrder = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      isPaid: false,
      isDelivered: false,
    });

    console.log("✅ [create-order] Commande créée:", newOrder._id);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("❌ Erreur POST /api/orders:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
