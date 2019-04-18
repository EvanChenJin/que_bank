var app = getApp();
// pages/information/infoIndex.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    tid: '',
    userInfoPart: [
      {
        url: "/pages/user/userCourseList/userCourseList",
        iconPath: "../../../assets/images/icon-myclass.png",
        partText: "我的课程"
      },
      {
        url: "/pages/user/userOrder/userOrder",
        iconPath: "../../../assets/images/icon-myorder.png",
        partText: "我的订单"
      },
      {
        url: "/pages/user/userAddress/userAddress",
        iconPath: "../../../assets/images/icon-mysite.png",
        partText: "收货地址"
      }
    ]
  },
  // 退出
  handleLoginOut (e) {
    wx.removeStorageSync('token')
    wx.removeStorageSync('userinfo')
    wx.redirectTo({
      url: '/pages/user/userLogin/userLogin?login=user'
    })
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
    // 从编辑个人信息返回时获取最新个人信息
    if (wx.getStorageSync('token')) {
        var userInfo = wx.getStorageSync('userinfo');
        if (userInfo) {
          this.setData({
            userInfo: userInfo
          })
        } else {
          if (app.globalData.userInfo) {
            this.setData({
              userInfo: app.globalData.userInfo
            })
          }
        }
    } else {
      wx.redirectTo({
        url: '/pages/user/userLogin/userLogin?login=user'
      })
    }
    // 获取 tid
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