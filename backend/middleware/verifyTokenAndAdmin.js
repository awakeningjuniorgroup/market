const jwt = require("jsonwebtoken");

function verifyTokenAndAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token invalide" });
    }

    // Vérifie le rôle directement
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Accès refusé: rôle admin requis" });
    }

    // Ajoute l’utilisateur décodé à la requête
    req.user = { id: decoded.id, role: decoded.role };
    next();
  });
}

module.exports = verifyTokenAndAdmin;
