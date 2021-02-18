// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request-promise')
const cheerio = require('cheerio')
const TcbRouter = require('tcb-router')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event })

  // 天气
  app.router('tianqi', async (ctx, next) => {
    const url = 'https://tianqi.moji.com/weather/china/' + event.city
    try {
      const html = await request(url)
      const $ = cheerio.load(html)

      let weatherTip = '' // 今日天气提醒
      const threeDaysData = [] // 最近三天天气

      $('.wea_tips').each(function (i, elem) {
        weatherTip = $(elem).find('em').text()
      })
      $('.forecast .days').each(function (i, elem) {
        const SingleDay = $(elem).find('li')
        threeDaysData.push({
          Day: $(SingleDay[0]).text().replace(/(^\s*)|(\s*$)/g, ''),
          WeatherImgUrl: $(SingleDay[1]).find('img').attr('src'),
          WeatherText: $(SingleDay[1]).text().replace(/(^\s*)|(\s*$)/g, ''),
          Temperature: $(SingleDay[2]).text().replace(/(^\s*)|(\s*$)/g, ''),
          WindDirection: $(SingleDay[3]).find('em').text().replace(/(^\s*)|(\s*$)/g, ''),
          WindLevel: $(SingleDay[3]).find('b').text().replace(/(^\s*)|(\s*$)/g, ''),
          Pollution: $(SingleDay[4]).text().replace(/(^\s*)|(\s*$)/g, ''),
          PollutionLevel: $(SingleDay[4]).find('strong').attr('class'),
        })
      })
      ctx.body = { tip: weatherTip, days: threeDaysData }
    } catch (err) {
      console.log('err', err)
      ctx.body = err
    }
  })

  return app.serve()
}
