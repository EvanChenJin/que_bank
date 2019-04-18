// util
var util = require('../../../utils/util.js');
// pages/information/infoIndex.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bbsList: [],
    p: 1,
    isReqDataEmpty: false
  },
  // 帖子列表
  getBbsList (page) {
    var bbsSend = {
      p: page.data.p
    }
    util.getList(
      page, page.data.p, '帖子加载中', '暂无帖子',
      '/api/bbs/index',
      { 'data': util.pass_token(bbsSend) },
      function (bbsRes) {
        console.log(bbsRes);
        // 图片地址字符串转换为数组
        bbsRes.pop();   // 单引号必须
        bbsRes.pop();   // 单引号必须
        bbsRes.pop();   // 单引号必须
        for (var i = 0; i < bbsRes.length; i++) {
          if (!bbsRes[i].pictures) {
             bbsRes[i].pictures = [];
          } else {
            bbsRes[i].pictures = JSON.parse(bbsRes[i].pictures);
          }
        }
        page.setData({
          bbsList: page.data.bbsList.concat(bbsRes)
        })
        page.data.p++;
      }
    )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBbsList(this)
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
      this.getBbsList(this);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})