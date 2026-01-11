const express = require("express");
const mongoose = require("mongoose");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

//route GEt /api/orders/my-orders
// desc GEt logged-in user's ordres
// access Private

router.get("/my-orders", protect, async(req, res) => {
    try {
        // find orders for the authentifaication user
        const orders = await Order.find({ user: req.user._id}).sort({
            createdAt: -1,
        }) //sort by most recent orders
        res.json(orders)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error"})
        
    }
})

//route GEt /api/orders/:id
// desc vget order details by id
// access Private

router.get("/:id", protect, async(req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate(
            "user",
            "name email"
        );

        if (!order) {
            return res.status(404).json({ message: "Order not found"})
        }

        //return the full order details
        res.json(order)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error"})
    }
})

module.exports = router;