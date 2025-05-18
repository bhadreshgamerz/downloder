require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const { exec } = require("child_process");
const express = require("express");
const fs = require("fs");

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!TOKEN) {
  console.error("❌ TELEGRAM_BOT_TOKEN is not set.");
  process.exit(1);
}

const bot = new TelegramBot(TOKEN, { polling: true });
const app = express();
const PORT = process.env.PORT || 3000;

// Health route to keep bot alive (for Railway / uptime pingers)
app.get("/", (req, res) => {
  res.send("✅ Telegram Downloader Bot is running!");
});

app.listen(PORT, () => {
  console.log(`🚀 Express server running on port ${PORT}`);
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text || "";

  if (msg.chat.type !== "private") return;

  const ytRegex = /(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/\S+/i;
  const fbRegex = /(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)\/\S+/i;

  const urlMatch = text.match(ytRegex) || text.match(fbRegex);

  if (!urlMatch) {
    bot.sendMessage(chatId, "⚠️ Please send a valid YouTube or Facebook video link.");
    return;
  }

  const url = urlMatch[0];
  const fileName = `video-${Date.now()}.mp4`;

  bot.sendMessage(chatId, "⏬ Downloading your video, please wait...");

  const cmd = `yt-dlp -f mp4 -o "${fileName}" "${url}"`;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error("❌ yt-dlp error:", stderr || error.message);
      bot.sendMessage(chatId, "❌ Failed to download the video.");
      return;
    }

    bot.sendVideo(chatId, fileName).then(() => {
      fs.unlink(fileName, (err) => {
        if (err) console.error("⚠️ Error deleting file:", err);
      });
    }).catch((sendErr) => {
      console.error("❌ Error sending video:", sendErr);
      bot.sendMessage(chatId, "❌ Could not send the video.");
    });
  });
});
