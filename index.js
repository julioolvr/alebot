require('dotenv').config();

const Telegraf = require('telegraf');

const extractors = require('./lib/extractors');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.on('text', async ctx => {
  const extractor = extractors.find(extractor =>
    extractor.matches(ctx.message)
  );

  if (!extractor) return;

  // TODO: Each extractor can reply in different ways
  const result = await extractor.extract(ctx.message);
  ctx.replyWithVideo({ source: result });
});

bot.startPolling();
