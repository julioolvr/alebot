const swears = [
  /garcha/i,
  /chot[oa]/i,
  /put[oa]/i,
  /mierda/i,
  /forro/i,
  /imb[eé]cil/i,
  /verga/i
];

function containsSwearing(text) {
  return swears.some(swear => text.match(swear));
}

module.exports = containsSwearing;
