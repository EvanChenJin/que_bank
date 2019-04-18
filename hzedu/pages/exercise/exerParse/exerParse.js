var app = getApp()
var exam = require('../../../utils/exam.js')
// pages/exercise/exerParse/exerParse.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    clientHeight: '',
    tid: '',
    paper_id: '',
    examQuestionsArray: [],
    examQuestionsTotal: 0,
    currentIndex: 0,
    duration: 0,
    name: '',
    isAnswerCardOpen: false,
    correctNumber: 0,         
    incorrectNumber: 0
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
    exam.collectQueRelate(this)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 获取设备的高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight - 54
        })
      },
    })
    console.log(options);
    var pact = options.pact;
    var examQuestionsArray = wx.getStorageSync(options.paper_id);
    console.log(examQuestionsArray);
    that.setData({
      examQuestionsArray: examQuestionsArray
    })
    var examQuestionsWrong = [];
    var correctNumber = 0;
    var incorrectNumber = 0;
    for (var i = 0; i < examQuestionsArray.length; i++) {
      var common = 'examQuestionsArray[' + i + ']';
      if (examQuestionsArray[i].isDone) {
          // 已做
          if (examQuestionsArray[i].isCorrect) {
            // 答案正确
            correctNumber++;
            for (var j = 0; j < examQuestionsArray[i].myAnswer.length; j++) {
              console.log(examQuestionsArray[i].myAnswer[j]);
              if (parseInt(examQuestionsArray[i].myAnswer[j])) {
                var corOptIndex = parseInt(examQuestionsArray[i].myAnswer[j])
                var corOptItem = common + '.options[' + corOptIndex + '].isSelected'
                var corOptRight = common + '.options[' + corOptIndex + '].isOptionCorrect';
                that.setData({
                  [corOptItem]: true,
                  [corOptRight]: true
                })
              }
            }
          } else {
            // 答案错误
            examQuestionsWrong.push(examQuestionsArray[i]);
            incorrectNumber++;
            if (examQuestionsArray[i].radio == '0' || examQuestionsArray[i].radio == '2') {
              // 单选题
              var myWrongOptIndex = examQuestionsArray[i].myAnswer[0];
              var rightOptIndex = examQuestionsArray[i].answer[0];
              var myWrongOptItem = common + '.options[' + myWrongOptIndex + '].isSelected';
              var myWrongOptRight = common + '.options[' + myWrongOptIndex + '].isOptionCorrect';
              var rightOptItem = common + '.options[' + rightOptIndex + '].isSelected';
              var rightOptRight = common + '.options[' + rightOptIndex + '].isOptionCorrect';
              that.setData({
                [myWrongOptItem]: true,
                [myWrongOptRight]: false,
                [rightOptItem]: true,
                [rightOptRight]: true
              })
            } else if (examQuestionsArray[i].radio == '1' && examQuestionsArray[i].answer.length >=2 ) {
              // 多选题
              for (var k = 0; k < examQuestionsArray[i].myAnswer.length; k++) {
                var wrongOptIndex = parseInt(examQuestionsArray[i].myAnswer[k]);
                var wrongOptItem = common + '.options[' + wrongOptIndex + '].isSelected'
                var wrongrOptRight = common + '.options[' + wrongOptIndex + '].isOptionCorrect';
                that.setData({
                  [wrongOptItem]: true,
                })
                if (examQuestionsArray[i].answer.indexOf(examQuestionsArray[i].myAnswer[k]) > -1) {
                  that.setData({
                    [wrongrOptRight]: true
                  })
                } else {
                  that.setData({ 
                    [wrongrOptRight]: false
                  })
                }
              }
            }
          }
      } else {
          // 未做
          for (var l = 0; l < examQuestionsArray[i].answer.length; l++) {
            if (examQuestionsArray[i].answer[l]) {
              var ansOptIndex = parseInt(examQuestionsArray[i].answer[l])
              var ansOptItem = common + '.options[' + ansOptIndex + '].isSelected';
              var ansOptRight = common + '.options[' + ansOptIndex + '].isOptionCorrect';
              console.log(ansOptIndex, ansOptItem, ansOptRight);
              that.setData({
                [ansOptItem]: true,
                [ansOptRight]: true
              })
            }
          }
      }
    }
    // 设置为page的data
    that.setData({
      name: options.title,
      paper_id: options.paper_id
    })
    if (pact == 'allparse') {
      wx.setNavigationBarTitle({
        title: '全部解析'
      })
      that.setData({
        examQuestionsArray: examQuestionsArray,
        examQuestionsTotal: examQuestionsArray.length,
        correctNumber: correctNumber,
        incorrectNumber: incorrectNumber
      })
    } else if (pact == 'wrongparse') {
      wx.setNavigationBarTitle({
        title: '错题解析'
      })
      that.setData({
        examQuestionsArray: examQuestionsWrong,
        examQuestionsTotal: examQuestionsWrong.length,
        correctNumber: 0,
        incorrectNumber: examQuestionsWrong.length
      })
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
    this.setData({
      tid: app.globalData.tid
    })
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