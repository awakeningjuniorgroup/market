const express = require("express");
const axios = require("axios");
const qs = require("querystring");
const { protect } = require("../middleware/authMiddleware");
const verifyTokenAndAdmin = require("../middleware/verifyTokenAndAdmin");

const router = express.Router();

// fonction pour récupérer le token OAuth2 Orange Money
async function getToken() {
  const data = qs.stringify({ grant_type: "client_credentials" });

  const response = await axios.post(
    "https://api.orange.com/oauth/v3/token",
    data,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.OM_APP_ID}:${process.env.OM_APP_SECRET}`
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return response.data.access_token;
}

// @route POST /api/orange-money/initiate-payment
// @desc Initier un paiement Orange Money
// @access Private (utilisateur connecté, ou admin si tu veux restreindre)
router.post(
  "/initiate-payment",
  protect, // vérifie que l’utilisateur est connecté
  // ajoute verifyTokenAndAdmin si tu veux limiter aux admins
  async (req, res) => {
    try {
      const token = await getToken();

      const response = await axios.post(
        "https://api.orange.com/orange-money-webpay/cm/v1/webpayment",
        {
          merchant_key: process.env.OM_MERCHANT_KEY,
          amount: req.body.amount,
          currency: "XAF",
          order_id: Date.now().toString(),
          return_url: "http://localhost:5173/payment-success",
          cancel_url: "http://localhost:5173/payment-cancel",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      res.json({ payment_url: response.data.payment_url });
    } catch (error) {
      console.error("Erreur init paiement:", error.response?.data || error.message);
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  }
);

module.exports = router;
