// utils
var util = require('../../../utils/util.js');
// pages/user/userEditName/userEditName.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: ''
  },
  // 修改名字
  handleChangeName: function (e) {
    var that = this;
    var nameSend = e.detail.value;
    nameSend.keyname = 'name';
    util.http(
      '名字提交中', '名字提交失败',
      '/api/user/edit',
      { 'data': util.pass_token(nameSend) },
      function () {
        var newUserInfo = wx.getStorageSync('userinfo');
        newUserInfo.name = nameSend.val;
        wx.setStorageSync('userinfo', newUserInfo)
      }
    )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userName: wx.getStorageSync('userinfo').name
    })
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