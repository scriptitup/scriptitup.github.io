/**
 * Secure proxy between a static contact form (GitHub Pages) and a Discord webhook.
 *
 * Deploy on Cloudflare Workers (free plan). Do NOT hardcode the webhook URL.
 * Provide it as a secret binding: DISCORD_WEBHOOK_URL
 */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Green Discord embed color (0x22c55e)
const EMBED_COLOR = 0x22c55e;

function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...CORS_HEADERS,
    },
  });
}

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default {
  async fetch(request, env) {
    // Handle CORS preflight requests.
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Only POST is allowed.
    if (request.method !== "POST") {
      return jsonResponse({ success: false, error: "Method not allowed." }, 405);
    }

    // Parse and validate the JSON body.
    let body;
    try {
      body = await request.json();
    } catch (err) {
      return jsonResponse({ success: false, error: "Invalid JSON body." }, 400);
    }

    const name = clean(body.name);
    const email = clean(body.email);
    const phone = clean(body.phone);
    const service = clean(body.service);
    const budget = clean(body.budget);
    const message = clean(body.message);

    if (!name || !email || !message) {
      return jsonResponse(
        { success: false, error: "name, email and message are required." },
        400
      );
    }

    if (!isValidEmail(email)) {
      return jsonResponse({ success: false, error: "Invalid email address." }, 400);
    }

    // Read the webhook URL from the secret binding (never hardcode it).
    const webhookUrl = env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      return jsonResponse(
        { success: false, error: "Discord webhook not configured." },
        500
      );
    }

    // Build a rich Discord embed.
    const payload = {
      embeds: [
        {
          title: "📩 New Contact Request",
          color: EMBED_COLOR,
          fields: [
            { name: "Name", value: name, inline: true },
            { name: "Email", value: email, inline: true },
            { name: "Phone", value: phone || "—", inline: true },
            { name: "Service", value: service || "—", inline: true },
            { name: "Budget", value: budget || "—", inline: true },
            { name: "Message", value: message || "—" },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    };

    // Forward the payload to Discord.
    try {
      const discordRes = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!discordRes.ok) {
        return jsonResponse(
          { success: false, error: "Discord webhook failed." },
          502
        );
      }
    } catch (err) {
      return jsonResponse(
        { success: false, error: "Discord webhook unreachable." },
        502
      );
    }

    return jsonResponse(
      { success: true, message: "Message sent successfully." },
      200
    );
  },
};
