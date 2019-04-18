var util = require('./util.js')
var tip = require('./tip.js')
// 数字格式化
function formatNumber (n) {
  if (n < 10) {
    return '0' + n
  } else {
    return n
  }
}
// 判断答案是否正确
function isAnswerEqual(myAnswer, rightAnswer) {
  if (myAnswer && rightAnswer) {
    if (myAnswer.toString() === rightAnswer.toString()) {
      return true;
    } else {
      return false;
    }
  }
}
// 试题切换
function toggleQuestion(page, currentIndex) {
  page.setData({
    currentIndex: currentIndex
  })
}
// 自动切换到下一题
function toggleToQuestionNext(page) {
  page.data.currentIndex++;
  toggleQuestion(page, page.data.currentIndex)
  page.setData({
    duration: 0
  })
}
// 判断是否最后一题
function isLastQueston(page) {
  var isReqDataEmpty = page.data.isReqDataEmpty;
  var action = page.data.action;
  var examQuestionsTotal = page.data.examQuestionsTotal;
  if (!isReqDataEmpty && examQuestionsTotal >= 100 && examQuestionsTotal % 100 === 0) {
    // 有数据请求新的数据
    getQuestions(action, page)
  } 
}
// 收藏相关
function collectQueRelate (page) {
  var examQuestionsArray = page.data.examQuestionsArray;
  var currentIndex = page.data.currentIndex;
  var curQueItem = examQuestionsArray[currentIndex];
  var collectKey = 'examQuestionsArray[' + currentIndex + '].is_collection';
  var collectSend = {
    qid: curQueItem.qid
  }
  if (curQueItem.is_collection == '0') {
    // 收藏试题
    var status = '';
    if (curQueItem.isDone) {
      status = 1
    } else {
      status = 0
    }
    if (page.data.p) {
      collectSend.p = page.data.p;
    } else {
      collectSend.p = 1
    }
    collectSend.status = status;
    collectSend.tid = parseInt(page.data.tid);
    util.http(
      '试题收藏中', '收藏失败',
      '/api/exam/collectquestion',
      { 'data': util.pass_token(collectSend) },
      function () {
        page.setData({
          [collectKey]: '1'
        })
      }
    )
  } else if (curQueItem.is_collection == '1') {
    // 取消收藏
    util.http(
      '取消收藏', '',
      '/api/exam/cancelcollectquestion',
      { 'data': util.pass_token(collectSend) },
      function () {
        page.setData({
          [collectKey]: '0'
        })
      }
    )
  }
}
// 试题是否全部做完
function isAllDone (examQueArray) {
  for ( var i = 0; i < examQueArray.length; i++) {
    if (!examQueArray[i].isDone) return false
  }
  return true
}
// 请求试题
function getQuestions(action, page) {
  var api = '';
  var postSend = { p: page.data.p };
  switch (action) {
    case 'chapter':
      api = '/api/exam/getmyquestion';
      postSend.chid = page.data.chid;
      break;
    case 'collect':
      api = '/api/exam/collectlist';
      postSend.tid = page.data.tid;
      break;
    case 'wrong':
      api = '/api/exam/getmymistakelist';
      break;
    default:
      break;
  }
  util.getList(
    page, page.data.p,
    '试题加载中', '暂无试题',
    api,
    { 'data': util.pass_token(postSend) },
    function (questionRes) {
      var mid = questionRes.mid;
      var examPaperData = questionRes.questions;
      var letterAry = util.myLetterAry; 
      // 公共题干
      if ((!tip.isEmptyArray(questionRes) || tip.isEmptyObject(questionRes)) && mid) {
        for (var k = 0; k < examPaperData.length; k++) {
          var midKey = 'mid_' + examPaperData[k].mid;
          if (mid && mid[midKey]) {
            var examItemQtitle = examPaperData[k].qinfo.qtitle;
            examItemQtitle = examItemQtitle + mid[midKey].mname ; 
            examPaperData[k].qinfo.qtitle = examItemQtitle;
          }
        }
      }
      // 试题数组
      for (var i = 0; i < examPaperData.length; i++) {
        examPaperData[i].isDone = false;           // 是否已做
        examPaperData[i].myAnswer = [];            // 用户的答案
        examPaperData[i].myLetterAnswer = [];      // 用户的答案字母表示
        examPaperData[i].qinfo.letterAnswer = [];  // 正确答案的字母表示
        examPaperData[i].isCorrect = '';           // 答案是否正确
        // 正确字母答案
        for (var a = 0; a < examPaperData[i].qinfo.answer.length; a++) {
          var letterIndex = parseInt(examPaperData[i].qinfo.answer[a]);
          examPaperData[i].qinfo.letterAnswer.push(letterAry[letterIndex])
        } 
        if (examPaperData[i].radio) {
          var queType = parseInt(examPaperData[i].radio);
          examPaperData[i].queType = util.queType[queType];
        }
        if (page.data.action == 'collect') {
          // 给收藏题增加属性
          examPaperData[i].isTap = false; 
        }
        // 试题选项添加的属性
        if (examPaperData[i].qinfo.options) {
          for (var j = 0; j < examPaperData[i].qinfo.options.length; j++) {
            examPaperData[i].qinfo.options[j] = {
              text: examPaperData[i].qinfo.options[j],
              isSelected: false,                            
              isOptionCorrect: false,                       
            }
          }
        }
      }
      page.data.p++;
      page.setData({
        examQuestionsArray: page.data.examQuestionsArray.concat(examPaperData),
        examQuestionsTotal: page.data.examQuestionsTotal + examPaperData.length,
        p: page.data.p
      })
      if (page.data.action == 'chapter' && page.data.isContinue) {
        // 是否继续上次作题
        page.setData({
          currentIndex: parseInt(questionRes.questions_order)
        })
        // var lastOrder = parseInt(questionRes.questions_order);
        // if (lastOrder < page.data.examQuestionsTotal) {
        //   page.setData({
        //     currentIndex: lastOrder + 1
        //   })
        // } else {
        //   page.setData({
        //     currentIndex: lastOrder
        //   })
        // }
      }
    }
  )
}
// 提交练习记录
function submitExerciseRecord (page) {
  var tids = [];
  var examQueArr = page.data.examQuestionsArray;
  for (var i = 0; i < examQueArr.length; i++) {
    if (examQueArr[i].isDone) {
      var tidsItem = {
        qid: parseInt(examQueArr[i].qid),
        answer: examQueArr[i].myAnswer.toString()
      };
      if (examQueArr[i].isCorrect) {
        tidsItem.is_true = 1
      } else {
        tidsItem.is_true = 0
      }
      tids.push(tidsItem)
    }
  }
  if (tip.isEmptyArray(tids)) return false;   // 参数为空则不提交
  var recordSend = {
    tids: tids
  }
  util.http(
    '提交中', '提交失败',
    '/api/exam/submitquestions',
    { 'data': util.pass_token(recordSend) }
  )
}

module.exports = {
  formatNumber: formatNumber,
  isAnswerEqual: isAnswerEqual,
  toggleQuestion: toggleQuestion,
  collectQueRelate: collectQueRelate,
  getQuestions: getQuestions,
  toggleToQuestionNext: toggleToQuestionNext,
  isLastQueston: isLastQueston,
  isAllDone: isAllDone,
  submitExerciseRecord: submitExerciseRecord
}

 