window.MARY_BLOOMS_CONFIG = {
  telegramBot: {
    username: "MaryBloomsBot",
    defaultStartPayload: "shpargalka",
    sources: {
      tiktok: "tiktok",
      instagram: "instagram",
      threads: "threads",
    },
    buildUrl: function (startPayload) {
      const payload = startPayload || this.defaultStartPayload;
      return "https://t.me/" + this.username + "?start=" + encodeURIComponent(payload);
    },
  },
  telegramPersonal: "https://t.me/mary.bloooms",
  telegramChat: "https://t.me/maryblooms_chat",
};
