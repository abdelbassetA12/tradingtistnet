// routes.js
const express = require("express");
const router = express.Router();
const { getTradesIncludingActive } = require("./positionManager");
const { getAccount } = require("./binanceClient");
router.get("/trades", (req, res) => {
  res.json(getTradesIncludingActive());
});


router.get("/balance", async (req, res) => {
  try {
    const account = await getAccount();
    // فلترة الرصيد اللي أكبر من صفر
    const balances = account.balances.filter(b => parseFloat(b.free) > 0);
    res.json(balances);
  } catch (err) {
    console.error("Error fetching balance:", err.message || err);
    res.status(500).json({ error: "Failed to fetch balance" });
  }
});

console.log("📡 API CALL - TRADES:", getTradesIncludingActive());

module.exports = router;
