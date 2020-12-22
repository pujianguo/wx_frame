import { hideRequestLoading, showModalInfo, showRequestLoading, showToastSuccess } from '../../../utils/func'
import { wxChooseImage } from '../../../utils/wx'
import { cloudRequest } from '../../../utils/request'

Page({
  data: {
    bankcardNumber: '',
    showIdcardFront: false,
    showIdcardBack: false,
    idcardFrontList: [
      { label: '姓名', key: 'name', value: '' },
      { label: '身份证号', key: 'id', value: '' },
      { label: '性别', key: 'gender', value: '' },
      { label: '名族', key: 'nationality', value: '' },
      { label: '出生', key: 'birth', value: '' },
      { label: '住址', key: 'addr', value: '' },
    ],
    idcardBackList: [
      { label: '签发机关', key: 'authority', value: '' },
      { label: '有效期限', key: 'validDate', value: '' },
    ],
  },
  onLoad () {
  },

  // 银行卡
  async onBankcard () {
    try {
      const imgUrl = await this.chooseImageAndUpload('bankcard')
      const res = await cloudRequest({
        hideErrorInfo: true,
        name: 'ocr',
        data: {
          action: 'bankcard',
          imgUrl: imgUrl,
        },
      })
      hideRequestLoading()
      showToastSuccess('识别成功')
      this.setData({ bankcardNumber: res.number })
    } catch (err) {
      // chooseImageAndUpload 中的异常一会捕获到，这里没有细分各种错误，只在这里统一处理，并对一些特殊错误做特殊处理
      // 特殊处理1：取消选择图片 (err.errMsg !== 'chooseImage:fail cancel')
      // 特殊处理2：图片无效 (err.errCode === 101001)
      hideRequestLoading()
      if (err.errMsg !== 'chooseImage:fail cancel') {
        let msg = err.errMsg
        if (err.errCode === 101001) {
          msg = '无效的图片'
        }
        showModalInfo('识别失败', msg)
        this.setData({ bankcardNumber: '' })
      }
    }
  },

  // 身份证
  async onIdcard () {
    try {
      const imgUrl = await this.chooseImageAndUpload('idcard')
      const res = await cloudRequest({
        hideErrorInfo: true,
        name: 'ocr',
        data: {
          action: 'idcard',
          imgUrl: imgUrl,
        },
      })
      hideRequestLoading()
      if (res.type === 'Front') {
        showToastSuccess('正面照')
        const list = this.data.idcardFrontList.map(x => {
          x.value = res[x.key] || ''
          return x
        })
        this.setData({ showIdcardFront: true, idcardFrontList: list })
      } else { // type = 'Back'
        showToastSuccess('背面照')
        const list = this.data.idcardBackList.map(x => {
          x.value = res[x.key] || ''
          return x
        })
        this.setData({ showIdcardBack: true, idcardBackList: list })
      }
    } catch (err) {
      hideRequestLoading()
      if (err.errMsg !== 'chooseImage:fail cancel') {
        let msg = err.errMsg
        if (err.errCode === 101001) {
          msg = '无效的图片'
        }
        showModalInfo('识别失败', msg)
      }
    }
  },

  async chooseImageAndUpload (type) {
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
    return result.fileList[0].tempFileURL + '?t=' + (new Date()).getTime()
  },

  copyBankcard () {
    if (this.data.bankcardNumber) {
      wx.setClipboardData({
        data: this.data.bankcardNumber,
        success () {
          showToastSuccess('复制成功')
        },
      })
    }
  },
  copyIdcard (e) {
    const { value } = e.currentTarget.dataset
    wx.setClipboardData({
      data: value,
      success () {
        showToastSuccess('复制成功')
      },
    })
  },
})
