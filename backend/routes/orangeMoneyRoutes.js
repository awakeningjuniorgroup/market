const express = require("express");
const axios = require("axios");
const router = express.Router();

// Exemple : récupérer un token Orange Money
router.post("/pay", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.orange.com/oauth/v3/token",
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            process.env.OM_APP_ID + ":" + process.env.OM_APP_SECRET
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = response.data.access_token;
    res.json({ token: accessToken });
  } catch (error) {
    console.error("Orange Money error:", error.response?.data || error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
