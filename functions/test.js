const express = require("express");
const serverless = require("serverless-http");
const app = express();
const bodyParser = require("body-parser");
const Telegraf = require("telegraf");

const bot = new Telegraf("905553028:AAH3MRBKNmS8y3qpxFvOCkTeNExFDHL07xw");
const router = express.Router();

app.use(bodyParser.json());
router.post("/", (res, req) => {
  bot.telegram.sendMessage(-361781942, req.body.phone);
  res.status(200).json({ send: "ok" });
});

app.use("/.netlify/functions/test", router);

module.exports.handler = serverless(app);
module.exports = app;
