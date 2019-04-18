// pages/exercise/exerGrade/exerGrade.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    paper_id: '',
    title: '',
    score: 0,
    time: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     console.log(options);
     wx.setNavigationBarTitle({
       title: options.title
     })
     this.setData({
       title: options.title,
       paper_id: parseInt(options.paper_id),
       score: parseInt(options.score),
       time: options.time
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
    // 返回列表页时清除指定storage
    wx.removeStorageSync(this.data.paper_id + '')
    console.log('clear the key storage')
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