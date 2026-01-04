import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("WhatsApp Bot Running ✅");
});

// WhatsApp webhook
app.post("/webhook", async (req, res) => {
  const msg =
    req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body;

  if (msg?.toLowerCase() === "hi") {
    await sendMessage("👋 Welcome! Reply MENU to order.");
  }

  if (msg?.toLowerCase() === "menu") {
    await sendMessage("🍔 Burger ₹199\n🍕 Pizza ₹249\nReply item name");
  }

  res.sendStatus(200);
});

async function sendMessage(text) {
  await fetch(
    `https://graph.facebook.com/v18.0/${process.env.PHONE_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: process.env.CUSTOMER_NUMBER,
        text: { body: text },
      }),
    }
  );
}

app.listen(3000, () => console.log("Server running"));
