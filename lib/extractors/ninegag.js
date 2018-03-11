const urlParse = require('url-parse');

function matches(message) {
  return urlParse(message.text).hostname.endsWith('9gag.com');
}

function extract(message) {
  return `GIF from ${message.text}`;
}

module.exports = { matches, extract };
