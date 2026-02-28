const express = require("express");
const Product = require("../models/Products");
const { protect, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// --- ROUTES ADMIN ---
// @route POST /api/admin/products
router.post("/", protect, isAdmin, async (req, res) => {
  try {
    const product = new Product({ ...req.body, user: req.user._id });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route PUT /api/admin/products/:id
router.put("/:id", protect, isAdmin, async (req, res) => {
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
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route DELETE /api/admin/products/:id
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// --- ROUTES PUBLIQUES ---
// @route GET /api/products
router.get("/", async (req, res) => {
  try {
    const { collection, size, color, gender, minPrice, maxPrice, sortBy, search, category, material, brand, limit } = req.query;
    let query = {};

    if (collection && collection.toLowerCase() !== "all") query.collections = collection;
    if (category && category.toLowerCase() !== "all") query.category = category;
    if (material) query.material = { $in: material.split(",") };
    if (brand) query.brand = { $in: brand.split(",") };
    if (size) query.sizes = { $in: size.split(",") };
    if (color) query.colors = { $in: [color] };
    if (gender) query.gender = gender;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    let sort = {};
    if (sortBy === "priceAsc") sort = { price: 1 };
    else if (sortBy === "priceDesc") sort = { price: -1 };
    else if (sortBy === "popularity") sort = { rating: -1 };

    const products = await Product.find(query).sort(sort).limit(Number(limit) || 0);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route GET /api/products/new-arrivals
router.get("/new-arrivals", async (req, res) => {
  try {
    const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
    res.json(newArrivals);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route GET /api/products/best-seller
router.get("/best-seller", async (req, res) => {
  try {
    const bestSellers = await Product.find().sort({ rating: -1 }).limit(8);
    res.json(bestSellers);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) res.json(product);
    else res.status(404).json({ message: "Product not found" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route GET /api/products/similar/:id
router.get("/similar/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const similarProducts = await Product.find({
      _id: { $ne: req.params.id },
      gender: product.gender,
      category: product.category,
    }).limit(4);

    res.json(similarProducts);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
