const { saveLeadIfNew } = require("./lib/storage");
const { sendMessage, sendDocument, getPdfUrl } = require("./lib/telegram");

function parseStartPayload(text) {
  if (!text || !text.startsWith("/start")) {
    return null;
  }

  const parts = text.trim().split(/\s+/);
  return parts[1] || "shpargalka";
}

function getFollowUpKeyboard() {
  const plantReviewUrl =
    process.env.TELEGRAM_PLANT_REVIEW_URL ||
    "https://t.me/mary.bloooms?text=%D0%A0%D0%B0%D0%B7%D0%BE%D0%B1%D1%80%D0%B0%D1%82%D1%8C%20%D0%BC%D0%BE%D1%91%20%D1%80%D0%B0%D1%81%D1%82%D0%B5%D0%BD%D0%B8%D0%B5";

  const materialsUrl =
    process.env.TELEGRAM_MATERIALS_URL || "https://t.me/maryblooms_chat";

  return {
    inline_keyboard: [
      [{ text: "Разобрать моё растение", url: plantReviewUrl }],
      [{ text: "Присоединиться к чату", url: materialsUrl }],
    ],
  };
}

async function handleStart(chatId, startPayload) {
  await saveLeadIfNew(chatId, startPayload);

  await sendMessage(
    chatId,
    "Привет! Я бот Mary Blooms 🌿\n\n" +
      "Сейчас отправлю бесплатную PDF-шпаргалку: " +
      "почему желтеют листья, появляются пятна и что делать в первые дни."
  );

  const pdfUrl = getPdfUrl();
  if (!pdfUrl || pdfUrl.startsWith("/assets")) {
    throw new Error("SITE_URL or VERCEL_URL is required to send PDF");
  }

  await sendDocument(
    chatId,
    pdfUrl,
    "Шпаргалка по уходу за комнатными растениями"
  );

  await sendMessage(
    chatId,
    "Если после шпаргалки останутся вопросы — помогу разобраться с вашим растением.",
    getFollowUpKeyboard()
  );
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret && req.headers["x-telegram-bot-api-secret-token"] !== secret) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  try {
    const update = req.body;
    const message = update?.message;

    if (!message?.text || !message.chat?.id) {
      return res.status(200).json({ ok: true, skipped: true });
    }

    const startPayload = parseStartPayload(message.text);

    if (startPayload !== null) {
      await handleStart(message.chat.id, startPayload);
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("[telegram-webhook]", error);
    return res.status(500).json({ ok: false, error: error.message });
  }
};
