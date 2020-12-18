// 解决Promise没有finally
// eslint-disable-next-line no-extend-native
Promise.prototype.finally = function (callback) {
  return this.then(
    value => this.constructor.resolve(callback()).then(() => value),
    reason => this.constructor.resolve(callback()).then(() => { throw reason }),
  )
}

App({
  onLaunch: function () {
    //  判断设备是否为 iPhone X 及以上
    this.checkIsiPhoneX()

    // 云开发初始化
    this.initCloud()
  },
  globalData: {
    isIphoneX: false,
  },

  /** ********** methods ********** **/
  checkIsiPhoneX () {
    wx.getSystemInfo({
      success: res => {
        const model = res.model
        if (model.search('iPhone X') !== -1) {
          this.globalData.isIphoneX = true
        }
      },
    })
  },
  initCloud () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'test-ic03z',
        traceUser: true,
      })
    }
  },
})
