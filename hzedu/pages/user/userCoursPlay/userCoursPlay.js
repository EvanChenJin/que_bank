// util
var util = require('../../../utils/util.js');
// pages/user/userCoursPlay/userCoursPlay.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
     videoData: '',
     name: '',
     teacher: ''
  },  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     console.log(options);
     wx.setNavigationBarTitle({
       title: options.name
     });
     var that = this;
     that.setData({
       name: options.name,
       teacher: options.teacher
     })
     var videoSend = {
       vid: parseInt(options.vid)
     }
     // 请求视频资源
     util.http(
       '视频数据请求中', '暂无录播视频',
       '/api/user/vediodetail',
       { 'data': util.pass_token(videoSend) },
       function (videoRes) {
         that.setData({
           videoData: videoRes
         })
       }
     )
    // 学习课程
    util.http(
      '视频数据请求中', '暂无录播视频',
      '/api/user/learn',
      { 'data': util.pass_token(videoSend) }
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