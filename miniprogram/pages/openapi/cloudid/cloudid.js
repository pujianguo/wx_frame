import { showToastError, showToastSuccess } from "../../../utils/func"
import { wxGetSetting } from "../../../utils/wx"

// miniprogram/pages/openapi/cloudid/cloudid.js
Page({

  data: {
    weRunResult: '',
    userInfoResult: '',
  },

  // 获取微信运动数据
  onGetWeRunData() {
    /**
     * 获取微信运动数据
     * 没有权限时，弹框选择权限
     * 选完之后一直保留，重新选择需要清空缓存
     * * 拒绝：保留了记录，要想重新选择允许，得删除缓存
     * * 允许：保留了记录，再次点击直接进入success回调函数中
     */
    wx.getWeRunData({
      success: res => {
        console.log('run', res)
        wx.cloud.callFunction({
          // 1.
          // name: 'echo',
          // data: {
          //   // info 字段在云函数 event 对象中会被自动替换为相应的敏感数据
          //   info: wx.cloud.CloudID(res.cloudID),
          // },

          // 2.
          name: 'openapi',
          data: {
            action: 'getOpenData',
            openData: {
              list: [
                res.cloudID,
              ]
            }
          }
        }).then(res => {
          this.setData({weRunResult: JSON.stringify(res.result)})
          showToastSuccess('敏感数据获取成功')
          console.log('[onGetWeRunData] 收到 echo 回包：', res)
        }).catch(err => {
          showToastError('敏感数据获取失败')
          console.log('[onGetWeRunData] 失败：', err)
        })
      }
    })
  },

  onGetUserInfo(e) {
    wx.cloud.callFunction({
      // 1.
      name: 'echo',
      data: {
        // info 字段在云函数 event 对象中会被自动替换为相应的敏感数据
        info: wx.cloud.CloudID(e.detail.cloudID),
      },

      // 2.
      // name: 'openapi',
      // data: {
      //   action: 'getOpenData',
      //   openData: {
      //     list: [
      //       e.detail.cloudID,
      //     ]
      //   }
      // }

    }).then(res => {
      console.log('[onGetUserInfo] 调用成功：', res)

      this.setData({
        userInfoResult: JSON.stringify(res.result),
      })

      wx.showToast({
        title: '敏感数据获取成功',
      })
    })
  }
})
