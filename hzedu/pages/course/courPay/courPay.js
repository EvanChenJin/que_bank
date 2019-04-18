// util
var util = require('../../../utils/util.js')
var tip = require('../../../utils/tip.js')
// pages/course/courPay/courPay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aid: '',
    cid: '',
    name: '',
    price: '',
    addressData: '',
    disabled: false
  },
  // 购买课程
  handlePurCourse (e) {
    if (wx.getStorageSync('token')) {
      var that = this;
      var purSend = {
        cid: this.data.cid,
        aid: this.data.aid,
        gateway: 'miniapp',
        paytype: 2,
        openid: wx.getStorageSync('openid')
      }
      that.setData({
        disabled: true
      })
      // 支付
      wx.request({
        url: util.api + '/api/pay/classpay',
        data: {
          'data': util.pass_token(purSend)
        },
        method: 'POST',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (purRes) {
          var payRes = purRes.data;
          if (payRes.code === 100) {
            console.log(payRes);
            tip.showToast(payRes.info, 'success', 1500)
            var payParam = payRes.parameters
            if (payParam) {
              wx.requestPayment({
                timeStamp: payParam.timeStamp,
                nonceStr: payParam.nonceStr,
                package: payParam.package,
                signType: payParam.signType,
                paySign: payParam.paySign,
                success: function (payRes) {
                  tip.showToast('支付成功', 'success', 2000)
                  setTimeout(function () {
                    wx.switchTab({
                      url: '/pages/user/userCourseList/userCourseList'
                    })
                  }, 2000)
                },
                fail: function (err) {
                  tip.showToast('支付取消', 'none')
                  that.setData({
                    disabled: false
                  })
                }
              })
            }
          } else {
            tip.showToast(payRes.info, 'none', 1500)
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/user/userLogin/userLogin?login=course'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    // 获取url参数值
    wx.setNavigationBarTitle({
      title: options.name
    })
    var that = this;
    that.setData({
      cid: parseInt(options.cid),
      name: options.name,
      price: parseInt(options.price)
    })
    // 获取默认地址
    wx.request({
      url: util.api + '/api/user/addressdefault',
      data: {
        'data': util.pass_token({})
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded'},
      success: function (defAddressRes) {
        var defAddressItem = defAddressRes.data;
        if (defAddressItem.code === 100) {
          if (!defAddressItem.data) {
            tip.showToast('暂无地址，请添加地址', 'none', 1500);
            var courAddressParam = '&cid=' + that.data.cid + '&cname=' + that.data.name + '&price=' + that.data.price;
            setTimeout(function () {
              wx.redirectTo({
                url: '/pages/user/userAddressAdd/userAddressAdd?action=add&courAddress=courAddress' + courAddressParam
              })
            }, 1000)
          } else {
            that.setData({
              addressData: defAddressItem.data,
              aid: defAddressItem.data.id
            })
          }
        } else {
          tip.showToast(defAddressItem.info, 'none', 1500);
        }
      }
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