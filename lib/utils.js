let tokenizer = require('./tokenizer');
let fs = require('fs');

let utils = {};

let word2proto = {};
let proto2detail = {};

let dictpath;
let similarity;

utils.init = function (dictPath) {
  dictpath = dictPath;
  similarity = require(dictpath + '/similarity.json');
};

utils.word2proto = function (word) {
  word = word.trim().toLocaleLowerCase();
  if (word2proto[`-${word}-`]) {
    word = word2proto[`-${word}-`];
  } else {
    let wordPath = dictpath + '/word/' + word + '.json';
    if (fs.existsSync(wordPath)) {
      let proto = JSON.parse(fs.readFileSync(wordPath, 'utf8'))[0];
      word2proto[`-${word}-`] = proto;
      word = proto;
    }
  }
  return word;
};

utils.proto2detail = function (proto) {
  let result = {};
  if (`-${proto}-` in proto2detail) {
    result = proto2detail[`-${proto}-`];
  } else {
    if (fs.existsSync(dictpath + '/proto/' + proto + '.json'))
      result = JSON.parse(fs.readFileSync(dictpath + '/proto/' + proto + '.json', 'utf8'));
    proto2detail[`-${proto}-`] = result;
  }
  return result;
};

utils.forSearchKey = function (article) {
  let wordList = [];
  let vector = tokenizer.word(article);
  vector.forEach(unit => {
    if (unit.a === 'w') {
      let word = utils.word2proto(unit.c);
      if (wordList.indexOf(word) < 0) {
        wordList.push(word);
      }
    }
  });
  return wordList.join(' ');
};

utils.similarityWord = function (word) {
  let result = [];
  let asc = [];
  for (let j = 0; j < 26; j++) asc[j] = 0;
  let nokey = word.toLocaleLowerCase().replace(/[^a-z]/g, '').split('');
  let key = [];
  nokey.forEach(c => {
    let ascii = c.charCodeAt(0) - 97;
    if (ascii > -1 && ascii < 26 && asc[ascii] === 0) {
      asc[ascii] = 1;
      key.push(c);
    }
  });
  let keyLen = key.length;
  if (keyLen > 0) {
    key.sort();
    let sKey = key.join('');
    if (fs.existsSync(dictpath + '/similarity/' + sKey + '.json')) {
      result = JSON.parse(fs.readFileSync(dictpath + '/similarity/' + sKey + '.json', 'utf8'));
      result.shift();
    } else {
      for (let nextKey in similarity) {
        let next = similarity[nextKey];
        let notSame = 0;
        for (let j = 0; j < 26; j++) {
          if (asc[j] !== next[0][j])
            notSame++;
        }
        if (notSame < 2 || (notSame < 3 && keyLen === nextKey.length)) {
          for (let i = 1; i < next.length; i++) {
            result.push(next[i]);
          }
        }
      }
    }
  }
  return result;
};

module.exports = utils;
