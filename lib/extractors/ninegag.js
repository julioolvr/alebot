const urlParse = require('url-parse');
const got = require('got');

const log = require('../logger');

function extractUrls(message, entities) {
  return entities
    .filter(entity => entity.type === 'url')
    .map(entity => message.substr(entity.offset, entity.length));
}

function matches(message) {
  return (
    message.entities &&
    extractUrls(message.text, message.entities).some(url =>
      urlParse(url).hostname.endsWith('9gag.com')
    )
  );
}

async function process(ctx) {
  const message = ctx.message;

  const urls = extractUrls(message.text, message.entities);
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
      ctx.replyWithVideo({ source: stream });
    });
  });
}

module.exports = { matches, process };
