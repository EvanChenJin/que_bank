// util
var util = require('../../../utils/util.js')
var tip = require('../../../utils/tip.js')
// pages/community/commpublic/commPublic.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    max: 1000,
    contentVal: '',
    contentValLen: 0,
    pictures: [],
    disabled: false
  },
  // 控制评论输入
  handleInputValue (e) {
     var contentVal = e.detail.value;
     var contentValLen = parseInt(contentVal.length, 0);
     if (contentValLen > 1000) {
       contentVal = contentVal.substring(0, 1001);
       contentValLen = 1000
     }
     this.setData({
       contentVal: contentVal,
       contentValLen: contentValLen
     })
  },
  // 上传图片
  handleUploadImg () {
    var that = this;
    // 选择本地图片
    wx.chooseImage({
      success: function(res) {
        if (res.tempFilePaths.length) {
          // 多张图片循环上传
          var tfpLen = 0;
          while(tfpLen < res.tempFilePaths.length) {
            // 上传一张图片
            wx.getFileSystemManager().readFile({
              filePath: res.tempFilePaths[tfpLen],
              encoding: 'base64',
              success: function (base64Res) {
                if (base64Res.data) {
                  var imgBase64 = ('data:image/png;base64,' + base64Res.data)
                  util.http(
                    '图片上传中', '上传失败',
                    '/api/public/upload_img_base64',
                    { image: imgBase64 },
                    function (uploadRes) {
                      that.data.pictures.push(uploadRes.url)
                      that.setData({
                        pictures: that.data.pictures
                      })
                    }
                  )
                }
              }
            });
            tfpLen++;
          }
          
        } else {
          wx.showModal({
            title: '提示',
            content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
          })
        }
      }
    })
  }, 
  // 发表帖子
  handleMakePost () {
    var that = this;
    if (that.data.contentValLen < 10) {
      tip.showToast('字数不够哦！', 'none', 1500)
      return false;
    }
    var makePostSend = {
      content: that.data.contentVal,
      pictures: that.data.pictures
    }
    that.setData({
      disabled: true
    })
    wx.request({
        url: util.api + '/api/bbs/createposts',
        data: {
          'data': util.pass_token(makePostSend)
        },
        method: 'POST',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (postRes) {
          console.log(postRes);
          if (postRes.data.code === 100) {
            tip.showToast(postRes.data.info, 'success', 1500)
            setTimeout(function () {
              wx.redirectTo({
                url: '/pages/community/commDetail/commDetail?pid=' + postRes.data.data.id
              })
            }, 2000)
          } else {
            that.setData({
              disabled: false
            })
            tip.showToast(postRes.data.info, 'none', 1500)
          }
        }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    //  if (!wx.getStorageSync('token')) {
    //     wx.navigateTo({
    //       url: '/pages/user/userLogin/userLogin?login=poster'
    //     })
    //  } 
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