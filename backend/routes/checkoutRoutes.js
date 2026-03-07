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
 * @route POST /api/checkout/:id/finalize
 * @desc Finalize checkout and create order
 * 
**/
router.post("/:id/finalize", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (checkout.isFinalized) {
      return res.status(400).json({ message: "Checkout already finalized" });
    }

    // Créer une commande à partir du checkout
    const order = await Order.create({
      user: checkout.user,
      orderItems: checkout.checkoutItems,
      shippingAddress: checkout.shippingAddress,
      paymentMethod: checkout.paymentMethod,
      totalPrice: checkout.totalPrice,
      isPaid: checkout.isPaid,
      paidAt: checkout.paidAt,
    });

    // Marquer le checkout comme finalisé
    checkout.isFinalized = true;
    await checkout.save();

    res.status(201).json(order);
  } catch (error) {
    console.error("❌ Error finalizing checkout:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});
