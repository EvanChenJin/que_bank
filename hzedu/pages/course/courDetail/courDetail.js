// util
var util = require('../../../utils/util.js');
// pages/course/courDetail/courDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseDetail: '',
    tab: 1
  },
  // 课程详情切换tab
  handleToggleTab (e) {
    var index = parseInt(e.currentTarget.dataset.index, 10);
    this.setData({
      tab: index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    wx.setNavigationBarTitle({
      title: options.name
    })
    var that = this;
    util.http('课程详情加载中', '暂无课程详情',
      '/api/index/coursedetail',
      { 'data': util.pass_token({ cid: parseInt(options.cid, 10) }) },
      function (detailRes) {
        console.log(detailRes);
        that.setData({
          courseDetail: detailRes
        })
      }
    )

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})