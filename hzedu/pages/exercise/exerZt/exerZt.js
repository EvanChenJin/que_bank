var util = require('../../../utils/util.js')
// pages/exercise/exerZt/exerZt.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    circleColor: ['#B2EE4A', '#FFC485', '#85C4FF'],
    examList: [],
    tid: '',       // 第一级分类
    p: 1,
    isReqDataEmpty: false
  },
  // 真题列表
  getZtList (page) {
    var ztSend = {
      tid: page.data.tid,
      type: 1,
      page: page.data.p
    }
    util.getList(
      page, page.data.p,
      '真题加载中', '暂无真题',
      '/api/exam/yearstruthlist',
      { 'data': util.pass_token(ztSend) },
      function (ztRes) {
        for (var i = 0; i < ztRes.length; i++) {
          if (ztRes[i].tips == '1') {
            ztRes[i].tips = '未做'
          } else if (ztRes[i].tips == '2') {
            ztRes[i].tips = '未做完'
          } else if (ztRes[i].tips == '3') {
            ztRes[i].tips = '已做'
          }
        }
        page.setData({
          examList: ztRes
        })
        page.data.p++;
      }
    )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      tid: parseInt(options.tid)
    })
    this.getZtList(this); 
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
      this.getZtList(this);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})