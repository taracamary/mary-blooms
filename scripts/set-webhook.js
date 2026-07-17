/**
 * Установка webhook для Telegram-бота.
 *
 * Локально: положите TELEGRAM_BOT_TOKEN и SITE_URL в .env и выполните
 *   npm run webhook:set
 *
 * Или передайте переменные в окружении:
 *   TELEGRAM_BOT_TOKEN=xxx SITE_URL=https://your.app npm run webhook:set
 *
 * Уже заданные переменные окружения (Vercel, shell) имеют приоритет над .env.
 */
const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const token = process.env.TELEGRAM_BOT_TOKEN;
const siteUrl = (process.env.SITE_URL || "").replace(/\/$/, "");
const secret = process.env.TELEGRAM_WEBHOOK_SECRET || "";

if (!token || !siteUrl) {
  console.error("Нужны TELEGRAM_BOT_TOKEN и SITE_URL (.env или переменные окружения)");
  process.exit(1);
}

const webhookUrl = siteUrl + "/api/telegram-webhook";
const body = {
  url: webhookUrl,
  allowed_updates: ["message"],
};

if (secret) {
  body.secret_token = secret;
}

fetch("https://api.telegram.org/bot" + token + "/setWebhook", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
})
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    console.log({
      ok: data.ok,
      description: data.description,
      webhookUrl: webhookUrl,
    });
    if (!data.ok) {
      process.exit(1);
    }
  })
  .catch(function (err) {
    console.error("Не удалось установить webhook:", err.message);
    process.exit(1);
  });
