import { filter, hideRequestLoading, showModalInfo, showRequestLoading, showToastError, showToastSuccess } from '../../utils/func'
import { wxChooseImage, wxGetSetting, wxGetUserInfo } from '../../utils/wx'
import { cloudRequest } from '../../utils/request'

const app = getApp()

Page({
  data: {
    avatarUrl: '../../images/cloud/user-unlogin.png',
    userInfo: {},
    logged: false, // 登录标记
    imgUrl: '',
    date: filter('minute', new Date()),
    decimalString: filter('decimalString', 122, 2),
  },

  async onLoad () {
    // 获取用户授权信息，getUserInfo前必须验证已授权，不然报错
    const auth = await wxGetSetting()
    if (!auth.authSetting['scope.userInfo']) {
      return
    }
    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    const res = await wxGetUserInfo()
    this.setData({
      avatarUrl: res.userInfo.avatarUrl,
      userInfo: res.userInfo,
    })
  },

  // 获取用户信息
  onGetUserInfo (e) {
    console.log(e)
    // a. 未授权时，打开授权弹框，点击按钮后 获取到 e，并且点击“允许”后，e.detail中的能获取到 userInfo
    // b. 已授权时，不会展示弹框，直接能获取到 e
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo,
      })
    }
  },

  // 获取openid
  onGetOpenid () {
    cloudRequest({
      loading: true,
      name: 'login',
    }).then(res => {
      app.globalData.openid = res.openid
      showToastSuccess('云函数调用成功')
    }).catch(_ => {
      console.log('err', _)
    })
  },

  // 上传图片
  doUpload () {
    // 选择图片
    wxChooseImage().then(file => {
      const filePath = file.tempFilePaths[0]
      const cloudPath = `my-image${filePath.match(/\.[^.]+?$/)[0]}`
      showRequestLoading('上传中')
      wx.cloud.uploadFile({
        filePath,
        cloudPath,
      }).then(res => {
        showToastSuccess('上传成功')
        console.log('[上传文件] 成功：', res)
        console.log('文件ID:', res.fileID)
        console.log('云文件路径:', cloudPath)
        console.log('本地文件地址:', filePath) // 可以放到image标签上查看
        this.setData({ imgUrl: res.fileID }) // 可以直接将 fileID 设置为图片 src
        // this.setData({imgUrl: filePath})
      }).catch(_ => {
        showToastError('上传失败')
      }).finally(_ => {
        hideRequestLoading()
      })
    })
  },
  previewImg () {
    wx.previewImage({
      current: this.data.imgUrl,
      urls: [this.data.imgUrl],
    })
  },

  // 调用云函数
  onSum () {
    cloudRequest({
      loading: true,
      name: 'sum',
      data: { a: 1, b: 2 },
    }).then(res => {
      showToastSuccess('调用成功')
    }).catch(_ => {})
  },

  // 同步音乐Banner
  syncMusicBanner () {
    cloudRequest({
      loading: '同步中...',
      hideErrorInfo: true,
      name: 'crontab',
      data: {
        action: 'musicBanner',
      },
    }).then(res => {
      showToastSuccess('同步成功')
    }).catch(err => {
      showModalInfo('同步失败', err.errMsg)
    })
  },
})
