// project/src/utils/replacePlaceholders.js

const path = require('path');
const config = require(path.join(__dirname, '..', '..', 'config', 'config'));

function replacePlaceholders(text) {
  return text.replace(/\${(\w+)}/g, (match, variable) => {
    return config[variable] || match;
  });
}

module.exports = replacePlaceholders;
