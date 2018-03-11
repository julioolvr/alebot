const extractors = require('./lib/extractors');

extractors.forEach(extractor => {
  console.log('matches?', extractor.matches('something'));
  console.log('extracted', extractor.extract('sdqqd'));
});
