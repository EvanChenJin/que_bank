// utils
var util = require('../../../utils/util.js');
var regLogin = require('../../../utils/regLogin.js');
var tip = require('../../../utils/tip.js');
// pages/user/userReg/userReg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFindPsd: false,
    isMobileFocus: false,
    isPsdFocus: false,
    isVerifyFocus: false,
    isConfirmPsdFocus: false,
    verifyText: "发送验证码",
    currentTime: 61, 
    disabled: false, 
    mobile: '',
    login: ''
  },
  // focus
  handleFocus: function (e) {
    regLogin.handleFocus(this, e);
  },
  //  blur
  handleBlur: function (e) {
    regLogin.handleBlur (this, e);
  },
  // 获取mobile
  handleMobile: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  // 发送验证码
  handleVerifyCode (e) {  
    regLogin.messageVerfiy(this, this.data.mobile, this.data.verifyText, this.data.currentTime, this.data.disabled)
  },
  //注册 或 重置密码
  handleRegisterOrPsd (e) {
     console.log(e.detail.value);
     var regResetSend = e.detail.value;
     // 号码是否正确
     if (!regLogin.verifyMoblie(regResetSend.mobile)) return false
     // 验证码是否为空
     if (!regResetSend.code) {
       tip.showToast('验证码不能空', 'none')
       return false
     } 
     // 密码是否正确
     if (!regLogin.verifyPsd(regResetSend.password)) return false
     // 判读是注册还是修改密码
     if (!this.data.isFindPsd) {
        // 注册
        console.log('register')
        // 密码是否一致
        if (regResetSend.password !== regResetSend.confirmPsd) {
          tip.showToast('两次密码不一致', 'none')
          return false;
        }
        regLogin.authorityHttp(
          '/api/index/register',
          { 'data': util.pass_token(regResetSend) },
          function (regResetRes) {
            console.log(regResetRes.data)
            wx.navigateTo({
              url: '/pages/user/userLogin/userLogin'
            })
          }
        )
     } else {
       // 重置密码
       console.log('rest password')
       regLogin.authorityHttp(
         '/api/index/lostpassword',
         { 'data': util.pass_token(regResetSend) }
       )
     }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.action)
    this.setData({
      login: options.login
    })
    // 是否是 findPsd
    if (options.action) {
      this.setData({
        isFindPsd: true
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

  }
})