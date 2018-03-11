require('dotenv').config();

const Telegraf = require('telegraf');

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

bot.on('text', async ctx => {
  const extractor = extractors.find(extractor =>
    extractor.matches(ctx.message)
  );

  if (!extractor) return;

  // TODO: Each extractor can reply in different ways
  const result = await extractor.extract(ctx.message);
  ctx.replyWithVideo({ source: result });
});

if (process.env.NOW_URL) {
  bot.startWebhook(`/${secret}`, null, port);
} else {
  bot.startPolling();
}
