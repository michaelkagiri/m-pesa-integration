import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const {
  DARAJA_CONSUMER_KEY,
  DARAJA_CONSUMER_SECRET,
  DARAJA_SHORTCODE,
  DARAJA_PASSKEY,
  CALLBACK_URL,
} = process.env;

async function getAccessToken() {
  const auth = Buffer.from(`${DARAJA_CONSUMER_KEY}:${DARAJA_CONSUMER_SECRET}`).toString("base64");

  const { data } = await axios.get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  return data.access_token;
}

async function initiateSTKPush(phone, amount) {
  const access_token = await getAccessToken();
  const timestamp = moment().format("YYYYMMDDHHmmss");
  const password = Buffer.from(DARAJA_SHORTCODE + DARAJA_PASSKEY + timestamp).toString("base64");

  const payload = {
    BusinessShortCode: DARAJA_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: phone,
    PartyB: DARAJA_SHORTCODE,
    PhoneNumber: phone,
    CallBackURL: CALLBACK_URL,
    AccountReference: "DarajaTest",
    TransactionDesc: "Testing Daraja STK",
  };

  const { data } = await axios.post(
    "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
    payload,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return data;
}
export default initiateSTKPush;