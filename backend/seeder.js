const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Products");
const User = require("./models/user");
const Cart = require("./models/Cart");
const products = require("./data/products");

dotenv.config();

const seedData = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connecté");

    // Vider les collections
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();

    // Créer un utilisateur admin par défaut
    const adminUser = await User.create({
      name: "Admin",
      email: "adminexample@example.com",
      password: "123456",
      role: "admin",
    });

    // Associer l’ID de l’admin aux produits
    const sampleProducts = products.map((p) => {
      return { ...p, user: adminUser._id };
    });

    await Product.insertMany(sampleProducts);

    console.log("🌱 Données insérées avec succès !");
    process.exit();
  } catch (error) {
    console.error("❌ Erreur lors du seed:", error);
    process.exit(1);
  }
};

seedData();
