// TraderPoise — Mailchimp Waitlist Subscribe API
// Deploy this in your /api folder on Vercel

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, name, trader_type } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
  const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;
  const MAILCHIMP_DC = process.env.MAILCHIMP_DC; // e.g. "us21"

  if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID || !MAILCHIMP_DC) {
    return res.status(500).json({ error: "Mailchimp not configured" });
  }

  try {
    const response = await fetch(
      `https://${MAILCHIMP_DC}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: name || "",
            TRADER: trader_type || "forex",
            BRAND: "TraderPoise",
          },
          tags: ["traderpoise-waitlist", trader_type || "forex"],
        }),
      }
    );

    const data = await response.json();

    if (response.status === 200 || response.status === 201) {
      return res.status(200).json({ success: true, message: "Successfully joined TraderPoise waitlist!" });
    }

    if (data.title === "Member Exists") {
      return res.status(200).json({ success: true, message: "You're already on the waitlist!" });
    }

    throw new Error(data.detail || "Mailchimp error");
  } catch (error) {
    console.error("TraderPoise waitlist error:", error);
    return res.status(500).json({ error: error.message || "Failed to join waitlist" });
  }
}
