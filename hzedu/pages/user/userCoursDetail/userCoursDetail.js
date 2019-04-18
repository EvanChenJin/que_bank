// util
var util = require('../../../utils/util.js');
// pages/user/userCoursDetail/userCoursDetail.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    chapterList: '',
    lessonList: ''
  },
  // 控制二级分类
  handleLevelTwo (e) {
    var tapIndex = parseInt(e.currentTarget.dataset.index, 10);
    var setKey = "chapterList[" + tapIndex + "].isOpen";
    this.setData({
      [setKey]: !this.data.chapterList[tapIndex].isOpen
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({ 'title': options.name});
    var that = this;
    util.http(
      '章节加载中', '暂无章节信息',
      '/api/user/coursedetail',
      { 'data': util.pass_token( {cid: parseInt(options.cid, 10)} ) },
        function(chapterRes) {
          console.log(chapterRes);
          if (Array.isArray(chapterRes)) {
            // 无二级分类
            that.setData({
              lessonList: chapterRes
            })
          } else {
            // 有二级分类
            var chapterList = [];
            for (var key in chapterRes) {
              var chapterItem = {};
              chapterItem.name = chapterRes[key].name;
              chapterItem.video = chapterRes[key].vedio;
              chapterItem.isOpen = false;
              chapterList.push(chapterItem);
            }
            that.setData({
              chapterList: chapterList
            })
          }
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