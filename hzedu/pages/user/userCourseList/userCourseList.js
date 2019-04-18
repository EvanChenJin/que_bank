// util
var util = require('../../../utils/util.js');
// pages/user/userCourseList/userCourseList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isHaveCourse: false,
    courseList: [],
    p: 1,
    isReqDataEmpty: false
  },
  // 请求课程
  getUserCourseList (page) {
    util.getList(
      page, page.data.p, '课程加载中', '暂无课程',
      '/api/user/courselist',
      { 'data': util.pass_token({p: page.data.p}) },
      function (courseData) {
        page.setData({
          courseList: page.data.courseList.concat(courseData),
          isHaveCourse: true
        })
        page.data.p++;
      }
    )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserCourseList(this);
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
    if (!this.data.isReqDataEmpty) {
      this.getUserCourseList(this);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})