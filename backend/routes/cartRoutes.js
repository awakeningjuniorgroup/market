const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Products");

const router = express.Router();

// helper function to get a cart by guestId uniquement
const getCart = async (guestId) => {
  if (guestId) {
    return await Cart.findOne({ guestId });
  }
  return null;
};

// @route POST api/cart
// @desc add a product to the cart for a guest
// @access public
router.post("/", async (req, res) => {
  const { productId, quantity, size, color, guestId } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await getCart(guestId);

    if (cart) {
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color
      );

      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({
          productId,
          name: product.name,
          image: product.images[0]?.url,
          price: product.price,
          size,
          color,
          quantity,
        });
      }

      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      const newCart = await Cart.create({
        guestId: guestId || "guest_" + Date.now(),
        products: [
          {
            productId,
            name: product.name,
            image: product.images[0]?.url,
            price: product.price,
            size,
            color,
            quantity,
          },
        ],
        totalPrice: product.price * quantity,
      });
      return res.status(201).json(newCart);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// @route PUT api/cart
// @desc update product quantity in the cart
// @access public
router.put("/", async (req, res) => {
  const { productId, quantity, size, color, guestId } = req.body;

  try {
    let cart = await getCart(guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex > -1) {
      if (quantity > 0) {
        cart.products[productIndex].quantity = quantity;
      } else {
        cart.products.splice(productIndex, 1);
      }
    }

    cart.totalPrice = cart.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    await cart.save();
    return res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route DELETE api/cart
// @desc remove a product from the cart
// @access public
router.delete("/", async (req, res) => {
  const { productId, size, color, guestId } = req.body;
  try {
    let cart = await getCart(guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex > -1) {
      cart.products.splice(productIndex, 1);
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

// @route GET api/cart
// @desc get guest user's cart
// @access public
router.get("/", async (req, res) => {
  const { guestId } = req.query;
  try {
    const cart = await getCart(guestId);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
