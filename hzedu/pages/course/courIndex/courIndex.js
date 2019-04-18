// util
var util = require('../../../utils/util.js');
// pages/information/infoIndex.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isActive: true,
    cat: 1,
    p: 1,
    courseList: [],
    isReqDataEmpty: false
  },
  // 获取课程列表
  getCourseList (page) {
    var courseSend = {
      cat: page.data.cat,
      p: page.data.p
    }
    util.getList(page, page.data.p, '课程加载中', '暂无课程',
      '/api/index/courselist',
      { 'data': util.pass_token(courseSend) },
      function (courseRes) {
        console.log(courseRes);
        page.setData({
          courseList: courseRes
        })
        page.data.p++;
      }
    );
  },
  // 选择分类
  handleCategory (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      cat: index,
      p: 1,
      courseList: []
    })
    this.getCourseList(this);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCourseList(this);
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
    if (!this.isDataCourseEmpty) {
      this.getCourseList(this);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})