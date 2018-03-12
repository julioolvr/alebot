require('dotenv').config();

const Telegraf = require('telegraf');

const log = require('./lib/logger');
const extractors = require('./lib/extractors');

const bot = new Telegraf(process.env.BOT_TOKEN);
const secret = `bot/${Math.random()
  .toString(36)
  .slice(2)}`;

const port = 3000;

if (process.env.NOW_URL) {
  bot.telegram.setWebhook(`${process.env.NOW_URL}/${secret}`);
  bot.webhookReply = false;
}

bot.on('text', ctx => {
  log.debug('Received text message', ctx.message);
  const extractor = extractors.find(extractor =>
    extractor.matches(ctx.message)
  );

  if (!extractor) return;

  extractor.process(ctx);
});

if (process.env.NOW_URL) {
  bot.startWebhook(`/${secret}`, null, port);
} else {
  bot.startPolling();
}
