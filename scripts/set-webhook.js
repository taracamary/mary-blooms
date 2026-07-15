/**
 * Установка webhook для Telegram-бота.
 * Использование: TELEGRAM_BOT_TOKEN=xxx SITE_URL=https://your.app npm run webhook:set
 */
const token = process.env.TELEGRAM_BOT_TOKEN;
const siteUrl = (process.env.SITE_URL || "").replace(/\/$/, "");
const secret = process.env.TELEGRAM_WEBHOOK_SECRET || "";

if (!token || !siteUrl) {
  console.error("Нужны TELEGRAM_BOT_TOKEN и SITE_URL");
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
    console.log(data);
    if (!data.ok) {
      process.exit(1);
    }
  })
  .catch(function (err) {
    console.error(err);
    process.exit(1);
  });
