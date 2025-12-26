import express from "express";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config(); 

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;


app.use(express.static(path.join(__dirname, "public")));


app.post("/api/payment", async (req, res) => {
  try 
  {
    const { phone, amount, reference } = req.body;

    if (!phone || !amount || !reference)
      return res.status(400).json({ error: "Missing required fields" });


    const upiId = process.env.UPI_ID;
    const name = encodeURIComponent(process.env.UPI_NAME);
    const note = encodeURIComponent(process.env.UPI_NOTE);

    const defaultWhatsapp = process.env.DEFAULT_WHATSAPP;

    const upiLink = `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR&tn=${note}`;

    // WhatsApp message
    const whatsappMsg = encodeURIComponent(
      `Hello!\nPlease complete your payment of ₹${amount} for order *${reference}* by tapping this link:\n${upiLink}\n\nYou can use Google Pay, PhonePe, Paytm, or BHIM.`
    );

    const whatsappNumber = `91${phone.replace(/\D/g, "")}` || defaultWhatsapp;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${whatsappMsg}`;

    res.json({
      message: "Payment link generated successfully.",
      upiLink,
      whatsappUrl,
    });
  } 
  catch (err) 
  {
    console.error("Error generating link:", err);
    res.status(500).json({ error: "Failed to process payment" });
  }
});


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "payment_index.html"));
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
