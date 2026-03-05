const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const path = require("path");

// Import des routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const subscribeRoutes = require("./routes/subscribeRoutes");
const orangeMoneyRoutes = require("./routes/orangeMoneyRoutes");
const authRoutes = require("./routes/authRoutes");

// Routes Admin
const adminUserRoutes = require("./routes/adminRoutes"); 
const adminProductRoutes = require("./routes/productAdminRoutes"); 
const adminOrderRoutes = require("./routes/adminOrderRoutes"); 

// Initialisation de l'app
const app = express();
dotenv.config();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ 
  origin: "https://kams-market12.onrender.com", // ton domaine frontend
  credentials: true,
  allowedHeaders: ["Authorization", "Content-Type"],
}));

// Connexion DB
connectDB();

// Port
const PORT = process.env.PORT || 9000;

// API Routes publiques
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/subscribe", subscribeRoutes);
app.use("/api/orange-money", orangeMoneyRoutes);
app.use("/api/auth", authRoutes);

// API Routes Admin
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

// ✅ Servir le frontend build (dist)
const __dirnamePath = path.resolve();
app.use(express.static(path.join(__dirnamePath, "dist")));

// ✅ Catch-all pour React Router (évite les 404 sur les routes frontend)
app.get(/.*/, (req, res) => {
  res.sendFile(path.resolve(__dirnamePath, "dist", "index.html"));
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT} (${process.env.NODE_ENV})`);
});
