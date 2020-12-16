/*
 * @Descripttion: 微信API Promise转化
 * @Author: pujianguo
 * @Date: 2020-12-07 09:34:15
 */

 /** ********************** 授权 ************************/
export const wxLogin = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: res => resolve(res),
      fail: err => reject(err)
    })
  })
}

/** ********************** 获取用户授权信息 ************************/
export const wxGetSetting = () => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      withCredentials: true,
      success: res => resolve(res),
      fail: err => reject(err)
    })
  })
}

/** ********************** 获取用户个人信息 ************************/
export const wxGetUserInfo = () => {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      withCredentials: true,
      success: res => resolve(res),
      fail: err => reject(err)
    })
  })
}

/** ********************** 选择图片 ************************/
export const wxChooseImage = (count = 1) => {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count: count,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: result => resolve(result),
      fail: err => reject(err)
    })
  })
}

// 获取图片信息
export const wxGetImageInfo = (src) => {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: src,
      success: result => resolve(result),
      fail: err => reject(err)
    })
  })
}

// 保存canvas画布
export const wxCanvasToTempFilePath = (params) => {
  return new Promise((resolve, reject) => {
    wx.canvasToTempFilePath({
      ...params,
      success: result => resolve(result),
      fail: err => reject(err)
    })
  })
}

// 保存图片到本地
export const wxSaveImageToPhotosAlbum = (filePath) => {
  return new Promise((resolve, reject) => {
    wx.saveImageToPhotosAlbum({
      filePath:filePath ,
      success: result => resolve(result),
      fail: err => reject(err)
    })
  })
}
