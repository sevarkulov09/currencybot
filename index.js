const { Telegraf } = require("telegraf");
const axios = require("axios");
require("dotenv").config();
const cc = require("currency-codes");
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

bot.start((ctx) => {
  return ctx.reply("Welcome tto Currency Bot");
});

bot.hears(/^[A-Z]+$/i, async (ctx) => {
  const clientCurCode = ctx.message.text;
  const currency = cc.code(clientCurCode);
  //check for existing currency
  if (!currency) {
    return ctx.reply("Currency didnt found");
  }
  try {
    const currencyObj = await axios.get(
      "https://cbu.uz/uz/arkhiv-kursov-valyut/json"
    );
    const foundCurrency = currencyObj.data.find((cur) => {
      return cur.Code.toString() == currency.number;
    });

    if (!foundCurrency || !foundCurrency.Rate) {
      return ctx.reply("Currency didnt found in CBUZ API");
    }
    return ctx.replyWithMarkdown(
      `CURRENCY: ${currency.code}
RATE: *${foundCurrency.Rate}*
    `
    );
  } catch (error) {
    return ctx.reply(error);
  }
});
bot.startPolling();
