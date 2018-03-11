const urlParse = require('url-parse');

function matches() {
  const url = 'https://m.9gag.com/gag/somethingsomething?ref=ios.s.others';
  return urlParse(url).hostname.endsWith('9gag.com');
}

function extract() {
  return 'TODO';
}

module.exports = { matches, extract };
