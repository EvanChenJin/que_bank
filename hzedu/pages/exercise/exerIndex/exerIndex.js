var app = getApp();
var util = require('../../../utils/util.js')
var tip = require('../../../utils/tip.js')
// pages/information/infoIndex.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isNationalActive: true,  // 控制大分类的切换
    isSouthActive: false,    // 控制大分类的切换
    national: {},            // 国家电网数据
    south: {},               // 南方电网数据
    tid: '',
    disabled: false
  },
  // 控制大分类的切换
  handleToggleCate (e) {
    var selectedIndex = parseInt(e.currentTarget.dataset.index, 10);
    if (selectedIndex == 1) {
      this.setData({
        isNationalActive: true,
        isSouthActive: false,
        tid: this.data.national.name[0].tid
      })
    } else if (selectedIndex == 2) {
      this.setData({
        isSouthActive: true,
        isNationalActive: false,
        tid: this.data.south.name[0].tid
      })
    }
    app.globalData.tid = this.data.tid;
  },
  // 控制科目列表
  handleSubList (e) {
    var tapIndex = parseInt(e.currentTarget.dataset.index, 10);
    var national = this.data.national;
    var south = this.data.south;
    if (this.data.isNationalActive) {
      var setKeyNat = 'national.child.name[' + tapIndex + '].isOpen';
      this.setData({
        [setKeyNat]: !national.child.name[tapIndex].isOpen
      })
    } else {
      var setKeySouth = 'south.child.name[' + tapIndex + '].isOpen';
      this.setData({
        [setKeySouth]: !south.child.name[tapIndex].isOpen
      })
    }
  },
  // 科目进度图标
  subjectProgress(page, classify) {
    if (classify.child.name) {
      for (var j = 0; j < classify.child.name.length; j++) {
        // 科目进度
        var classifyItem = classify.child.name[j];
        var cProgress = (classifyItem.num_history / classifyItem.num)*100;
        var cProKey = 'classify.child.name[' + j + '].progressIcon'
        var cProgressIcon = classifyItem.progressIcon;
        setProgressIcon(this, cProgress, cProKey, cProgressIcon);
        if (classifyItem.subject) {
          for (var k = 0; k < classifyItem.subject.length; k++) {
            // 章节进度
            var subjectItem = classifyItem.subject[k];
            var progress = (subjectItem.complete_num / subjectItem.sub_num)*100;
            var proKey = 'classify.child.name[' + j + '].subject[' + k + '].progressIcon';
            var progressIcon = subjectItem.progressIcon;
            setProgressIcon(this, progress, proKey, progressIcon);
          }
        }
      }
    }
    function setProgressIcon(page, progress, proKey, progressIcon) {
      var total = '';
      if (progress == 0) {
        total = 0;
      } else if (progress > 0 && progress <= 20) {
        total = 1;
      } else if (progress > 20 && progress <= 40) {
        total = 2;
      } else if (progress > 40 && progress <= 60) {
        total = 3;
      } else if (progress > 60 && progress <= 80) {
        total = 4;
      } else if (progress > 80 && progress >=100){
        total = 5;
      } else {
        total = 0;
      }
      for (var i = 0; i < total; i++) {
        progressIcon[i] = '../../../assets/images/check-checked.png';
      }
      page.setData({
        [proKey]: progressIcon
      })
    }
  },
  // 获取科目章节的索引
  _getSubjectChapterIndex (e) {
    var cIdx = parseInt(e.currentTarget.dataset.cindex);
    var sIdx = parseInt(e.currentTarget.dataset.sindex);
    var sid = '';
    var isFree = '';
    var isBuy = '';
    var sname = '';
    var chid = '';
    if (this.data.isNationalActive) {
      var national = this.data.national.child.name;
      sid = national[cIdx].subject[sIdx].sid;
      isFree = national[cIdx].subject[sIdx].is_free;
      isBuy = national[cIdx].subject[sIdx].buy;
      sname = national[cIdx].subject[sIdx].sname;
      chid = national[cIdx].subject[sIdx].last_chid;
    } else {
      var south = this.data.south.child.name;
      sid = south[cIdx].subject[sIdx].sid
      isFree = south[cIdx].subject[sIdx].is_free;
      isBuy = south[cIdx].subject[sIdx].buy;
      sname = south[cIdx].subject[sIdx].sname;
      chid = south[cIdx].subject[sIdx].last_chid;
    }
    return {
      sid: parseInt(sid, 10),
      isFree: parseInt(isFree, 10),
      isBuy: parseInt(isBuy, 10),
      sname: sname,
      chid: chid
    }
  },
  // 科目导航到章节页面
  handleNavToChapter (e) {
    var sid = this._getSubjectChapterIndex(e).sid;
    var isFree = this._getSubjectChapterIndex(e).isFree;
    var isBuy = this._getSubjectChapterIndex(e).isBuy;
    var sname = this._getSubjectChapterIndex(e).sname;
    var chid = this._getSubjectChapterIndex(e).chid;  
    // 章节信息
    console.log(sid, isFree, isBuy, sname, chid)
    function continueOrNot(eCommParam, cCommParam) {
        wx.showModal({
          title: '练习提示',
          content: '您是否继续上次作题',
          cancelText: '不了',
          confirmText: '继续',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/exercise/exerCtb/exerCtb?action=chapter' + eCommParam
              })
            }
            if (res.cancel) {
              wx.navigateTo({
                url: '/pages/exercise/exerClassify/exerClassify' + cCommParam
              })
            }
          }
        })
    }
    var eCommParam = '&chid=' + chid + '&tid=' + this.data.tid +'&name=练习题' + '&isContinue=isContinue';
    var cCommParam = '?sid=' + sid + '&sname=' + sname + '&tid=' + this.data.tid;
    if (isFree === 0) {
      if (chid && chid != '0') {
        continueOrNot(eCommParam, cCommParam)
      } else {
        wx.navigateTo({ 
          url: '/pages/exercise/exerClassify/exerClassify' + cCommParam
        })
      }
    } else if (isFree === 1 && isBuy === 1) {
      if (chid && chid != '0') {
        continueOrNot(eCommParam, cCommParam)
      } else {
        wx.navigateTo({
          url: '/pages/exercise/exerClassify/exerClassify' + cCommParam
        })
      }
    }
  },
  // 科目购买
  handleSubjectBuy (e) {
    var that = this;
    var sid = that._getSubjectChapterIndex(e).sid;
    var sname = that._getSubjectChapterIndex(e).sname;
    var openid = wx.getStorageSync('openid');
    console.log(sid, openid)
    var examPaySend = {
      eid: sid,
      gateway: 'miniapp',
      paytype: 2,
      openid: openid
    }
    that.setData({
      disabled: true
    })
    // 题库下单
    wx.request({
        url: util.api + '/api/pay/exampay',
        data: { 
          'data': util.pass_token(examPaySend)
        },
        method: 'POST',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (payRes) {
          var payResData = payRes.data;
          console.log(payResData);
          if (payResData.code === 100) {
            tip.showToast(payResData.info, 'success', 1500);
            var payParam = payResData.data.parameters;
            console.log(payParam)
            if (payParam) {
              wx.requestPayment({
                timeStamp: payParam.timeStamp,
                nonceStr: payParam.nonceStr,
                package: payParam.package,
                signType: payParam.signType,
                paySign: payParam.paySign,
                success: function (payRes) {
                  tip.showToast('支付成功', 'success', 2000)
                  setTimeout(function () {
                    wx.switchTab({
                      url: '/pages/exercise/exerClassify/exerClassify?sid' + sid + '&sname=' + sname
                    })
                  }, 2000)
                },
                fail: function (err) {
                  tip.showToast('支付取消', 'none')
                  that.setData({
                    disabled: false
                  })
                }
              })
            }
          } else {
            tip.showToast(payResData.info, 'none', 1500);
            that.setData({
              disabled: false
            })
          }
        }
    })
  },
  // 智能组卷
  toZnExam (e) {
    var ran = Math.ceil(Math.random() * 100);
    var znParam = '?action=zn&tid=' + this.data.tid + '&paper_id=' + ran;
    wx.navigateTo({
      url: '/pages/exercise/question/question' + znParam
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    util.http(
      '题库数据加载中', '暂无试题',
      '/api/exam/getexamindex',
      { 'data': util.pass_token({}) },
      function (examRes) {
        for (var key in examRes) {
          if (examRes[key].child && examRes[key].child.name) {
            var classifyArray = examRes[key].child.name;
            for (var i = 0; i < classifyArray.length; i++) {
              classifyArray[i].subject = examRes.subject['child_' + classifyArray[i].tid]
              classifyArray[i].isOpen = false;
              classifyArray[i].progressIcon = [
                "../../../assets/images/check-normal.png",
                "../../../assets/images/check-normal.png",
                "../../../assets/images/check-normal.png",
                "../../../assets/images/check-normal.png",
                "../../../assets/images/check-normal.png"
              ];
              if (classifyArray[i].subject) {
                for (var j = 0; j < classifyArray[i].subject.length; j++) {
                  var subjectItem = classifyArray[i].subject[j];
                  subjectItem.progressIcon = [
                    "../../../assets/images/check-normal.png",
                    "../../../assets/images/check-normal.png",
                    "../../../assets/images/check-normal.png",
                    "../../../assets/images/check-normal.png",
                    "../../../assets/images/check-normal.png"
                  ];
                }
              } else {
                continue;
              }
            }
          } else {
            continue;
          }
        }
        // 设置科目进度图标
        that.subjectProgress(that, examRes['parent_1']);
        // that.subjectProgress(that, examRes['parent_2']);
        that.setData({
          national: examRes['parent_1'],
          south: examRes['parent_2'],
          tid: examRes['parent_1'].name[0].tid
        })
        // tid 储存为全局变量
        app.globalData.tid = examRes['parent_1'].name[0].tid;
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