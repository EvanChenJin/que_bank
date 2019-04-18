var util = require('./util.js');
var tip = require('./tip.js');
// 输入框 focus
function handleFocus (page, e) {
  if (e.target.id === "mobile") {
    page.setData({
      isMobileFocus: true
    })
  } else if (e.target.id === "password") {
    page.setData({
      isPsdFocus: true
    })
  } else if (e.target.id === "verifyCode") {
    page.setData({
      isVerifyFocus: true
    })
  } else {
    page.setData({
      isConfirmPsdFocus: true
    })
  }
}
// 输入框 blur
function handleBlur (page, e) {
  if (e.target.id === "mobile") {
    page.setData({
      isMobileFocus: false
    })
  } else if (e.target.id === "password") {
    page.setData({
      isPsdFocus: false
    })
  } else if (e.target.id === "verifyCode"){
    page.setData({
      isVerifyFocus: false
    })
  } else {
    page.setData({
      isConfirmPsdFocus: false
    })
  }
}
// 验证手机号码
function verifyMoblie(mobile) {
  const mobileReg = /^1[3456789]\d{9}$/;
  if (!mobile) {
    tip.showToast("号码不能为空", 'none', 2000);
    return false;
  } else if (mobile.trim().length != 11 || !mobileReg.test(mobile)) {
    console.log(mobile.trim().length != 11);
    console.log(!mobileReg.test(mobile));
    tip.showToast("号码格式不正确", 'none', 2000);
    return false;
  }
  return true;
}
// 验证姓名
function verifyName(name) {
  const nameReg = /^([a-zA-Z0-9\u4e00-\u9fa5\·]{1,10})$/;
  if (!name) {
    tip.showToast("姓名不能为空", 'none', 2000);
    return false;
  } else if (!nameReg.test(name)) {
    tip.showToast("姓名不合格式", 'none', 2000);
    return false;
  }
  return true;
}
// 验证密码
function verifyPsd(password) {
  const passReg = /^[0-9A-Za-z]{6,}$/;
  if (!password) {
    tip.showToast("密码不能为空", 'none', 2000);
    return false;
  } else if (password.trim().length < 6 || !passReg.test(password)) {
    tip.showToast("密码格式不正确",'none', 2000);
    return false;
  }
  return true;
}
// 短信验证
function messageVerfiy(page, mobile, verifyText, duration, disabled) {
  if (verifyMoblie(mobile)) {
    page.setData({
      disabled: true,
    })
    // 倒计时
    var interval = setInterval(function (){
      duration--;
      page.setData({
        verifyText: duration + 's'
      })
      if (duration <= 0) {
        clearInterval(interval);
        page.setData({
          verifyText: '重新发送',
          duration: duration,
          disabled: disabled
        })
      }
    }, 1000)
    // 发送验证码
    wx.request({
      url: util.api + '/api/index/sendcode',
      data: {
        'data': util.pass_token({ mobile: mobile })
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (verifyRes) {
        if (verifyRes.data.code === 100) {
          tip.showToast(verifyRes.data.info);
        } else {
          tip.showToast(verifyRes.data.info, 'none');
        }
      },
      fail: function (err) {
        tip.showToast('验证码发送失败', 'none', 2000)
      }
    })
  }
}
// 权限方法
function authorityHttp(url, data, cb) {
  wx.request({
    url: util.api + url,
    data: data,
    method: 'POST',
    header: { 'content-type': 'application/x-www-form-urlencoded'},
    success: function (res) {
      console.log(res);
      if (res.data.code !== 999) {
        if (res.data.code === 100) {
          tip.showToast(res.data.info);
          if (res.data.data) {
            return typeof cb === 'function' && cb(res.data)
          } 
        } else {
          tip.showToast(res.data.info, 'none', 2000)
        }
      } else {
        wx.redirectTo({
          url: '/pages/user/userLogin/userLogin'
        })
      }
    },
    fail: function () {
      return typeof cb === 'function' && cb(false)
    }
  })
} 
// export 
module.exports = {
  handleFocus: handleFocus,
  handleBlur: handleBlur,
  verifyMoblie: verifyMoblie,
  verifyPsd: verifyPsd,
  verifyName: verifyName,
  messageVerfiy: messageVerfiy,
  authorityHttp: authorityHttp
}