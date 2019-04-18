// layer tip
function showToast(title, icon="success", duration=1500, mask=false) {
  wx.showToast({
    title: title,
    icon: icon,
    duration: duration,
    mask: mask
  })
}
function hideToast() {
  wx.hideToast()
}
function showLoading(title="数据加载中", mask=true) {
  wx.showLoading({
    title: title,
    mask: mask
  })
}
function hideLoading() {
  wx.hideLoading()
}
function showModal(title = "提示", content, showCancel=true,cancelText='取消',confirmText='确认',cb) {
  wx.showModal({
    title: title,
    content: content,
    showCancel: showCancel,
    cancelText: cancelText,
    confirmText: confirmText,
    success: function (res) {
      if (res.confirm) {
        typeof cb === 'function' && cb(res.confirm)
      }
    }
  })
}
// isEmptyArray 
function isEmptyArray (ary) {
  return Object.prototype.toString.call(ary) === '[object Array]' && ary.length === 0;
}
// isEmptyObject
function isEmptyObject (obj) {
  for (var key in obj) return !1
  return !0
}
// export
module.exports = {
  isEmptyArray: isEmptyArray,
  isEmptyObject: isEmptyObject,
  showToast: showToast,
  showLoading: showLoading,
  hideToast: hideToast,
  hideLoading: hideLoading,
  showModal: showModal
}