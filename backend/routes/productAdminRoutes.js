const express = require("express");
const Product = require("../models/Products");
const { protect, admin } = require("../middleware/authMiddleware");
const verifyTokenAndAdmin = require("../middleware/verifyTokenAndAdmin")

const router = express.Router();

// @route GET /api/admin/products
// @desc Get all products (admin only)
// @access Private/Admin
router.get("/", protect, verifyTokenAndAdmin, admin, async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route POST /api/admin/products
// @desc Create a new product (admin only)
// @access Private/Admin
router.post("/", protect, verifyTokenAndAdmin, admin, async (req, res) => {
  try {
    const product = new Product(req.body);
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route PUT /api/admin/products/:id
// @desc Update product (admin only)
// @access Private/Admin
router.put("/:id", protect, verifyTokenAndAdmin, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      Object.assign(product, req.body);
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route DELETE /api/admin/products/:id
// @desc Delete product (admin only)
// @access Private/Admin
router.delete("/:id", protect, verifyTokenAndAdmin, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
