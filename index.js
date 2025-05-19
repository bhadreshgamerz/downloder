const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const ytdlp = require("yt-dlp-exec");
const express = require("express");

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!TOKEN) {
  console.error("❌ TELEGRAM_BOT_TOKEN is not set.");
  process.exit(1);
}

const bot = new TelegramBot(TOKEN, { polling: true });
const app = express();
const PORT = process.env.PORT || 3000;

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text || "";

  if (msg.chat.type !== "private") return;

  const ytRegex = /(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/\S+/i;
  const fbRegex = /(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)\/\S+/i;
  const urlMatch = text.match(ytRegex) || text.match(fbRegex);

  if (!urlMatch) {
    bot.sendMessage(chatId, "Please send a valid YouTube or Facebook video link.");
    return;
  }

  const url = urlMatch[0];
  const fileName = `video-${Date.now()}.mp4`;

  bot.sendMessage(chatId, "⏬ Downloading your video, please wait...");

  ytdlp(url, {
    output: fileName,
    format: "best"
  })
    .then(() => {
      bot.sendVideo(chatId, fileName).then(() => {
        fs.unlink(fileName, (err) => {
          if (err) console.error("❌ Failed to delete file:", err);
        });
      });
    })
    .catch((err) => {
      console.error("❌ yt-dlp error:", err);
      bot.sendMessage(chatId, "❌ Failed to download video.");
    });
});

app.get("/", (req, res) => {
  res.send("✅ Telegram bot is running!");
});

app.listen(PORT, () => {
  console.log(`🟢 Server is running on port ${PORT}`);
});
