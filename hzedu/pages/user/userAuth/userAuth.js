var util = require('../../../utils/util.js')
var app = getApp();
// pages/user/userAuth/userAuth.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  // 是否授权
  handleWxAuth (e) {
    console.log(e.detail);
    console.log(app.globalData.userInfo, app.globalData.tid);
    if (e.detail.userInfo && !app.globalData.userInfo) {
      var wxinfoSend = {
        openid: wx.getStorageSync('openid'),
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      }
      wx.request({
        url: util.api + '/api/index/weixinuserinfo',
        data: {
          'data': util.pass_token(wxinfoSend)
        },
        method: 'POST',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (res) {
          wx.redirectTo({
            url: '/pages/exercise/exerIndex/exerIndex'
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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