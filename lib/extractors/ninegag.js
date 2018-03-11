const urlParse = require('url-parse');
const got = require('got');

function matches(message) {
  return urlParse(message.text).hostname.endsWith('9gag.com');
}

async function extract(message) {
  const id = urlParse(message.text).pathname.match(/\/gag\/(.*)/)[1];
  return got.stream(`https://img-9gag-fun.9cache.com/photo/${id}_460sv.mp4`);
}

module.exports = { matches, extract };
