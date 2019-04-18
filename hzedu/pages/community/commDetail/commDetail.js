// util
var util = require('../../../utils/util.js')
var tip = require('../../../utils/tip.js')
// pages/community/commDetail/commDetail.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    bbsDetail: '',
    commentList: [],
    p: 1,
    pid: '',
    isReqDataEmpty: false,
    commentVal: '',
    commentLen: 0,
    maxLen: 140,
    disabled: false
  },
  // 控制最大输入数
  handleMaxInput (e) {
    var commentVal = e.detail.value;
    var len = parseInt(commentVal.length, 10);
    if (len > 140) {
      commentVal = commentVal.substring(0,141);
      len = 140; 
    }
    this.setData({
      commentVal: commentVal,
      commentLen: len
    })
  },
  // 提交评论
  handleMakeComment (e) {
    // if (wx.getStorageSync('token')) {
      var that = this;
      var makeCommentSend = {
        pid: that.data.pid,
        content: e.detail.value.comment
      }
      that.setData({
        disabled: true
      })
      // 调试参数
      console.log(makeCommentSend);
      wx.request({
        url: util.api + '/api/bbs/addcomments',
        data: {
          'data': util.pass_token(makeCommentSend)
        },
        method: 'POST',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (commentRes) {
          console.log(commentRes);
          var commentItemRes = commentRes.data;
          if (commentItemRes.code === 100) {
              tip.showToast(commentItemRes.info, 'success', 1500)
              // 最新评论显示到前端
              var userInfo = wx.getStorageSync('userinfo');
              var newComment = {
                name: userInfo.name,
                headimg: userInfo.headimg,
                content: that.data.commentVal,
                ctime: util.formatTime(new Date()),
                id: parseInt(commentItemRes.data.id, 10),
              };
              that.data.commentList.unshift(newComment);
              that.setData({
                commentList: that.data.commentList
              })
          } else {
            that.setData({
              disabled: false
            })
            tip.showToast(commentItemRes.info, 'none', 1500)
          }
        }
      })
    // } else {
    //   wx.navigateTo({
    //     url: '/pages/user/userLogin/userLogin?login=comment'
    //   })
    // }
  },
  // 评论列表
  getCommentList(page) {
    var commentSend = {
      p: page.data.p,
      pid: page.data.pid
    }
    util.getList(
       page, page.data.p,
      '评论数据加载中', '暂无评论',
      '/api/bbs/commentslist',
      { 'data': util.pass_token(commentSend) },
      function (commentRes) {
         console.log(commentRes);
         page.setData({
           commentList: page.data.commentList.concat(commentRes)
         })
         page.data.p++;
      }
    )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.pid)
    var that = this;
    var bbsDetaiSend = options;
    bbsDetaiSend.pid = parseInt(bbsDetaiSend.pid)
    that.setData({
      pid: bbsDetaiSend.pid
    })
    // 帖子详情
    util.http(
      '帖子数据请求中', '帖子暂无内容',
      '/api/bbs/detail',
      { 'data': util.pass_token(bbsDetaiSend) },
      function (bbsDetailRes) {
        bbsDetailRes.pictures = JSON.parse(bbsDetailRes.pictures);
        that.setData({
          bbsDetail: bbsDetailRes
        })
        // 请求评论列表
        that.getCommentList(that);
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
    if (!this.data.isReqDataEmpty) {
      this.getCommentList(this);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})