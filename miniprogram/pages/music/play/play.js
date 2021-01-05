const { cloudRequest } = require('../../../utils/request')

// 获取全局唯一的背景音频管理器
const bgAudioManager = wx.getBackgroundAudioManager()

Page({
  data: {
    music: {},
    playing: false,
  },
  state: {
    palyIndex: 0,
    playList: [],
  },

  onLoad: function (options) {
    const id = options.id
    this.getData(id)
  },

  onShareAppMessage: function () {},

  getData (id) {
    console.log('id', id)
    cloudRequest({
      name: 'music',
      data: {
        $url: 'detail',
        id: id,
      },
    }).then(res => {
      console.log('res', res)
      wx.setNavigationBarTitle({ title: res.name })
      this.setData({
        music: res,
        playing: true,
      })
      bgAudioManager.title = res.name
      bgAudioManager.epname = res.album // 专题
      bgAudioManager.singer = res.singer
      bgAudioManager.coverImgUrl = res.picUrl
      bgAudioManager.src = res.url // 设置了 src 之后会自动播放
    })
  },

  togglePlaying () {
    if (this.data.playing) {
      bgAudioManager.pause()
    } else {
      bgAudioManager.play()
    }
    this.setData({ playing: !this.data.playing })
  },
  // 上一首
  onPrev () {
    this.state.palyIndex--
    if (this.state.palyIndex < 0) {
      this.state.palyIndex = this.state.playList.length - 1
    }
    this.getData()
  },
  // 下一首
  onNext () {
    this.state.palyIndex++
    if (this.state.palyIndex === this.state.playList.length) {
      this.state.palyIndex = 0
    }
    this.getData()
  },
})
