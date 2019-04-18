var util = require('../../../utils/util.js')
var tip = require('../../../utils/tip.js')
var exam = require('../../../utils/exam.js')
// pages/exercise/exerCollection/exerCollection.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
      examQuestionsArray: [],
      examQuestionsTotal: 0,
      circleColor: ['#B2EE4A', '#FFC485', '#85C4FF'],   // 圆圈图标颜色
      isDeleteOper: false,   // 删除操作按钮
      isBtnShow: false,      // 删除取消按钮显示
      action: '',            // 区别收藏 错题 章节练习
      tid: '',               // 第一级分类
      p: 1,
      selectedIndexAry: [],
      isReqDataEmpty: false
  },
  // 操作收藏题
  handleCancelCollect (e) {
    var selectedIndex = parseInt(e.currentTarget.dataset.index);
    var examQuestionsArray = this.data.examQuestionsArray;
    var selKey = 'examQuestionsArray[' + selectedIndex + '].isTap'
    this.setData({
      [selKey]: !examQuestionsArray[selectedIndex].isTap
    })
    var count = 0;
    for (var i = 0; i < examQuestionsArray.length; i++) {
      if (examQuestionsArray[i].isTap) {
        this.setData({
          isBtnShow: true
        })
      } else {
        count++;
      }
    }
    if (count === examQuestionsArray.length) {
      this.setData({
        isBtnShow: false
      })
    }
  },
  // 确定删除
  handleConfirmDelete () {
    var that = this;
    var examQuestionsArray = that.data.examQuestionsArray;
    var selectedIndexAry = that.data.selectedIndexAry;
    var cancelSendParam = [];
    for (var i = 0; i < examQuestionsArray.length; i++) {
      if (examQuestionsArray[i].isTap) {
        selectedIndexAry.push(i)
      }
    }
    for (var j = 0; j < selectedIndexAry.length; j++) {
      cancelSendParam.push(examQuestionsArray[selectedIndexAry[j]].qid);
    }
    that.setData({
      selectedIndexAry: selectedIndexAry
    })
    console.log(selectedIndexAry, cancelSendParam)
    var deleteSend = {
      qid: cancelSendParam
    }
    util.http(
      '删除中', '删除失败',
      '/api/exam/cancelcollectquestion',       
      { 'data': util.pass_token(deleteSend) },
      function () {
        // 更新删除后的数组
        selectedIndexAry = selectedIndexAry.reverse();
        for (var k = 0; k < selectedIndexAry.length; k++){
          examQuestionsArray.splice(selectedIndexAry[k], 1);
        }
        that.setData({
          examQuestionsArray: examQuestionsArray
        })
      }
    )
  },
  // 取消删除
  handleConfirmCancel (e) {
    var examQuestionsArray = this.data.examQuestionsArray;
    for (var i = 0; i < examQuestionsArray.length; i++) {
      var tapKey = 'examQuestionsArray[' + i + '].isTap';
      if (examQuestionsArray[i].isTap) {
        this.setData({
          [tapKey]: false
        })
      }
    }
  },
  // 切换编辑状态
  handleDeleteCollect (e) {
    this.setData({
      isDeleteOper: !this.data.isDeleteOper
    })
  },
  // 导航到收藏题
  handleNavCollect (e) {
      var tapIndex = parseInt(e.currentTarget.dataset.index);
      var param = '?action=collect&tid=' + this.data.tid + '&currentIndex=' + tapIndex;
      wx.navigateTo({
        url: '/pages/exercise/exerCtb/exerCtb' + param
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     console.log(options)
     wx.setNavigationBarTitle({
       title: '考题收藏'
     })
     var that = this;
     that.setData({
       tid: options.tid,
       action: options.action
     })
    //  exam.getQuestions(that.data.action, that)
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
      examQuestionsArray: []
    })
    exam.getQuestions(this.data.action, this)
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
    if (!this.data.isReqDataEmpty) {
      // exam.getQuestions(this.data.action, this)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})