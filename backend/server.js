const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser")

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

// Initialisation de l'app
const app = express();
require("dotenv").config(); 
// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ 
  
  credentials: true,
  allowedHeaders: ["Authorization", "Content-Type"],
}
));
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Connexion DB
connectDB();

// Port
const PORT = process.env.PORT || 9000;

// Route de test
app.get("/", (req, res) => {
  res.send("WELCOME TO RABBIT API!");
});

// API Routes publiques
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/subscribe", subscribeRoutes);
app.use("/api/orange-money", orangeMoneyRoutes);
app.use("/api/initiate-payment", orangeMoneyvalidationRoutes)

// API Routes Admin
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
