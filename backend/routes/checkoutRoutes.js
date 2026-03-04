const express = require("express");
const Checkout = require("../models/Checkout");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Créer une commande (checkout)
router.post("/", protect, async (req, res) => {
  try {
    console.log("📦 [create-checkout] Payload reçu:", req.body);

    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (!checkoutItems || checkoutItems.length === 0) {
      return res.status(400).json({ message: "No items in checkout" });
    }

    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    console.log("✅ [create-checkout] Commande créée:", newCheckout._id);
    res.status(201).json(newCheckout);
  } catch (error) {
    console.error("❌ Erreur POST /api/checkout:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Récupérer les commandes de l'utilisateur
router.get("/my-checkouts", protect, async (req, res) => {
  try {
    const checkouts = await Checkout.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(checkouts);
  } catch (error) {
    console.error("❌ Erreur GET /api/checkout/my-checkouts:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Récupérer une commande par ID
router.get("/:id", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id).populate("user", "name email");

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (checkout.user && checkout.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this checkout" });
    }

    res.json(checkout);
  } catch (error) {
    console.error("❌ Erreur GET /api/checkout/:id:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
