var util = require('../../../utils/util.js')
var tip = require('../../../utils/tip.js')
// pages/exercise/exerClassify/exerClassify.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    chapterList: [],
    tid: ''             // 第一级分类
  },
  // 获取练习题
  handleNavExercise (e) {
    var tapIndex = parseInt(e.currentTarget.dataset.index);
    var chapterItem = this.data.chapterList[tapIndex];
    var param = '?action=chapter&tid=' + this.data.tid + '&chid=' + chapterItem.chid + '&name=' + chapterItem.chname;
    if (chapterItem.num && chapterItem.num != 0) {
      if (chapterItem.my_chid_num && chapterItem.my_chid_num != 0) {
         wx.showModal({
           title: '练习提示',
           content: '您是否要继续上次的作题',
           cancelText: '不了',
           confirmText: '继续',
           success: function (res) {
             if (res.confirm) {
               param = param + '&isContinue=isContinue'
               wx.navigateTo({
                 url: '/pages/exercise/exerCtb/exerCtb' + param,
               })
             }
             if (res.cancel) {
               wx.navigateTo({
                 url: '/pages/exercise/exerCtb/exerCtb' + param,
               })
             }
           }
         })
       } else {
          wx.navigateTo({
            url: '/pages/exercise/exerCtb/exerCtb' + param,
          })
       }
    } else {
      tip.showToast('暂无练习题', 'none', 500);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     console.log(options);
     wx.setNavigationBarTitle({
       title: options.sname,
     })
     var that = this;
     that.setData({
       tid: parseInt(options.tid)
     })
     util.http(
       '章节数据加载中', '暂无章节信息',
       '/api/exam/getmychapterinfo',
       { 'data': util.pass_token( {sid: parseInt(options.sid, 10)}) },
       function (chapterRes) {
         that.setData({
           chapterList: chapterRes
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