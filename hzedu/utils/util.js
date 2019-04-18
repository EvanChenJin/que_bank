// 常用工具函数
var tip = require('./tip.js');
// 基本常量
const api = 'https://hengzhen.utuiwu.com';
const appid = 'sdfewodf';
const appsecret = '343sd5#48GH';
const token = wx.getStorageSync('token');
const myLetterAry = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];
const queType = ['单选题', '多选题', '判断题'];
// 加解密算法
// var md5 = require('md5.js');
var base64 = require('base64.js');
var md5 = require('miniproMd5.js');
// pass token
function pass_token(obj) {
  obj['appid'] = appid;
  var jsonSort_res = _jsonSort(obj) + '&appsecret=' + appsecret;
  // var jsonSort_res_sc = md5.hexMD5(jsonSort_res).toUpperCase();
  var jsonSort_res_sc = md5.md5(jsonSort_res).toUpperCase();
  obj['sign'] = jsonSort_res_sc
  obj['token'] = wx.getStorageSync('token')
  var base64_encode = base64.encode(JSON.stringify(obj));
  return base64_encode;
}
function _jsonSort(jsonObj) {
  let arr = [];
  for (var key in jsonObj) {
    if (!Array.isArray(jsonObj[key]) && key != 'token' && key != 'sign') {
      arr.push(key)
    }
  }
  arr.sort();
  let str = '';
  for (var i in arr) {
    str += arr[i] + "=" + jsonObj[arr[i]] + "&"
  }
  return str.substr(0, str.length - 1)
}
// 数据请求
function http(loadingText, noDataText, url, data, cb) {
  tip.showLoading(loadingText);
  wx.request({
    url: api + url,
    data: data,
    method: 'POST',
    header: {'content-type': 'application/x-www-form-urlencoded'},
    success: function (res) {
      var resData = res.data;
      if (resData.code !== 999) {
        if (resData.code === 100) {
           tip.hideLoading();
           console.log(resData);
           if (!resData.hasOwnProperty('data')) {
             console.log('have no data property')
             tip.showToast(resData.info, 2000)
             return typeof cb === 'function' && cb();
           } else {
             console.log('have data property')
             if (!resData.data) {
               tip.showToast(noDataText, 'none')
             } else if (tip.isEmptyArray(resData.data)) {
               console.log('empty array')
               tip.showToast(noDataText, 'none')
             } else if (tip.isEmptyObject(resData.data)) {
               console.log('empty object')
               tip.showToast(noDataText, 'none')
             } else {
               tip.showToast(resData.info, 2000);
               return typeof cb === 'function' && cb(resData.data);
             }
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
    fail: function (err) {
      return typeof cb == "function" && cb(err);
      tip.hideLoading()
      tip.showToast(err, 'none', 2000)
    },
    complete: function () {
      tip.hideLoading()
    }
  })
}
// 列表请求
function getList(page, p, loadingText, noDataText, url, data, cb) {
  console.log(p);
  tip.showLoading(loadingText);
  wx.request({
    url: api + url,
    data: data,
    method: 'POST',
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    success: function (res) {
      var resData = res.data;
      if (resData.code !== 999) {
        if (resData.code === 100) {
          tip.hideLoading();
          // 返回的数据
          console.log(resData.data);
          if (!resData.hasOwnProperty('data')) {
            console.log('have no data property')
            tip.showToast(resData.info, 2000)
            return typeof cb === 'function' && cb();
          } else {
            console.log('have data property')
            if ( !resData.data || tip.isEmptyArray(resData.data) || tip.isEmptyArray(resData.data) ) {
              // 有数据且数据为空
              if (p > 1) {
                tip.showToast('没有更多了!', 'none', 2000);
                page.setData({
                  isReqDataEmpty: true
                })
              } else {
                tip.showToast(noDataText, 'none');
              }
              return typeof cb === 'function' && cb(resData.data);
            } else {
              // 有数据且数据不为空
              tip.showToast(resData.info, 2000);
              return typeof cb === 'function' && cb(resData.data);
            }
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
    fail: function (err) {
      return typeof cb == "function" && cb(false);
      tip.hideLoading()
      tip.showToast(err, 'none', 2000)
    },
    complete: function () {
      tip.hideLoading()
    }
  })
}
// 格式化日期
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute,    second].map(formatNumber).join(':')
}
// 格式化数字
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// export
module.exports = {
  pass_token: pass_token,
  http: http,
  getList: getList,
  formatTime: formatTime,
  api: api,
  myLetterAry: myLetterAry,
  queType: queType
}
