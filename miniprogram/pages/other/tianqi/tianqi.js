import { showModalInfo, showToastSuccess } from '../../../utils/func'
import { cloudRequest } from '../../../utils/request'

Page({
  data: {
    text: '',
  },
  onLoad: function (options) {
  },

  async onClick (e) {
    const { city } = e.currentTarget.dataset
    cloudRequest({
      loading: true,
      hideErrorInfo: true,
      name: 'other',
      data: {
        $url: 'tianqi',
        city: city,
      },
    }).then(res => {
      const day = res.days[0]
      const text = `今天天气：${day.WeatherText} ${this.getIcon(day.WeatherText)}，
气温：${day.Temperature}，
爱心小提示：${res.tip}`
      this.setData({ text: text })

      console.log('res tianqi:', text)
    }).catch(err => {
      showModalInfo('获取失败', err.errMsg)
    })
  },

  copyText () {
    wx.setClipboardData({
      data: this.data.text,
      success () {
        showToastSuccess('复制成功')
      },
    })
  },

  getIcon (text) {
    // ☀️🌤⛅️🌥☁️🌦🌧⛈🌩🌨❄️
    if (text === '晴') {
      return '☀️'
    } else if (text === '多云') {
      return '🌤'
    } else if (text.includes('雨')) {
      return '🌧'
    } else if (text.includes('雪')) {
      return '❄️'
    }
    return ''
  },
})
