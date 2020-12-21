import { hideRequestLoading, showModalInfo, showRequestLoading, showToastSuccess } from '../../../utils/func'
import { wxChooseImage } from '../../../utils/wx'
import { cloudRequest } from '../../../utils/request'

Page({
  data: {
    bankcardResult: '',
    idcardResult: '',
  },

  // 银行卡
  async onBankcard () {
    const imgUrl = await this.chooseImageAndUpload('bankcard')
    console.log('imgUrl', imgUrl)
    cloudRequest({
      loading: false,
      hideErrorInfo: true,
      name: 'ocr',
      data: {
        action: 'bankcard',
        imgUrl: imgUrl,
      },
    }).then(res => {
      showToastSuccess('识别成功')
      this.setData({ bankcardResult: '银行卡号:' + res.number })
    }).catch(err => {
      let msg = err.errMsg
      if (err.errCode === 101001) {
        msg = '无效的图片'
      }
      showModalInfo('识别失败', msg)
      this.setData({ bankcardResult: 'error: ' + err.errMsg })
    }).finally(_ => {
      hideRequestLoading()
    })
  },

  // 身份证
  async onIdcard () {
    const imgUrl = await this.chooseImageAndUpload('idcard')
    console.log('imgUrl', imgUrl)
    cloudRequest({
      loading: false,
      hideErrorInfo: true,
      name: 'ocr',
      data: {
        action: 'idcard',
        imgUrl: imgUrl,
      },
    }).then(res => {
      showToastSuccess('识别成功')
      this.setData({ idcardResult: '身份证信息:' + JSON.stringify(res) })
    }).catch(err => {
      let msg = err.errMsg
      if (err.errCode === 101001) {
        msg = '无效的图片'
      }
      showModalInfo('识别失败', msg)
      this.setData({ idcardResult: 'error: ' + err.errMsg })
    }).finally(_ => {
      hideRequestLoading()
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
        cloudPath,
      }
      showRequestLoading()
      // 上传到云存储
      const uploadRes = await wx.cloud.uploadFile(params)
      // 获取图片链接
      const result = await wx.cloud.getTempFileURL({
        fileList: [uploadRes.fileID],
      })
      return result.fileList[0].tempFileURL
    } catch (e) {
      return e
    }
  },
})
