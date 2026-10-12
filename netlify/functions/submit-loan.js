// Netlify Function: forwards basic loan enquiries to your Telegram chat.
// Configure TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID as Netlify environment variables.
// Never put the bot token in index.html or any public client-side code.
const escapeHtml = (value = "") => String(value)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: "Method not allowed." }) };
  }
  let data;
  try { data = JSON.parse(event.body || "{}"); }
  catch { return { statusCode: 400, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: "Invalid form submission." }) }; }

  const required = ["name", "email", "phone", "country", "loanType", "amount"];
  for (const field of required) {
    if (!String(data[field] || "").trim()) {
      return { statusCode: 400, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: "Please complete all required fields." }) };
    }
  }
  if (!data.consent) {
    return { statusCode: 400, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: "Consent is required to submit this enquiry." }) };
  }
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return { statusCode: 503, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: "The form is not fully configured yet. Please try again later." }) };
  }

  const fields = [
    ["Name", data.name], ["Email", data.email], ["Phone", data.phone],
    ["Country", data.country], ["Enquiry type", data.loanType],
    ["Requested amount", data.amount], ["Additional information", data.message || "Not provided"]
  ];
  const message = "<b>New SwiftLoan Enquiry</b>\n\n" +
    fields.map(([label, value]) => `<b>${escapeHtml(label)}:</b> ${escapeHtml(String(value).slice(0, 1000))}`).join("\n");
  try {
    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML", disable_web_page_preview: true })
    });
    const telegramResult = await telegramResponse.json();
    if (!telegramResponse.ok || !telegramResult.ok) throw new Error("Telegram delivery failed");
    return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ok: true }) };
  } catch {
    return { statusCode: 502, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: "We could not deliver your enquiry. Please try again later." }) };
  }
};