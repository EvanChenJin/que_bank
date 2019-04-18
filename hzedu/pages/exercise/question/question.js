var util = require('../../../utils/util.js')
var tip = require('../../../utils/tip.js')
var exam = require('../../../utils/exam.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    clientHeight: '',
    examQuestionsArray: [],
    examQuestionsTotal: 0,
    currentIndex: 0,
    duration: 0,            
    paper_id: '',
    isAnswerCardOpen: false,    // 答题卡
    title: '',                  // 答题卡标题
    tid: '',                    // 第一级分类用于收藏提交参数
    time: '',                   // 计时器 答题时间 开始作答时间 作题所用时间
    hour: '00',                
    minute: '00',
    second: '00',
    timeCount: '',            
    doExamTimestamp: '',      
    useTime: 0,               
    isSumbitExam: false,       // 是否提交试卷
    score: 0                   // 试卷总分
  },
  // 试题切换
  handleQuestionChange (e) {
    this.setData({
      currentIndex: parseInt(e.detail.current, 10)
    })
  },
  // 答题卡试题切换
  handleAnswerCard (e) {
    var toggleIndex = parseInt(e.currentTarget.dataset.index);
    this.setData({
      currentIndex: toggleIndex
    })
  },
  // 显示答题卡
  handleOpenAnswerCard(e) {
    this.setData({
      isAnswerCardOpen: true
    })
  },
  // 关闭答题卡
  handleCloseAnswerCard(e) {
    this.setData({
      isAnswerCardOpen: false
    })
  },
  // 收藏取消试题
  handleCollect(e) {
    exam.collectQueRelate(this)
  },
  // 单选或判断作答
  handleSelectOption (e) {
    console.log(e.currentTarget.dataset.index);
    var examQuestionsArray = this.data.examQuestionsArray;
    var examQuestionsTotal = this.data.examQuestionsTotal;
    var currentIndex = this.data.currentIndex;
    var curQueItem = examQuestionsArray[currentIndex];
    // 选中项的 index
    var selectedIndex = parseInt(e.currentTarget.dataset.index, 10);
    // 需要设置的属性
    var common = 'examQuestionsArray[' + currentIndex + ']';
    var selOptKey = common + '.options[' + selectedIndex + '].isSelected';
    var selQueAnswer = common + '.myAnswer';
    var selQueLetterAnswer = common + '.myLetterAnswer';
    var selQueKey = common + '.isDone';
    var selQueCorrect = common + '.isCorrect';
    // 单选题或判断题
    if (curQueItem.radio === "0" || curQueItem.radio === "2") {
      // 判断是否是第一次做题
      if (!curQueItem.isDone) {
        // 储存答案
        curQueItem.myAnswer.push(selectedIndex + '');
        curQueItem.myLetterAnswer.push(util.myLetterAry[selectedIndex]);
        // 已经作答
        this.setData({
          [selOptKey]: true,
          [selQueKey]: true,
          [selQueAnswer]: curQueItem.myAnswer,
          [selQueLetterAnswer]: curQueItem.myLetterAnswer
        })
        // 判断答案是否正确
        if (curQueItem.myLetterAnswer[0] == curQueItem.letterAnswer[0]) {
          // 答案正确
          this.setData({
             [selQueCorrect]: true
          })
        } else {
          this.setData({
            [selQueCorrect]: false
          })
        }
        // 自动切换到下一题
        this.setData({
          duration: 300
        })
        if (currentIndex < examQuestionsTotal-1) {
          exam.toggleToQuestionNext(this)
        } else {
           // 1. 最后一题提交试卷
          this._handleSumbitExam()
        }
      } else {
        tip.showToast('当前题已经作答', 'none', 1000)
        return false
      }
    } else if (curQueItem.radio === "1") {
      if (!curQueItem.isDone) {
        this.setData({
          [selOptKey]: !curQueItem.options[selectedIndex].isSelected
        })
      } else {
        tip.showToast('当前题已经作答', 'none', 1000)
        return false
      }
    }
  },
  //  多选作答
  handleMultiSelect (e) {
    var examQuestionsArray = this.data.examQuestionsArray;
    var currentIndex = this.data.currentIndex;
    var examQuestionsTotal = this.data.examQuestionsTotal;
    var curQueItem = examQuestionsArray[currentIndex];
    if (!examQuestionsArray[currentIndex].isDone) {
      // 需要设置的属性
      var common = 'examQuestionsArray[' + currentIndex + ']';
      var selQueAnswer = common + '.myAnswer';
      var selQueLetterAnswer = common + '.myLetterAnswer';
      var selQueKey = common + '.isDone';
      var selQueCorrect = common + '.isCorrect';
      var optionsArray = curQueItem.options;
      // 选中的答案
      for (var i = 0; i < optionsArray.length; i++) {
        if (optionsArray[i].isSelected) {
          curQueItem.myAnswer.push(i + '');
        }
      }
      if (curQueItem.myAnswer.length) {
        for (var j = 0; j < curQueItem.myAnswer.length; j++) {
          var answerIndex = parseInt(curQueItem.myAnswer[j]);
          curQueItem.myLetterAnswer.push(util.myLetterAry[answerIndex]);
        }
        this.setData({
          [selQueKey]: true,
          [selQueAnswer]: curQueItem.myAnswer,
          [selQueLetterAnswer]: curQueItem.myLetterAnswer
        })
      } else {
        tip.showToast('您还没选择选项', 'none', 1000)
        return false;
      }
      // 判断答案是否正确
      if (exam.isAnswerEqual(curQueItem.myLetterAnswer, curQueItem.letterAnswer)) {
          this.setData({
            [selQueCorrect]: true
          })
      } else {
          this.setData({
            [selQueCorrect]: false,
          })
      }
      // 下一题
      this.setData({
        duration: 300
      })
      if (currentIndex < examQuestionsTotal-1) {
        exam.toggleToQuestionNext(this)
      } else {
        // 最后一道题
        this.setData({
          currentIndex: examQuestionsTotal - 1
        })
        // 1. 最后一题提交试卷
        this._handleSumbitExam()
      }
    } else {
      tip.showToast('当前题已经作答', 'none', 1000)
      return false
    }
  },
  // 2. 提交按钮提交试卷
  handleSubmitExam (e) {
    this._handleSumbitExam();
  },
  // 提交试卷方法
  _handleSumbitExam() {
    var that = this;
    var examQuestionsArray = that.data.examQuestionsArray;
    // 提交参数
    var examSubmitSend = {
      paper_id: 6,
      total_count: that.data.examQuestionsTotal,
      is_set: 0,
      start_time: that.data.doExamTimestamp,
      use_time: that.data.useTime
    }
    var condition = [];
    var true_count = 0;
    var score = 0;
    var true_qid = [];
    var false_qid = [];
    for (var i = 0; i < examQuestionsArray.length; i++) {
      condition.push(examQuestionsArray[i].myAnswer)
      if (examQuestionsArray[i].isCorrect) {
        true_count++;
        score += examQuestionsArray[i].score;
        true_qid.push(examQuestionsArray[i].qid);
      } else {
        false_qid.push(examQuestionsArray[i].qid);
      }
    }
    examSubmitSend.condition = condition;
    examSubmitSend.true_count = true_count;
    examSubmitSend.score = score;
    examSubmitSend.true_qid = true_qid;
    examSubmitSend.false_qid = false_qid;
    that.setData({
      score: score
    })
    console.log(examSubmitSend);
    if ((that.data.useTime-1) == that.data.time) {
      that._sumbitExamRecord(that, examSubmitSend, '提交试卷', '答题时间到，将自动交卷！',
        false, '', '确认提交')
    } else {
      if (exam.isAllDone(examQuestionsArray)) {
        that._sumbitExamRecord(that, examSubmitSend, '提交试卷', '答题完成了，确认交卷？',
          true, '取消', '确认提交')
      } else {
        that._sumbitExamRecord(that, examSubmitSend, '提交试卷', '答题尚未完成，确认现在交卷？',
          true, '继续答题', '确认提交')
      }
    }
  },
  // 提交试卷请求
  _sumbitExamRecord(page, submitData, title, content, showCancel, cancelText, confirmText) {
    wx.showModal({
      title: title,
      content: content,
      showCancel: showCancel,
      cancelText: cancelText,
      success: function (res) {
        if (res.confirm) {
          util.http(
            '试卷提交中', '提交失败',
            '/api/exam/submitexam',
            { 'data': util.pass_token(submitData) },
            function () {
              page.setData({
                isSumbitExam: true
              })
              clearInterval(page.data.timeCount);
              var score = page.data.score;
              var title = page.data.title;
              var time = page.data.time
              var paper_id = page.data.paper_id + '';
              var optionsParam = '&title=' + title + '&score=' + score + '&paper_id=' + paper_id + '&time='+time;
              wx.setStorageSync(paper_id, page.data.examQuestionsArray);
              setTimeout(function () {
                wx.redirectTo({
                  url: '/pages/exercise/exerGrade/exerGrade?' + optionsParam
                })
              }, 1000)
            }
          )
        } 
      }
    })
  },
  // 请求考试试题
  _getExamQuestions(page, apiPath, examPaperSend) {
    util.http(
      '试题加载中', '暂无试题',
      apiPath,
      { 'data': util.pass_token(examPaperSend) },
      function (examPaperRes) {
        var examPaperData = examPaperRes.qinfo;
        // 设置倒计时时间
        var ptime = parseInt(examPaperRes.ptime);
        page.setData({
          time: ptime
        })
        // 试题数组
        var letterAry = util.myLetterAry;
        var examQueAry = [];
        for (var i = 0; i < examPaperData.length; i++) {
          for (var j = 0; j < examPaperData[i].questions.length; j++) {
            var questionItem = examPaperData[i].questions[j];
            // 公共题干
            if (examPaperRes.mid) {
              var mid = examPaperRes.mid;
              var examItemQtitle = questionItem.qtitle;
              var midKey = 'mid_' + questionItem.mid
              if (mid[midKey]) {
                examItemQtitle = mid[midKey].mname + examItemQtitle;
                examPaperData[i].questions[j].qtitle = examItemQtitle;
              }
            }
            // 判断题型
            if (examPaperData[i].radio) {
              var queRadio = parseInt(examPaperData[i].radio);
              questionItem.queType = util.queType[queRadio];
            }
            if (examPaperData[i].source) {
              questionItem.score = parseInt(examPaperData[i].source);
            }
            // 新增属性
            questionItem.radio = examPaperData[i].radio;  // 题型
            questionItem.myAnswer = [];            // 用户的答案
            questionItem.myLetterAnswer = [];      // 用户字母答案
            questionItem.letterAnswer = [];        // 正确字母答案
            questionItem.isDone = false;           // 是否已做
            questionItem.isCorrect = '';           // 答案是否正确
            // 设置正确答案 letterAnswer
            if (questionItem.answer && !tip.isEmptyArray(questionItem.answer)) {
              for (var h = 0; h < questionItem.answer.length; h++) {
                var answerIndex = parseInt(questionItem.answer[h]);
                questionItem.letterAnswer.push(letterAry[answerIndex])
              }
            }
            for (var k = 0; k < questionItem.options.length; k++) {
              // 试题选项添加属性
              examPaperData[i].questions[j].options[k] = {
                text: examPaperData[i].questions[j].options[k],
                isSelected: false,                                 // 选项是否被选
                isOptionCorrect: false                             // 选项是否正确
              }
            }
          }
          examQueAry = examQueAry.concat(examPaperData[i].questions)
        }
        // 填充数组
        page.setData({
          examQuestionsArray: examQueAry,
          examQuestionsTotal: examQueAry.length
        })
        // 考试时间倒计时
        var time = page.data.time;
        var useTime = page.data.useTime;
        var timeCount = page.data.timeCount;
        timeCount = setInterval(function () {
          if (time >= 0) {
            if (!page.data.isSumbitExam) {
              var hour = exam.formatNumber(Math.floor(time / 3600));
              var minute = exam.formatNumber(Math.floor(time % 3600 / 60));
              var second = exam.formatNumber(time % 60);
              page.setData({
                hour: hour,
                minute: minute,
                second: second
              })
              time--;
              useTime++;
              page.setData({
                useTime: useTime
              })
            } else {
              clearInterval(timeCount)
              page.setData({
                useTime: useTime
              })
            }
          } else {
            clearInterval(timeCount)
            page.setData({
              useTime: useTime
            })
            page._handleSumbitExam();
          }
        }, 1000)
      }
    )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    // 获取设备的高度
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          clientHeight: res.windowHeight - 54
        })
      },
    })
    // 试卷作答时间戳
    var doExamTimestamp = new Date().getTime();
    this.setData({
      doExamTimestamp: doExamTimestamp,
      tid: parseInt(options.tid),
      paper_id: parseInt(options.paper_id)
    })
    // 提交参数对象
    var examPaperSend = {};
    var apiPath = '';
    if (options.action == 'zt') {
      // 真题试卷
      wx.setNavigationBarTitle({
        title: options.title,
      })
      that.setData({
        title: options.title
      })
      examPaperSend.paper_id = parseInt(options.paper_id);
      examPaperSend.tips = options.tips;                        // 真题提交参数
      apiPath = '/api/exam/yearstruthinfo';                     // 真题接口地址
      that._getExamQuestions(that, apiPath, examPaperSend);
    } else if (options.action == 'zn') {
      // 智能组卷
      wx.setNavigationBarTitle({
        title: '智能组卷'
      })
      that.setData({
        title: '智能组卷'     
      })
      examPaperSend.tid = parseInt(options.tid);                 // 智能提交参数
      apiPath = '/api/exam/randompaperinfo';                     // 智能组卷接口地址
      that._getExamQuestions(that, apiPath, examPaperSend);
    } else {
      // 再来一次
      var paper_id = options.paper_id + '';
      var examQuestionsArray = wx.getStorageSync(paper_id);
      var time = parseInt(options.time);
      // 对数组初始化
      for (var i = 0; i < examQuestionsArray.length; i++) {
        examQuestionsArray[i].myAnswer = [];
        examQuestionsArray[i].myLetterAnswer = [];
        examQuestionsArray[i].isDone = false,
        examQuestionsArray[i].isCorrect = '';
        for (var j = 0; j < examQuestionsArray[i].options.length; j++) {
          examQuestionsArray[i].options[j].isSelected = false;
          examQuestionsArray[i].options[j].isOptionCorrect = false;
        }
      }
      that.setData({
        examQuestionsArray: examQuestionsArray,
        examQuestionsTotal: examQuestionsArray.length,
        duration: 0,
        time: time
      })
      // 考试倒计时
      var time = that.data.time;
      var useTime = that.data.useTime;
      var timeCount = that.data.timeCount;
      timeCount = setInterval(function () {
        if (time >= 0) {
          if (!that.data.isSumbitExam) {
            var hour = exam.formatNumber(Math.floor(time / 3600));
            var minute = exam.formatNumber(Math.floor(time % 3600 / 60));
            var second = exam.formatNumber(time % 60);
            that.setData({
              hour: hour,
              minute: minute,
              second: second
            })
            time--;
            useTime++;
            that.setData({
              useTime: useTime
            })
          } else {
            clearInterval(timeCount)
            that.setData({
              useTime: useTime
            })
          }
        } else {
          clearInterval(timeCount)
          that.setData({
            useTime: useTime
          })
          that._handleSumbitExam()
          that.setData({
            isSumbitExam: true
          })
        }
      }, 1000)
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 如果未提交，清理掉定时器
    this.setData({
      isSumbitExam: true,
      timeCount: ''
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})