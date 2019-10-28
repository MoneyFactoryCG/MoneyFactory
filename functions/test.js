const express = require("express");
const serverless = require("serverless-http");
const app = express();
const bodyParser = require("body-parser");
const Telegraf = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

app.use(bodyParser);
app.post("/send", (res, req) => {
  bot.sendMessage(-361781942, req.body.phone);
  console.log("ok");
});

module.exports.handler = serverless(app);
