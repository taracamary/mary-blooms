const { Redis } = require("@upstash/redis");

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return null;
  }

  return new Redis({ url, token });
}

async function saveLeadIfNew(chatId, startPayload) {
  const record = {
    chatId: String(chatId),
    firstSeenAt: new Date().toISOString(),
    startPayload: startPayload || "shpargalka",
  };

  const redis = getRedis();

  if (!redis) {
    console.info("[lead]", JSON.stringify(record));
    return { saved: false, record };
  }

  const key = "lead:" + chatId;
  const existing = await redis.get(key);

  if (existing) {
    return { saved: false, record: existing };
  }

  await redis.set(key, record);
  console.info("[lead] saved", JSON.stringify(record));
  return { saved: true, record };
}

module.exports = {
  saveLeadIfNew,
  getRedis,
};
