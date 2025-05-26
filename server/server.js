import express from "express";
import cors from "cors";
import initiateSTKPush from "./stkpush.js";
import dotenv from "dotenv"



dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/stkpush", async (req, res) => {
  const { phone, amount } = req.body;

  try {
    const result = await initiateSTKPush(phone, amount);
    res.json(result);
  } catch (error) {
    console.error(error?.response?.data || error.message);
    res.status(500).json({ error: "STK Push failed" });
  }
});

app.post("/callback", (req, res) => {
  console.log("DARAJA CALLBACK:", JSON.stringify(req.body));
  res.sendStatus(200);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
