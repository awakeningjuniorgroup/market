const express = require("express");
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @route POST /api/checkout
 * @desc Create a new checkout session (user logged in)
 * @access Private
 */
router.post("/", protect, async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "No items in checkout" });
  }

  try {
    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: "pending",
      isPaid: false,
      isFinalized: false,
    });

    // ✅ Ajout du champ owner
    const response = {
      ...newCheckout.toObject(),
      owner: { type: "user", id: req.user._id }
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("❌ Error creating checkout session:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/**
 * @route POST /api/checkout/guest
 * @desc Create a new checkout session (guest user)
 * @access Public
 */
router.post("/guest", async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "No items in checkout" });
  }

  try {
    const guestId = `GUEST-${Date.now()}`;
    const newCheckout = await Checkout.create({
      user: null,
      guestId,
      checkoutItems,
      shippingAddress,
      paymentMethod: paymentMethod || "COD",
      totalPrice,
      paymentStatus: "pending",
      isPaid: false,
      isFinalized: false,
    });

    // ✅ Ajout du champ owner
    const response = {
      ...newCheckout.toObject(),
      owner: { type: "guest", id: guestId }
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("❌ Error creating guest checkout session:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});



/**
 * @route PUT /api/checkout/:id
 * @desc Mark checkout by id
 * @access Public
 */
router.get("/:id", async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    res.json(checkout);
  } catch (error) {
    console.error("Erreur fetchCheckoutById:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});



/**
 * @route PUT /api/checkout/:id/pay
 * @desc Mark checkout as paid
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

      const response = {
        ...checkout.toObject(),
        owner: checkout.user
          ? { type: "user", id: checkout.user }
          : { type: "guest", id: checkout.guestId }
      };

      res.status(200).json(response);
    } else {
      res.status(400).json({ message: "Invalid Payment Status" });
    }
  } catch (error) {
    console.error("❌ Error updating payment:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});
/**
 * @route GET /api/checkout/my-checkouts
 * @desc Récupérer tous les checkouts de l’utilisateur connecté
 * @access Private
 */
router.get("/my-checkouts", protect, async (req, res) => {
  try {
    console.log("📦 [my-checkouts] User ID:", req.user._id);

    const checkouts = await Checkout.find({ user: req.user._id }).sort({ createdAt: -1 });
    console.log("✅ [my-checkouts] Checkouts trouvés:", checkouts.length);

    res.json(checkouts);
  } catch (error) {
    console.error("❌ Erreur GET /api/checkout/my-checkouts:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});



/**
 * @route POST /api/checkout/:id/finalize
 * @desc Transformer un checkout en order
 */
router.post("/:id/finalize", async (req, res) => {
  console.log("📩 [finalize] ID reçu:", req.params.id);

  try {
    const checkout = await Checkout.findById(req.params.id);
    console.log("🔍 [finalize] Checkout trouvé:", checkout);

    if (!checkout) {
      console.warn("⚠️ [finalize] Checkout introuvable pour ID:", req.params.id);
      return res.status(404).json({ message: "Checkout not found" });
    }

    // Création de l'Order
    const orderData = {
      user: checkout.user || null,
      guestId: checkout.guestId || null,
      orderItems: checkout.checkoutItems, // ⚠️ attention au nom du champ
      shippingAddress: checkout.shippingAddress,
      paymentMethod: checkout.paymentMethod,
      totalPrice: checkout.totalPrice,
      paymentStatus: checkout.paymentStatus,
      isPaid: checkout.isPaid,
      paidAt: checkout.paidAt,
    };

    console.log("🛠 [finalize] Données préparées pour Order:", orderData);

    const order = new Order(orderData);
    console.log("🛠 [finalize] Instance Order créée:", order);

    const savedOrder = await order.save();
    console.log("✅ [finalize] Order sauvegardé:", savedOrder);

    // Mise à jour du checkout
    checkout.isFinalized = true;
    checkout.finalizedAt = Date.now();
    await checkout.save();
    console.log("📦 [finalize] Checkout mis à jour:", checkout);

    res.status(201).json({
      message: "Checkout transformé en Order",
      order: savedOrder,
    });
  } catch (error) {
    console.error("❌ [finalize] Erreur:", error.message, error.stack);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;


