const tokenizer = require('./tokenizer');
const utils = require('./utils');

let grade = {};

let dictpath;
let syllabus;

grade.init = function (dictPath) {
  dictpath = dictPath;
  syllabus = require(dictpath + '/syllabus.json');
};

/**
 * 获得单词的大纲级别[0]学段[1]第几个，0-5小学，初中，高中，CET4，CET6，考研
 * @param proto
 * @returns {number[]}
 */
grade.word2Site = function (proto) {
  let result = [-1, -1];
  for (let i = 0; i < 6; i++) {
    let site = syllabus[i].indexOf(proto);
    if (site > -1) {
      result = [i, site];
      break;
    }
  }
  return result;
};

grade.site2Word = function (site) {
  return syllabus[site[0]][site[1]];
};

grade.length = function (site) {
  return syllabus[site].length;
};

grade.score = function (article) {
  let wordsCount = [];
  let wordsForSearch = [];
  let conjunctionCount = 0;
  let scores = [];

  tokenizer.paragraph(article).forEach(paragraph => {
    let paragraphWordsCount = [];
    tokenizer.sentence(paragraph).forEach(sentence => {
      let sentenceWordsCount = 0;
      tokenizer.word(sentence).forEach(word => {
        if(word.a === 'w'){
          sentenceWordsCount++;
          let proto = utils.word2proto(word.a);
          let detail = utils.proto2detail(proto);
          if (('property' in detail) && detail.property === 'conj') conjunctionCount++;
          if (wordsForSearch.indexOf(proto) < 0){
            wordsForSearch.push(proto);
            if(('score' in detail) && detail.score > 0 && detail.score < 130) scores.push(detail.score);
          }
        }
      });
      paragraphWordsCount.push(sentenceWordsCount);
    });
    wordsCount.push(paragraphWordsCount);
  });

  scores.sort((a, b) => a - b); //从小到大
  let tempLength = scores.length;
  let begin = parseInt(tempLength * 0.05);
  let end = parseInt(tempLength * 0.20);
  if (end < 2) end = tempLength;//如果文章太短，就用全部有效词汇
  let numberBase = end - begin;
  let score = 0;
  for (let i = tempLength - 1 - begin; i > tempLength - 1 - end; i--) {
    score += scores[i];
  }
  if (numberBase > 0) {
    score = score / numberBase;
  }
  return {wordsCount, wordsForSearch, conjunctionCount, score};
}

module.exports = grade;
