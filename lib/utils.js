let tokenizer = require('./tokenizer');
let fs = require('fs');

let utils = {};

let word2proto = {};

let w2p, protoDetail;

utils.init = function (word2protoPath, protoDetailPath) {
  w2p = word2protoPath;
  protoDetail = protoDetailPath;
};

utils.word2proto = function (word) {
  word = word.trim().toLocaleLowerCase();
  if (word2proto[word]) {
    word = word2proto[word];
  } else {
    let wordPath = w2p + '/' + word + '.json';
    if (fs.existsSync(wordPath)) {
      let proto = JSON.parse(fs.readFileSync(wordPath, 'utf8'))[0];
      word2proto[word] = proto;
      word = proto;
    }
  }
  return word;
};

utils.forSearchKey = function (article) {
  let wordList = [];
  let vector = tokenizer.word(article);
  vector.forEach(unit => {
    if(unit.a === 'w'){
      let word = utils.word2proto(unit.c);
      if(wordList.indexOf(word) < 0){
        wordList.push(word);
      }
    }
  });
  return wordList.join(' ');
};

module.exports = utils;
