// project/src/utils/replacePlaceholders.js

const path = require('path');
const config = require('../config');

function replacePlaceholders(text) {
  return text.replace(/\${(\w+)}/g, (match, variable) => {
    return config[variable] || match;
  });
}

module.exports = replacePlaceholders;
