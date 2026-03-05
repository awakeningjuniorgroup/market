const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");

// Import des routes API...
// (tes imports userRoutes, productRoutes, etc.)
// Import des routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const subscribeRoutes = require("./routes/subscribeRoutes");
const orangeMoneyRoutes = require("./routes/orangeMoneyRoutes");
const orangeMoneyvalidationRoutes = require("./routes/orangeMoneyRoutes");

// Routes Admin
const adminUserRoutes = require("./routes/adminRoutes"); // gestion des utilisateurs admin
const adminProductRoutes = require("./routes/productAdminRoutes"); // gestion des produits admin
const adminOrderRoutes = require("./routes/adminOrderRoutes"); // gestion des commandes admin


const app = express();
require("dotenv").config();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "https://kams-market12.onrender.com",
  credentials: true,
  allowedHeaders: ["Authorization", "Content-Type"],
}));

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", require("./routes/authRoutes"));
connectDB();

const PORT = process.env.PORT || 9000;
// Route de test
app.get("/", (req, res) => {
  res.send("WELCOME TO RABBIT API!");
});
// API routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/checkout", require("./routes/checkoutRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/subscribe", require("./routes/subscribeRoutes"));
app.use("/api/orange-money", require("./routes/orangeMoneyRoutes"));

app.use("/api/admin/users", require("./routes/adminRoutes"));
app.use("/api/admin/products", require("./routes/productAdminRoutes"));
app.use("/api/admin/orders", require("./routes/adminOrderRoutes"));


// Port

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
