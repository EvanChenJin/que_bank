var util = require('../../../utils/util.js')
var tip = require('../../../utils/tip.js')
var exam = require('../../../utils/exam.js')
// pages/exercise/exerCtb/exerCtb.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
      clientHeight: 0,
      action: '',
      examQuestionsArray: [],
      examQuestionsTotal: 0,
      currentIndex: 0,
      duration: 0,
      tid: '',                  // 一级分类id,用于收藏参数
      chid: '',                 // 章节联系题提交参数
      isContinue: '',             // 是否继续上次作题
      p: 1,                     // 分页参数
      name: '',                 // 页面标题
      isReqDataEmpty: false,    // 标识请求的数据是否为空
      isAnswerCardOpen: false,  // 答题卡
      correctNumber: 0,         // 正确答题数
      incorrectNumber: 0        // 错误答题数
  },
  // 试题切换
  handleQuestionChange(e) {
    this.setData({
      currentIndex: parseInt(e.detail.current, 10)
    })
  },

  // 答题卡试题切换
  handleAnswerCard(e) {
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
    var that = this;
    if (that.data.action == 'collect') {
      var examQuestionsArray = that.data.examQuestionsArray;
      var currentIndex = that.data.currentIndex;
      var qid = examQuestionsArray[currentIndex].qid;
      // 取消收藏
      util.http(
        '取消收藏', '取消失败',
        '/api/exam/cancelcollectquestion',
        { 'data': util.pass_token({qid: [qid]}) },
        function () {
          examQuestionsArray.splice(currentIndex, 1);
          if (currentIndex > 0) {
            that.setData({
              currentIndex: currentIndex - 1
            })
          } else {
            that.setData({
              currentIndex: 0
            })
          }
          that.setData({
            examQuestionsArray: examQuestionsArray,
            examQuestionsTotal: examQuestionsArray.length,
          })
        }
      )
    } else {
      exam.collectQueRelate(that)
    }
  },

  // 单选或判断作答
  handleSelectOption(e) {
    // common
    var examQuestionsArray = this.data.examQuestionsArray;
    var examQuestionsTotal = this.data.examQuestionsTotal;
    var currentIndex = this.data.currentIndex;
    var curQueItem = examQuestionsArray[currentIndex];
    var correctNumber = this.data.correctNumber;
    var incorrectNumber = this.data.incorrectNumber;

    // 选中项的 index
    var selectedIndex = parseInt(e.currentTarget.dataset.index);
    console.log(selectedIndex);
    var commonKey = 'examQuestionsArray[' + currentIndex + ']';
    // 选中的option项
    var selKey = commonKey + '.qinfo.options[' + selectedIndex + '].isSelected'; 
    // 选中的项option项是否正确
    var optionKey = commonKey + '.qinfo.options[' + selectedIndex + '].isOptionCorrect';
    // 用户答案
    var selQueAnswer = commonKey + '.myAnswer';
    var selQueLetterAnswer = commonKey + '.myLetterAnswer';
    // 用户是否已做题  
    var selQueKey = commonKey + '.isDone';
    // 用户做过的题是否正确
    var selQueCorrect = commonKey + '.isCorrect';

    // 单选题或判断题
    if (curQueItem.radio === "0" || curQueItem.radio === "2"){
        // 判断是否是第一次做题
       if (!curQueItem.isDone) {
        // 储存用户答案 
        curQueItem.myAnswer.push(selectedIndex + '');
        curQueItem.myLetterAnswer.push(util.myLetterAry[selectedIndex]);
        // 已经作答
        this.setData({
          [selKey]: true,
          [selQueKey]: true,
          [selQueAnswer]: curQueItem.myAnswer,
          [selQueLetterAnswer]: curQueItem.myLetterAnswer
        })
        // 判断答案是够正确
        if (curQueItem.myLetterAnswer[0] == curQueItem.qinfo.letterAnswer[0]) {
          // 正确
          correctNumber++;
          this.setData({
            [selQueCorrect]: true,
            [optionKey]: true,
            correctNumber: correctNumber
          }) 
          // 自动切换到下一题
          this.setData({
            duration: 300
          })
          if (currentIndex < examQuestionsTotal-1) {
             exam.toggleToQuestionNext(this)
          } else {
             exam.isLastQueston(this);
          }
        } else {
          // 错误  显示正确选项和选中选项
          var correctAnswer = curQueItem.qinfo.answer[0]; 
          var queRightKey = commonKey + '.qinfo.letterAnswer';
          var singleOptionKey = commonKey + '.qinfo.options[' + correctAnswer + ']';
          var rightKey = singleOptionKey + '.isSelected';
          var rightOption = singleOptionKey + '.isOptionCorrect';
          incorrectNumber++;
          this.setData({
            [selQueCorrect]: false,
            [rightKey]: true,
            [rightOption]: true,
            incorrectNumber: incorrectNumber
          })
          // 显示解析
          this.setData({
            [selQueLetterAnswer]: curQueItem.myLetterAnswer[0],
            [queRightKey]: curQueItem.qinfo.letterAnswer[0]
          })
        } 
        // 最后一题
        if (currentIndex == examQuestionsTotal-1) {
          exam.isLastQueston(this);         
        }
       } else {
          tip.showToast('当前题已经作答', 'none', 1000)
          return false
       }
    } 
    //  多选题
    else if (curQueItem.radio === "1") {
      if (!curQueItem.isDone) {
        this.setData({
          [selKey]: !curQueItem.qinfo.options[selectedIndex].isSelected
        })
      } else {
        tip.showToast('当前题已经作答', 'none', 1000)
        return false
      }
    }
  },

  // 多选作答
  handleMultiSelect(e) {
    // 常用 data 数据
    var examQuestionsArray = this.data.examQuestionsArray;
    var currentIndex = this.data.currentIndex;
    var examQuestionsTotal = this.data.examQuestionsTotal;
    var curQueItem = examQuestionsArray[currentIndex];
    var correctNumber = this.data.correctNumber;
    var incorrectNumber = this.data.incorrectNumber;
    // 是否第一次作题
    if (!curQueItem.isDone) {
        // 每道题的字段 key
        var commonKey = 'examQuestionsArray[' + currentIndex + ']';
        var selQueAnswer = commonKey + '.myAnswer';
        var selQueLetterAnswer = commonKey + '.myLetterAnswer';
        var selQueKey = commonKey + '.isDone';
        var selQueCorrect = commonKey + '.isCorrect';
        var optionsArray = curQueItem.qinfo.options;
        // 储存用户答案
        for (var i = 0; i < optionsArray.length; i++) {
          if (optionsArray[i].isSelected) {
            curQueItem.myAnswer.push(i + '');
            curQueItem.myLetterAnswer.push(util.myLetterAry[i]);     // 填写myLetterAnswer
            if (curQueItem.myAnswer.length) {
              this.setData({
                [selQueKey]: true,
                [selQueAnswer]: curQueItem.myAnswer,
                [selQueLetterAnswer]: curQueItem.myLetterAnswer
              })
            } else {
              tip.showToast('您还没选择选项', 'none', 1000)
              return false;
            }
          }
        }

        // 调试  用户答案和正确答案
        console.log(curQueItem.myAnswer, curQueItem.qinfo.answer);
      
        // 用户答案
        for (var j = 0; j < curQueItem.myAnswer.length; j++) {
          var myAnswerItem = curQueItem.myAnswer[j];                         // 用户答案 index
          var mulOptKey = commonKey + '.qinfo.options[' + myAnswerItem + ']' // 用户答案 key
          var selKey = mulOptKey + '.isSelected';                            // 用户答案 isSelected 字段
          var corKey = mulOptKey + '.isOptionCorrect';                       // 用户答案 isOptionCorrect 字段
          var examCorrectAnswer = curQueItem.qinfo.answer;
          if (examCorrectAnswer.indexOf(myAnswerItem) > -1) {
            this.setData({
              [selKey]: true,
              [corKey]: false
            })
          } else {
            this.setData({
              [selKey]: true,
              [corKey]: true
            })
          }
        }
      // 判断答案是够正确
      if (exam.isAnswerEqual(curQueItem.myLetterAnswer, curQueItem.qinfo.letterAnswer)) {
        // 答案正确
        correctNumber++;
        this.setData({
          [selQueCorrect]: true,
          correctNumber: correctNumber
        })
        // 自动切换下一题
        this.setData({
          duration: 300
        })
        if (currentIndex < examQuestionsTotal-1) {
          exam.toggleToQuestionNext(this);
        } else {
          exam.isLastQueston(this);
        }
      } else {
        // 答案错误
        incorrectNumber++;
        this.setData({
          [selQueCorrect]: false,
          incorrectNumber: incorrectNumber
        })
        // 显示答案和解析
        var rightQueletterAnswer = commonKey + '.qinfo.letterAnswer';
        var userAnswer = '';
        var rightAnswer = '';
        for (var x = 0; x < curQueItem.myLetterAnswer.length; x++) {
          userAnswer += curQueItem.myLetterAnswer[x]
        }
        for (var y = 0; y < curQueItem.qinfo.letterAnswer.length; y++) {
          rightAnswer += curQueItem.qinfo.letterAnswer[y];
        }
        this.setData({
          [selQueLetterAnswer]: userAnswer,
          [rightQueletterAnswer]: rightAnswer
        })
      }
      // 最后一道题
      if (currentIndex == examQuestionsTotal - 1) {
        exam.isLastQueston(this);
      }  
    } else {
      tip.showToast('当前题已经作答', 'none', 1000)
      return false
    }
  },

  // 清空做题记录
  handleClearRecord (e) {
    var that = this;
    wx.showModal({
      title: '作题记录清空提示',
      content: '您确定清空作题记录吗？',
      success: function (res) {
        if (res.confirm) {
          that.setData({
            correctNumber: 0,
            incorrectNumber: 0
          })
          var examQuestionsArray = that.data.examQuestionsArray;
          for (var i = 0; i < examQuestionsArray.length; i++) {
            var isDone = 'examQuestionsArray[' + i + '].isDone';
            var isCorrect = 'examQuestionsArray[' + i + '].isCorrect';
            var myAnswer = 'examQuestionsArray[' + i + '].myAnswer';
            var myLetterAnswer = 'examQuestionsArray[' + i + '].myLetterAnswer';
            // 每道题的字段
            that.setData({
              [isDone]: false,
              [isCorrect]: '',
              [myAnswer]: [],
              [myLetterAnswer]: []
            })
            // 每道题选择项的字段
            for (var j = 0; j < examQuestionsArray[i].qinfo.options.length; j++) {
              var isSelected = 'examQuestionsArray[' + i + '].qinfo.options[' + j + '].isSelected';
              var isOptionCorrect = 'examQuestionsArray[' + i + '].qinfo.options[' + j + '].isOptionCorrect';
              that.setData({
                [isSelected]: false,
                [isOptionCorrect]: false
              })
            }
          }
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options);
      var that = this;
      // url 参数
      that.setData({
        action: options.action,
        tid: options.tid,
      })
    if (options.isContinue) {
      that.setData({
        isContinue: options.isContinue
      })
    }
      // 页面标题
      if (options.action == 'chapter') {
        wx.setNavigationBarTitle({
          title: options.name
        })
        that.setData({
          chid: parseInt(options.chid),
          name: options.name,
        })
        // 继续上一次
        if (options.lastNum && options.lastNum != '0') {
          wx.showModal({
            title: '做题提示',
            content: '检测到您上次做到第' + options.lastNum + '题，是否继续',
            success: function (res) {
              if (res.confirm) {
                that.setData({
                  current: parseInt(options.lastNum)
                })
              }
            }
          })
        }
      } else if (options.action == 'wrong') {
        wx.setNavigationBarTitle({
          title: '错题本'
        })
      } else if (options.action == 'collect') {
        wx.setNavigationBarTitle({
          title: '收藏题'
        })
        that.setData({
          currentIndex: parseInt(options.currentIndex)
        })
      }
      // 获取设备的高度
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            clientHeight: res.windowHeight - 54
          })
        }
      })
      // 请求数据
      exam.getQuestions(that.data.action, that)
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
    if (this.data.action == 'chapter') {
      exam.submitExerciseRecord(this)
    }
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