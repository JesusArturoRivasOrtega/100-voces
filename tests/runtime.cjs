const { chromium } = require("playwright");
module.exports = {
  chromium,
  browserOptions: {
    headless: true,
    ...(process.env.VOCES_BROWSER === "chromium"
      ? {}
      : { channel: process.env.VOCES_BROWSER || "msedge" }),
  },
  baseURL: process.env.VOCES_BASE_URL || "http://127.0.0.1:8765",
  axePath: require.resolve("axe-core/axe.min.js"),
};
