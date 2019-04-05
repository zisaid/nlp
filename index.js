const tokenizer = require('./lib/tokenizer');
const utils = require('./lib/utils');

let init = function (word2protoPath, protoDetailPath) {
  utils.init(word2protoPath, protoDetailPath);
};

module.exports = {
  tokenizer: tokenizer,
  init: init,
  utils: utils
};
