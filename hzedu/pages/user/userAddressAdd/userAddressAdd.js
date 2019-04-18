// util
var util = require('../../../utils/util.js')
var regLogin = require('../../../utils/regLogin.js')
var tip = require('../../../utils/tip.js')
// pages/user/userAddressAdd/userAddressAdd.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    action: '',
    courAddress: '',
    province: [],
    city: [],
    district: [],
    proSel: '',
    citySel: '',
    distSel: '',
    addressEdit: {},
    disable: false,
    cid: '',            // 课程添加地址
    cname: '',
    price: ''
  },
  // 省市区数据
  getSsq (aid, cb) {
    var that = this;
    var ssqSend = {};
    ssqSend.pid = aid || 0;
    wx.request({
      url: util.api + '/api/index/getcity',
      data: {
        'data': util.pass_token(ssqSend)
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        typeof cb === 'function' && cb(res);
      }
    })
  },
  // 初始化数据
  handleProStart () {
    var that = this;
    that.getSsq(0, function (proRes) {
      if (proRes.data) {
        that.setData({
          province: proRes.data
        })
        that.setData({
          proSel: that.data.province[0].name
        })
        that.getSsq(that.data.province[0].id, function (cityRes) {
          if (cityRes.data) {
            that.setData({
              city: cityRes.data
            })
            that.setData({
              citySel: that.data.city[0].name
            })
            that.getSsq(that.data.city[0].id, function (distRes) {
              if (distRes.data) {
                that.setData({
                  district: distRes.data
                })
                that.setData({
                  distSel: that.data.district[0].name
                })
              }
            })
          }
        });
      }
    });
  },
  // 省份变化
  handleProChange (e) {
    var that = this;
    var proSelectedId = e.detail.value[0];
    that.setData({
      proSel: that.data.province[proSelectedId].name
    })
    var pId = that.data.province[proSelectedId].id;
    that.getSsq(pId, function(cityRes){
      if (cityRes.data) {
        that.setData({
          city: cityRes.data
        })
        that.getSsq(that.data.city[0].id, function(distRes){
          if (distRes.data) {
            that.setData({
              district: distRes.data
            })
          }
        })
      }
    })
  },
  // 城市变化
  handleCityChange (e) {
    var that = this;
    var citySelectedId = e.detail.value[0];
    that.setData({
      citySel: that.data.city[citySelectedId].name
    })
    var cId = that.data.city[citySelectedId].id;
    that.getSsq(cId, function(cityRes){
      if (cityRes.data) {
        that.setData({
          district: cityRes.data
        })
      }
    })
  },
  // 地区变化
  handleDistChange (e) {
    var that = this;
    var distSelectedId = e.detail.value[0];
    that.setData({
      distSel: that.data.district[distSelectedId].name
    })
  },
  // 新增或编辑地址
  operateAddress (e) {
    var that = this;
    var addressForm = e.detail.value;
    console.log(addressForm);
    // 验证 
    if (!regLogin.verifyName(addressForm.name)) return false;
    else if (!regLogin.verifyMoblie(addressForm.mobile)) return false;
    else if (!that.data.proSel || !that.data.citySel || !that.data.distSel) {
      tip.showToast('省市区不能为空', 'none', 2000);
    }
    else if (!addressForm.detail) {
      tip.showToast('详细地址不为空', 'none', 2000);
      return false;
    }
    var addressSend = {
      mobile: addressForm.mobile,
      name: addressForm.name,
      detail: addressForm.detail,
      province: that.data.proSel,
      city: that.data.citySel,
      district: that.data.distSel
    }
    console.log(addressSend);
    that.setData({
      disable: true
    })
    var apiPath = '';
    if (that.data.action == 'edit') {
      apiPath = '/api/user/addressedit';
    } else if (that.data.action == 'add') {
      apiPath = '/api/user/addressadd';
    }
    wx.request({
      url: util.api + apiPath,
      data: {
        'data': util.pass_token(addressSend)
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if (res.data.code === 100) {
          tip.showToast(res.data.info, 'success', 2000)
          var action = that.data.action;
          if (action == 'add' && that.data.courAddress == 'courAddress') {
            wx.redirectTo({
              url: '/pages/course/courPay/courPay?cid=' + that.data.cid + '&name=' + that.data.cname + '&price=' + that.data.price 
            })
          } else if (action == 'add' || action == 'edit') {
            wx.redirectTo({
              url: '/pages/user/userAddress/userAddress'
            })
          }
        } else {
          tip.showToast(res.data.info, 'none', 2000)
          that.setData({
            disable: false
          })
        }
      },
      fail: function () {
        tip.showToast('地址操作失败', 'none')
        that.setData({
          disable: false
        })
      }
    })
  },
  handleAddAddress (e) {
    this.operateAddress(e);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     console.log(options);
     this.data.province.push(options.province);
     this.data.city.push(options.city);
     this.data.district.push(options.district);
     var addressEdit = {
        name: options.name,
        mobile: options.mobile,
        detail: options.detail   
     }
     this.setData({
        action: options.action,
        addressEdit: addressEdit,
        province: this.data.province,
        city: this.data.city,
        district: this.data.district,
        courAddress: options.courAddress
     })
     if (options.courAddress) {
       this.setData({
         cid: options.cid,
         cname: options.cname,
         price: options.price
       })
     }
     if (options.action == 'add') {
       // 添加地址
       wx.setNavigationBarTitle({
         title: '添加地址'
       })
     } else if (options.action == 'edit') {
       wx.setNavigationBarTitle({
         title: '编辑地址'
       })
     }
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