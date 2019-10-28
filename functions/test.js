const express = require("express");
const serverless = require("serverless-http");
const app = express();
const bodyParser = require("body-parser");
const Telegraf = require("telegraf");

const bot = new Telegraf("905553028:AAH3MRBKNmS8y3qpxFvOCkTeNExFDHL07xw");
const router = express.Router();

app.use(bodyParser.json());
router.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<h1>Hello from MoneyFactory!</h1>");
  res.end();
});
router.post("/", (req, res) => {
  bot.telegram.sendMessage(-361781942, req.body.phone);
  res.json({ send: "ok" });
});

app.use("/.netlify/functions/test", router);

module.exports = app;
module.exports.handler = serverless(app);
