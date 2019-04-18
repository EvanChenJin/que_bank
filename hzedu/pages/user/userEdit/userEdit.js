// utils
var util = require('../../../utils/util.js');
var tip = require('../../../utils/tip.js')
// pages/user/userEdit/userEdit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userAvator: '',
    userName: ''
  },
  // 修改头像
  handleImgChange () {
    var that = this;
    // 本地选择图片
    wx.chooseImage({
      success: function(res) {
        if (res.tempFilePaths[0]) {
          if (wx.getFileSystemManager) {
            // base64编码
            wx.getFileSystemManager().readFile({
              filePath: res.tempFilePaths[0],
              encoding: 'base64',
              success: function (base64Res) {
                if (base64Res.data) {
                  var imgBase64 = ('data:image/png;base64,' + base64Res.data);
                  // 上传图片   
                  util.http(
                    '正在上传图片', '上传失败',
                    '/api/public/upload_img_base64',
                    { image: imgBase64 },
                    function (resData) {
                      that.setData({
                        userAvator: resData.url
                      })
                      // 保存至本地storage
                      var newUserInfo = wx.getStorageSync('userinfo');
                      newUserInfo.headimg = resData.url;
                      wx.setStorageSync('userinfo', newUserInfo)
                    }
                  )
                }
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            })
          }
        }
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userAvator: wx.getStorageSync('userinfo').headimg
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
    // 从编辑名字返回时获取最新名字
    this.setData({
      userName: wx.getStorageSync('userinfo').name
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