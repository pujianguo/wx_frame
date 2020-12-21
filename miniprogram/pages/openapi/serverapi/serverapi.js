import { hideRequestLoading, showModalInfo, showRequestLoading, showToastError, showToastSuccess } from '../../../utils/func'
import { cloudRequest } from '../../../utils/request'

Page({
  data: {
    templateId: '',
    subscribeMessageResult: '',
    requestSubscribeMessageResult: '',
    wxacodeSrc: '',
    wxacodeResult: '',
    showClearWXACodeCache: false,
  },

  // 获取模板ID
  getSubscribeMessageTemplate () {
    cloudRequest({
      loading: true,
      name: 'openapi',
      data: {
        action: 'requestSubscribeMessage',
      },
    }).then(res => {
      showToastSuccess('获取成功')
      this.setData({ templateId: res })
    }).catch(err => {
      showToastError('获取失败')
      console.error('[云函数] [openapi] 获取订阅消息模板 调用失败：', err)
    })
  },

  // 打开弹框询问用户是否允许
  requestSubscribeMessage () {
    const templateId = this.data.templateId
    if (!templateId) {
      showModalInfo('发送失败', '请先获取模板 ID')
    }

    // 开发者工具无法调试，在手机弹出选择框，用户点击
    /**
     * 返回数据格式：
     * * 取消：
     *  {
     *    errMsg: "requestSubscribeMessage:ok",
     *    kypL55KVgSYWqBc1VqJC80rV1nkSW-DiL08zkjrefZk: "reject"
     *  }
     * * 允许：
     *  {
     *    errMsg: ""requestSubscribeMessage:ok",
     *    kypL55KVgSYWqBc1VqJC80rV1nkSW-DiL08zkjrefZk: "accept"
     *  }
     *
     * * 弹框最下面询问“总是保持以上选择，不再询问”
     *   勾选之后，一直保存
     */
    wx.requestSubscribeMessage({
      tmplIds: [templateId],
    }).then(res => {
      if (res[templateId] === 'accept') {
        this.setData({
          requestSubscribeMessageResult: '成功',
        })
      } else {
        this.setData({
          requestSubscribeMessageResult: `失败（${res[templateId]}）`,
        })
      }
    }).catch(err => {
      this.setData({
        requestSubscribeMessageResult: `失败（${JSON.stringify(err)}）`,
      })
    })
  },

  // 发送订阅消息
  /**
   *
   * 发送前 请先通过 wx.requestSubscribeMessage() 获取用户权限，用户点击允许之后才能发送，否则 发送失败
   * 如果用户勾选了“保存选择”，以后可以直接使用
   * 若果用户没有勾选“保存选择”，以后每次调用前必须打开弹框询问
   * 询问之后 -> 调用 之后，下次再调用就得重新询问，否则失败
   */
  sendSubscribeMessage (e) {
    // 清空调用结果展示
    this.setData({ subscribeMessageResult: '' })
    cloudRequest({
      name: 'openapi',
      data: {
        action: 'sendSubscribeMessage',
        templateId: this.data.templateId,
      },
    }).then(res => {
      console.warn('[云函数] [openapi] subscribeMessage.send 调用成功：', res)
      showModalInfo('发送成功', '请返回微信主界面查看')
      this.setData({
        subscribeMessageResult: JSON.stringify(res),
      })
    }).catch(err => {
      showToastError('调用失败')
      console.error('[云函数] [openapi] subscribeMessage.send 调用失败：', err)
    })
  },

  // 获取小程序码
  onGetWXACode () {
    this.setData({
      wxacodeSrc: '',
      wxacodeResult: '',
      showClearWXACodeCache: false,
    })

    // 此处为演示，将使用 localStorage 缓存，正常开发中文件 ID 应存在数据库中
    const fileID = wx.getStorageSync('wxacodeCloudID')

    if (fileID) {
      // 有云文件 ID 缓存，直接使用该 ID
      // 如需清除缓存，选择菜单栏中的 “工具 -> 清除缓存 -> 清除数据缓存”，或在 Storage 面板中删掉相应的 key
      this.setData({
        wxacodeSrc: fileID,
        wxacodeResult: '从本地缓存中取得了小程序码的云文件 ID',
        showClearWXACodeCache: true,
      })
      console.log(`从本地缓存中取得了小程序码的云文件 ID：${fileID}`)
    } else {
      // 调用云函数，获取小程序码
      cloudRequest({
        loading: true,
        name: 'openapi',
        data: {
          action: 'getWXACode',
        },
      }).then(res => {
        this.setData({
          wxacodeSrc: res,
          wxacodeResult: '云函数获取二维码成功',
          showClearWXACodeCache: true,
        })
        showToastSuccess('调用成功')
        wx.setStorageSync('wxacodeCloudID', res)
        console.warn('[云函数] [openapi] wxacode.get 调用成功：', res)
      }).catch(err => {
        showToastError('调用失败')
        console.error('[云函数] [openapi] wxacode.get 调用失败：', err)
      })
    }
  },

  clearWXACodeCache () {
    this.setData({
      wxacodeSrc: '',
      wxacodeResult: '',
      showClearWXACodeCache: false,
    })
    wx.removeStorageSync('wxacodeCloudID')
    showToastSuccess('清除成功')
  },

})
