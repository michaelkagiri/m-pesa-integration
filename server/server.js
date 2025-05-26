// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import initiateSTKPush from "./stkpush.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// STK Push route
app.post("/api/stkpush", async (req, res) => {
  const { phone, amount } = req.body;

  try {
    const result = await initiateSTKPush(phone, amount);
    res.json(result);
  } catch (error) {
    console.error("STK Push Error:", error?.response?.data || error.message);
    res.status(500).json({ error: "STK Push failed" });
  }
});

// Callback URL for Daraja to hit
app.post("/callback", (req, res) => {
  console.log("DARAJA CALLBACK:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});