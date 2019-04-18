// util
var util = require('../../../utils/util.js');
// pages/user/userAddress/userAddress.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isOperate: false,         // 控制删除和编辑图标的显示隐藏
    isHaveAddress: false,
    addressList: []
  },
  // 选择地址 只能选其中一个
  handleChooseAddress (e) {
    var checkedIndex = parseInt(e.currentTarget.dataset.index);
    for (var i = 0; i < this.data.addressList.length; i++) {
      var aKey = "addressList[" + i + "].isChecked";
      this.setData({
        [aKey]: false
      })
      if (i === checkedIndex) {
        this.setData({
          [aKey]: true
        })
      } 
    }
  },
  // 管理地址
  handleManageAddress () {
    this.setData({
      isOperate: !this.data.isOperate
    })
  },
  // 编辑地址  
  handleEditAddress (e) {
    var that = this;
    var editIndex = e.target.dataset.index;
    var editAddress = that.data.addressList[editIndex];
    var editInfo = '?action=edit&id=' + editAddress.id + '&name=' + editAddress.name + 
                    '&mobile=' + editAddress.mobile + '&province=' + editAddress.province + 
                    '&city=' + editAddress.city + '&district=' + editAddress.district + 
                    '&detail=' + editAddress.detail;
    wx.navigateTo({
      url: '/pages/user/userAddressAdd/userAddressAdd' + editInfo
    })
  },
  // 删除地址
  handleDeteleAddress (e) {
    var that = this;
    var deleteIndex = e.target.dataset.index;
    var deleteId = that.data.addressList[deleteIndex].id;
    var deleteSend = {
      aid: parseInt(deleteId, 10)
    }
    wx.showModal({
      title: '地址操作',
      content: '您确定删除这条地址吗?',
      success: function (res) {
        if (res.confirm) {
            // 确定删除
            util.http(
              '正在删除','删除失败',
              '/api/user/addressdelete',
              { 'data': util.pass_token(deleteSend) },
              function () {
                console.log('删除成功');
                that.data.addressList.splice(deleteIndex, 1);
                console.log(that.data.addressList);
                that.setData({
                  addressList: that.data.addressList
                })
              }
            )
        } 
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 请求地址列表
    var that = this;
    util.http(
      '请求地址中', '暂无地址',
      '/api/user/addresslist',
      { 'data': util.pass_token({}) },
      function (addressRes) {
        console.log(addressRes);
        that.setData({
          addressList: that.data.addressList.concat(addressRes),
          isHaveAddress: true
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