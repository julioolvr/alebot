const urlParse = require('url-parse');
const got = require('got');

const log = require('../logger');

function extractUrls(message) {
  return (message.entities || [])
    .filter(entity => entity.type === 'url')
    .map(entity => message.text.substr(entity.offset, entity.length));
}

function matches(message) {
  return (
    message.entities &&
    extractUrls(message).some(url =>
      urlParse(url).hostname.endsWith('9gag.com')
    )
  );
}

async function process(ctx) {
  const message = ctx.message;

  const urls = extractUrls(message);
  log.debug('9gag extractor URLs found', urls);

  urls.forEach(url => {
    const id = urlParse(url).pathname.match(/\/gag\/(.*)/)[1];
    const stream = got.stream(
      `https://img-9gag-fun.9cache.com/photo/${id}_460sv.mp4`
    );
    stream.on('error', err => {
      log.debug('Error getting video stream', err);
    });
    stream.on('response', () => {
      log.debug('Responding to message', message.message_id);
      ctx.replyWithVideo(
        { source: stream },
        { reply_to_message_id: message.message_id }
      );
    });
  });
}

module.exports = { matches, process };
