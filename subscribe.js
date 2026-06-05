// api/subscribe.js
// Place this file in your project at: trademind/api/subscribe.js
// Vercel automatically turns files in the /api folder into serverless functions.
// This function receives an email from the landing page form and adds it to Mailchimp.

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  // Basic validation
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  // These come from your Vercel Environment Variables
  const API_KEY = process.env.MAILCHIMP_API_KEY;
  const LIST_ID = process.env.MAILCHIMP_LIST_ID;

  if (!API_KEY || !LIST_ID) {
    console.error("Missing Mailchimp environment variables");
    return res.status(500).json({ error: "Server configuration error" });
  }

  // Mailchimp API server prefix is the last part of the API key (e.g. "us21")
  const DC = API_KEY.split("-").pop();
  const url = `https://${DC}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`any:${API_KEY}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email.toLowerCase().trim(),
        status: "subscribed",
        tags: ["TradeMind Waitlist"],
      }),
    });

    const data = await response.json();

    // Handle already-subscribed gracefully (not an error for us)
    if (response.status === 400 && data.title === "Member Exists") {
      return res.status(200).json({ ok: true, message: "Already subscribed" });
    }

    if (!response.ok) {
      console.error("Mailchimp error:", data);
      return res.status(400).json({ error: data.detail || "Subscription failed", title: data.title });
    }

    return res.status(200).json({ ok: true, message: "Subscribed successfully" });

  } catch (error) {
    console.error("Subscribe error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
