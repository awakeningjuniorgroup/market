const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Générer un access token (durée courte)
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

// Générer un refresh token (durée longue)
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

// --- LOGIN ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        type: "INVALID_CREDENTIALS",
        message: "Email ou mot de passe incorrect."
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Erreur login:", error);
    res.status(500).json({
      type: "SERVER_ERROR",
      message: "Erreur interne du serveur",
      error: error.message
    });
  }
};

// --- REFRESH ---
exports.refresh = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({
      type: "NO_REFRESH_TOKEN",
      message: "Aucun refresh token fourni."
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        type: "USER_NOT_FOUND",
        message: "Utilisateur introuvable."
      });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    console.error("Refresh token error:", err.message);
    return res.status(401).json({
      type: "INVALID_REFRESH_TOKEN",
      message: "Refresh token invalide ou expiré."
    });
  }
};

// --- REGISTER ---
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation du mot de passe
    if (!password || password.length < 6) {
      return res.status(400).json({
        type: "PASSWORD_TOO_SHORT",
        message: "Le mot de passe doit contenir au moins 6 caractères."
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        type: "USER_EXISTS",
        message: "Un utilisateur avec cet email existe déjà."
      });
    }

    const user = await User.create({ name, email, password, role: role || "customer" });
    if (user) {
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      res.json({ user, accessToken, refreshToken });
    } else {
      res.status(400).json({
        type: "INVALID_USER_DATA",
        message: "Les données utilisateur sont invalides."
      });
    }
  } catch (error) {
    res.status(500).json({
      type: "SERVER_ERROR",
      message: "Erreur interne du serveur",
      error: error.message
    });
  }
};
