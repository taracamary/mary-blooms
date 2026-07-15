const TELEGRAM_API = "https://api.telegram.org/bot";

function getToken() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is not set");
  }
  return token;
}

async function callApi(method, body) {
  const response = await fetch(TELEGRAM_API + getToken() + "/" + method, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(data.description || "Telegram API error");
  }

  return data.result;
}

function getSiteUrl() {
  if (process.env.SITE_URL) {
    return process.env.SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return "https://" + process.env.VERCEL_URL;
  }
  return "";
}

function getPdfUrl() {
  const siteUrl = getSiteUrl();
  const fileName = process.env.PDF_FILE_NAME || "shpargalka-mary-blooms.pdf";
  return siteUrl + "/assets/pdf/" + fileName;
}

async function sendMessage(chatId, text, replyMarkup) {
  const body = { chat_id: chatId, text };
  if (replyMarkup) {
    body.reply_markup = replyMarkup;
  }
  return callApi("sendMessage", body);
}

async function sendDocument(chatId, documentUrl, caption) {
  return callApi("sendDocument", {
    chat_id: chatId,
    document: documentUrl,
    caption: caption || "",
  });
}

module.exports = {
  sendMessage,
  sendDocument,
  getPdfUrl,
  getSiteUrl,
};
