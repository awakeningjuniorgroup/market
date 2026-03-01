const express = require("express");
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Méthodes de paiement valides
const validMethods = ["COD", "PayPal", "OrangeMoney", "pending"];

// @route POST /api/checkout
// @desc Créer un checkout (utilisateur connecté)
// @access Private
router.post("/", protect, async (req, res) => {
  const { checkoutItems, shippingAddress = {}, paymentMethod, totalPrice } = req.body;

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "No items in checkout" });
  }

  try {
    console.log("📦 Payload reçu:", req.body);
    const method = validMethods.includes(paymentMethod) ? paymentMethod : "COD";

    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems,
      shippingAddress: {
        firstName: shippingAddress.firstName || "",
        phone: shippingAddress.phone || "",
        quarter: shippingAddress.quarter || "",
        city: shippingAddress.city || "",
        country: shippingAddress.country || "",
        shippingFee: shippingAddress.shippingFee || ""
      },
      paymentMethod: method,
      totalPrice,
      paymentStatus: "pending",
      isPaid: false,
      isFinalized: false,
    });

    res.status(201).json(newCheckout);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route POST /api/checkout/guest
// @desc Créer un checkout invité
// @access Public
router.post("/guest", async (req, res) => {
  const { checkoutItems, shippingAddress = {}, paymentMethod, totalPrice } = req.body;

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "No items in checkout" });
  }

  try {
    const method = validMethods.includes(paymentMethod) ? paymentMethod : "COD";

    const newCheckout = await Checkout.create({
      user: null,
      guestId: `GUEST-${Date.now()}`,
      checkoutItems,
      shippingAddress: {
        firstName: shippingAddress.firstName || "",
        phone: shippingAddress.phone || "",
        quarter: shippingAddress.quarter || "",
        city: shippingAddress.city || "",
        country: shippingAddress.country || "",
        shippingFee: shippingAddress.shippingFee || ""
      },
      paymentMethod: method,
      totalPrice,
      paymentStatus: "pending",
      isPaid: false,
      isFinalized: false,
    });

    res.status(201).json(newCheckout);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/**
 * @route PUT /api/checkout/:id/pay
 * @desc Marquer un checkout comme payé
 * @access Private
 */
router.put("/:id/pay", protect, async (req, res) => {
  const { paymentStatus, paymentDetails } = req.body;
  console.log("💳 [PAYMENT] Payload reçu:", req.body);

  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) return res.status(404).json({ message: "Checkout not found" });

    if (paymentStatus === "paid") {
      checkout.isPaid = true;
      checkout.paymentStatus = paymentStatus;
      checkout.paymentDetails = paymentDetails;
      checkout.paidAt = Date.now();
      await checkout.save();

      console.log("✅ Checkout payé:", checkout);
      res.status(200).json(checkout);
    } else {
      res.status(400).json({ message: "Invalid Payment Status" });
    }
  } catch (error) {
    console.error("❌ Error updating payment:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/**
 * @route POST /api/checkout/:id/finalize
 * @desc Finaliser un checkout et créer une commande
 * @access Public (pour autoriser les invités aussi)
 */
router.post("/:id/finalize", async (req, res) => {
  console.log("🔒 [FINALIZE] Checkout ID:", req.params.id);

  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) return res.status(404).json({ message: "Checkout not found" });

    if (checkout.isPaid && !checkout.isFinalized) {
      const finalOrder = await Order.create({
        user: checkout.user || null,
        orderItems: checkout.checkoutItems,
        shippingAddress: checkout.shippingAddress,
        paymentMethod: checkout.paymentMethod,
        totalPrice: checkout.totalPrice,
        isPaid: true,
        paidAt: checkout.paidAt,
        isDelivered: false,
        paymentStatus: "paid",
        paymentDetails: checkout.paymentDetails,
      });

      checkout.isFinalized = true;
      checkout.finalizedAt = Date.now();
      await checkout.save();

      if (checkout.user) {
        await Cart.findOneAndDelete({ user: checkout.user });
      }

      console.log("✅ Checkout finalisé, commande créée:", finalOrder);
      res.status(201).json(finalOrder);
    } else if (checkout.isFinalized) {
      res.status(400).json({ message: "Checkout already finalized" });
    } else {
      res.status(400).json({ message: "Checkout is not paid" });
    }
  } catch (error) {
    console.error("❌ Error finalizing checkout:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});
/**
 * @route POST /api/checkout/:id/finalize
 * @desc Finaliser un checkout et créer une commande
 * @access Private (utilisateur connecté ou admin)
 */
router.post("/:id/finalize", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    // Créer un Order à partir du Checkout
    const order = new Order({
      user: checkout.user || null,
      orderItems: checkout.checkoutItems.map(item => ({
        productId: item.productId || null,
        name: item.name,
        image: item.image,
        price: item.price,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
      })),
      shippingAddress: checkout.shippingAddress,
      paymentMethod: checkout.paymentMethod,
      totalPrice: checkout.totalPrice,
      status: "Processing",
    });

    const createdOrder = await order.save();

    // Marquer le checkout comme finalisé
    checkout.isFinalized = true;
    checkout.finalizedAt = Date.now();
    await checkout.save();

    res.status(201).json({
      message: "Checkout finalized and order created",
      order: createdOrder,
    });
  } catch (error) {
    console.error("❌ Erreur finalisation checkout:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});




module.exports = router;
