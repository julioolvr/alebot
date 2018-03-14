require('dotenv').config();

const Telegraf = require('telegraf');

const log = require('./lib/logger');
const extractors = require('./lib/extractors');
const containsSwearing = require('./lib/swearing');

const bot = new Telegraf(process.env.BOT_TOKEN);
const secret = `bot/${Math.random()
  .toString(36)
  .slice(2)}`;

const port = 3000;

if (process.env.NOW_URL) {
  bot.telegram.setWebhook(`${process.env.NOW_URL}/${secret}`);
  bot.webhookReply = false;
}

function runExtractors(ctx) {
  log.debug('Received text message, looking for extractors', ctx.message);

  const extractor = extractors.find(extractor =>
    extractor.matches(ctx.message)
  );

  if (!extractor) return;

  log.debug('Found extractor, processing...');
  extractor.process(ctx);
}

function runSwearing(ctx) {
  const message = ctx.message;
  log.debug('Received text message, checking user', message);

  if (message.from.username !== process.env.RESPOND_TO_USERNAME) {
    return;
  }

  const odds = Math.random();
  log.debug('Message was from the selected user, odds are', odds);

  if (containsSwearing(message.text) && odds < 0.4) {
    log.debug('Replying with a photo');
    ctx.replyWithPhoto(process.env.IMAGE_REPLY_URL, {
      reply_to_message_id: message.message_id
    });
  }
}

bot.on('text', ctx => {
  runExtractors(ctx);
  runSwearing(ctx);
});

if (process.env.NOW_URL) {
  bot.startWebhook(`/${secret}`, null, port);
} else {
  log.debug('Starting bot with polling');
  bot.startPolling();
}
