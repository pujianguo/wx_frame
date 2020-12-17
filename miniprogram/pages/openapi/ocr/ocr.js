import { hideRequestLoading, showRequestLoading, showToastError, showToastSuccess } from "../../../utils/func"
import { wxChooseImage } from "../../../utils/wx"

Page({
  data: {
    bankcardResult: '',
    idcardResult: ''
  },

  // 银行卡
  async onBankcard() {
    const imgUrl = await this.chooseImageAndUpload('bankcard')
    console.log('imgUrl', imgUrl)
    wx.cloud.callFunction({
      name: 'ocr',
      data: {
        action: 'bankcard',
        imgUrl: imgUrl
      }
    }).then(res => {
      hideRequestLoading()
      if (res.result.number) {
        showToastSuccess('识别成功')
        this.setData({bankcardResult: '银行卡号:' + res.result.number})
      } else {
        let msg = '识别失败'
        if (res.result.errCode === 101001) {
          msg = '无效的图片'
        }
        showToastError(msg)
      }
      console.log('[云函数] [orc] [银行卡] 调用成功：', res)
    }).catch(err => {
      hideRequestLoading()
      showToastError('识别失败')
      console.error('[云函数] [orc] [银行卡] 调用失败：', err)
      this.setData({bankcardResult: 'error: ' + JSON.stringify(err)})
    })
  },

  // 身份证
  async onIdcard() {
    const imgUrl = await this.chooseImageAndUpload('idcard')
    console.log('imgUrl', imgUrl)
    wx.cloud.callFunction({
      name: 'ocr',
      data: {
        action: 'idcard',
        imgUrl: imgUrl
      }
    }).then(res => {
      hideRequestLoading()
      if (res.result.type) {
        showToastSuccess('识别成功')
        this.setData({idcardResult: '身份证信息:' + JSON.stringify(res.result)})
      } else {
        let msg = '识别失败'
        if (res.result.errCode === 101001) {
          msg = '无效的图片'
        }
        showToastError(msg)
      }
      console.log('[云函数] [orc] [身份证] 调用成功：', res)
    }).catch(err => {
      hideRequestLoading()
      showToastError('识别失败')
      console.error('[云函数] [orc] [身份证] 调用失败：', err)
      this.setData({idcardResult: 'error: ' + JSON.stringify(err)})
    })
  },

  async chooseImageAndUpload (type) {
    try {
      // 选择图片
      const file = await wxChooseImage()
      const filePath = file.tempFilePaths[0]
      const cloudPath = `ocr/${type}${filePath.match(/\.[^.]+?$/)[0]}`
      const params = {
        filePath,
        cloudPath
      }
      showRequestLoading()
      // 上传到云存储
      const uploadRes = await wx.cloud.uploadFile(params)
      // 获取图片链接
      const result = await wx.cloud.getTempFileURL({
        fileList: [uploadRes.fileID]
      })
      return result.fileList[0].tempFileURL
    } catch (e) {
      return e
    }
  }
})
