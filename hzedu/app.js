// utils
var util = require('./utils/util.js')
var tip = require('./utils/tip.js')
//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 获取 session 和 openid
    var that = this;
    var hzsession = wx.getStorageSync('hzsession');
    var openid = wx.getStorageSync('openid');
    if (!hzsession || !openid) {
      wx.login({
        success: res => {
          wx.request({
            url: util.api + '/api/index/weixin_token',
            data: {
              'data': util.pass_token({ jscode: res.code })
            },
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
              console.log(res.data);
              var wxtokenRes = res.data;
              if (wxtokenRes.code == 100) {
                tip.showToast(wxtokenRes.info, 'success', 1500);
                wx.setStorageSync('hzsession', wxtokenRes.data.session_key);
                wx.setStorageSync('openid', wxtokenRes.data.openid);
                var userInfo = wxtokenRes.data.wxuserinfo;
                if (typeof userInfo === undefined || userInfo == null) {
                  wx.redirectTo({
                    url: '/pages/user/userAuth/userAuth'
                  })
                } else {
                  that.globalData.userInfo = wxtokenRes.data.wxuserinfo;
                }
              } else {
                tip.showToast(wxtokenRes.info, 'none', 1500);
              }
            },
            fail: function (err) {
              tip.showToast('获取信息失败', 'none', 2000)
            }
          })
        }
      })
    }
  },
  onHide: function () {
    
  },
  globalData: {
    userInfo: '',
    tid: ''
  }
})