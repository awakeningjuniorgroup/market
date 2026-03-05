const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const path = require("path");

// Import des routes API...
// (tes imports userRoutes, productRoutes, etc.)

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "https://kams-market12.onrender.com",
  credentials: true,
  allowedHeaders: ["Authorization", "Content-Type"],
}));

// API routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/checkout", require("./routes/checkoutRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/subscribe", require("./routes/subscribeRoutes"));
app.use("/api/orange-money", require("./routes/orangeMoneyRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin/users", require("./routes/adminRoutes"));
app.use("/api/admin/products", require("./routes/productAdminRoutes"));
app.use("/api/admin/orders", require("./routes/adminOrderRoutes"));



app.use((req, res, next) => { if (req.path.endsWith(".js")) { res.type("application/javascript"); } next(); });
// ✅ Servir le frontend build
const __dirnamePath = path.resolve();
app.use(express.static(path.join(__dirnamePath, "dist")));

// ✅ Catch-all pour React Router
// Express 5 → utiliser regex et exclure les assets
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.resolve(__dirnamePath, "dist", "index.html"));
});

// Port
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
