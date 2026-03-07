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
