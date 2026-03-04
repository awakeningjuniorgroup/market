const express = require("express");
const Checkout = require("../models/Checkout");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Créer un checkout
router.post("/", protect, async (req, res) => {
  try {
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

    res.status(201).json(newCheckout);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Récupérer les checkouts de l'utilisateur
router.get("/my-checkouts", protect, async (req, res) => {
  try {
    const checkouts = await Checkout.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(checkouts);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Récupérer un checkout par ID
router.get("/:id", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id).populate("user", "name email");

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    res.json(checkout);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
