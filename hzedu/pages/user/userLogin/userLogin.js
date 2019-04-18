// http pass_token
var util = require('../../../utils/util.js')
var regLogin = require('../../../utils/regLogin.js')
var tip = require('../../../utils/tip.js')
// pages/user/userLogin/userLogin.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isMobileFocus: false,
    isPsdFocus: false,
    isVerifyFocus: false,
    psdLogin: true,
    verifyLogin: false,
    verifyText: "发送验证码",
    currentTime: 61,
    mobile: '',
    disabled: false,
    login: ''              // 用于跳转判断
  },
  // focus
  handleFocus: function (e) {
    regLogin.handleFocus(this, e);
  },
  // blur
  handleBlur: function (e) {
    regLogin.handleBlur(this, e);
  },
  // 验证码登录
  handleToggleToVerify: function () {
    this.setData({
      psdLogin: false,
      verifyLogin: true
    })
  },
  // 密码登录
  handleToggleToPsd: function () {
    this.setData({
      psdLogin: true,
      verifyLogin: false
    })
  },
  // 获取mobile
  handleMobile: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  // 发送验证码
  handleVerifyCode (e) {
    regLogin.messageVerfiy(this, this.data.mobile, this.data.verifyText, 
    this.data.currentTime, this.data.disabled)
  },
  // 提交登录信息
  handleLogin: function (e) {
    console.log(e.detail.value);
    var that = this;
    var loginSend = e.detail.value;
    // 号码是否正确
    if (!regLogin.verifyMoblie(loginSend.mobile)) return false
    // 判断登录类型
    if (loginSend.password) {
      loginSend.logintype = 1
      // 密码是否正确
      if (!regLogin.verifyPsd(loginSend.password)) return false
    } else if (loginSend.code) {
      loginSend.logintype = 2
      // 验证码是否为空
      if (!loginSend.code) {
        tip.showToast('验证码不能空', 'none')
        return false
      } 
    }
    // 登录请求
    regLogin.authorityHttp(
      '/api/index/login',
      { 'data': util.pass_token(loginSend) },
      function (loginRes) {
        console.log(loginRes.data);
        // 储存 token, userinfo
        wx.setStorageSync('token', loginRes.data.token);
        wx.setStorageSync('userinfo', loginRes.data.userinfo);
        var login = that.data.login;
        if (login == 'user') {
          wx.switchTab({
            url: '/pages/user/userIndex/userIndex'
          })
        } else if (login == 'poster') {
          wx.switchTab({
            url: '/pages/community/commpublic/commPublic'
          })
        } else if (login == 'comment') {
          wx.switchTab({
            url: '/pages/community/commDetail/commDetail'
          })
        } else if (login == 'course') {
          wx.switchTab({
            url: '/pages/course/courPay/courPay'
          })
        }
      }
    )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      login: options.login
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