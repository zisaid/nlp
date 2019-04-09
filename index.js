const tokenizer = require('./lib/tokenizer');
const utils = require('./lib/utils');
const grade = require('./lib/grade');

let init = function (dictPath) {
  utils.init(dictPath);
  grade.init(dictPath);
};

module.exports = {
  tokenizer: tokenizer,
  init: init,
  utils: utils,
  grade: grade
};
