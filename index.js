require('dotenv').config();

const Telegraf = require('telegraf');

const extractors = require('./lib/extractors');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.on('text', ctx => {
  const extractor = extractors.find(extractor =>
    extractor.matches(ctx.message)
  );

  if (!extractor) return;

  const result = extractor.extract(ctx.message);
  ctx.reply(result);
});

bot.startPolling();
