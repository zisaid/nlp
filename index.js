const tokenizer = require('./lib/tokenizer');
const utils = require('./lib/utils');

let init = function (dictPath) {
  utils.init(dictPath);
};

module.exports = {
  tokenizer: tokenizer,
  init: init,
  utils: utils
};
