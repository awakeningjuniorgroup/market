const express = require("express");
const Order = require("../models/Order"); // ⚠️ il manquait l'import du modèle
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// @route GET /api/orders/my-orders
// @desc Get logged-in user's orders
// @access Private
router.get("/my-orders", protect, async (req, res) => {
  try {
    // Récupérer les commandes de l'utilisateur authentifié
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    }); // tri par date décroissante

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

    // Vérifier que l'utilisateur connecté est bien propriétaire de la commande
    if (order.user && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (error) {
    console.error("Erreur GET /api/orders/:id:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
