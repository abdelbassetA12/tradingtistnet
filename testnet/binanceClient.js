const axios = require("axios");
const crypto = require("crypto");


const BASE_URL = "https://testnet.binance.vision";

const API_KEY = process.env.BINANCE_KEY;
const SECRET = process.env.BINANCE_SECRET;

// ===== دالة توقيع query =====
function sign(query) {
  return crypto
    .createHmac("sha256", SECRET)
    .update(query)
    .digest("hex");
}

// ===== جلب الوقت من Binance =====
async function getServerTime() {
  const res = await axios.get(`${BASE_URL}/api/v3/time`);
  return res.data.serverTime;
}

// ===== GET account =====
async function getAccount() {
  const timestamp = await getServerTime();
  const query = `timestamp=${timestamp}`;
  const signature = sign(query);

  const res = await axios.get(
    `${BASE_URL}/api/v3/account?${query}&signature=${signature}`,
    { headers: { "X-MBX-APIKEY": API_KEY } }
  );

  return res.data;
}

// ===== MARKET ORDER =====
async function marketOrder(symbol, side, quantity) {
  const timestamp = await getServerTime(); // ← الآن معرفة

  const recvWindow = 5000; // 5 ثواني
  const query = `symbol=${symbol}&side=${side}&type=MARKET&quantity=${quantity}&timestamp=${timestamp}&recvWindow=${recvWindow}`;
  const signature = sign(query);

  const res = await axios.post(
    `${BASE_URL}/api/v3/order?${query}&signature=${signature}`,
    null, // مهم
    { headers: { "X-MBX-APIKEY": API_KEY } }
  );

  return res.data;
}


module.exports = { getAccount, marketOrder };



