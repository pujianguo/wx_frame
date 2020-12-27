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

  // 无插件直播地址获取
  app.router('home', async (ctx, next) => {
    const urlData = {
      all: 'http://www.17kanzb.com',
      nba: 'http://www.17kanzb.com/nba.html',
      yingchao: 'http://www.17kanzb.com/yingchao.html',
      xijia: 'http://www.17kanzb.com/xijia.html',
      dejia: 'http://www.17kanzb.com/dejia.html',
      yijia: 'http://www.17kanzb.com/yijia.html',
      fajia: 'http://www.17kanzb.com/fajia.html',
    }
    const url = urlData[event.type] || urlData.all
    try {
      const html = await request(url)
      const $ = cheerio.load(html)
      const $trs = $('.against')
      const res = getJsonData($, $trs)
      ctx.body = res
    } catch (err) {
      console.log('err', err)
      ctx.body = err
    }
  })

  // 获取懂球帝直播信息
  app.router('dongqiudi', async (ctx, next) => {
    const allowTypes = ['CBA', 'NBA', '西甲', '英超', '意甲', '德甲', '法甲', '欧冠']
    const urlData = {
      all: 'new/important',
      nba: 'league/new/3010',
      xijia: 'league/new/3',
      yingchao: 'league/new/4',
      dejia: 'league/new/5',
      yijia: 'league/new/9',
      fajia: 'league/new/12',
    }
    // 'https://www.dongqiudi.com/api/data/tab/new/important?start=2020-12-26%2016:00:00'
    // 'https://www.dongqiudi.com/api/data/tab/league/new/4'
    const subUrl = urlData[event.type] || urlData.all
    const start = event.start || new Date()
    const url = 'https://www.dongqiudi.com/api/data/tab/' + subUrl + '?init=1&platform=www&start=' + start
    try {
      let res = await request(url)
      res = JSON.parse(res)
      const list = res.list || []
      ctx.body = list.filter(x => allowTypes.includes(x.competition_name)).map(x => {
        let minute = x.minute
        if (['NBA', 'CBA'].includes(x.competition_name)) {
          minute = x.minute_period + ' ' + minute
        } else {
          minute = minute + '\''
        }

        // 想要设置的开始时间          2020-12-27 21:00:00
        // 实际传入的开始时间少8小时    2020-12-27 13:00:00 需要-8h
        // 获取到的开始时间            2020-12-27 01:30:00
        // 实际的开始时间              2020-12-27 09:30:00 需要+8h

        return {
          start_play: new Date(x.start_play), // 处理后格式化为 2020-12-27T01:30:00.000Z，前端转换后就没有差别了
          type: x.competition_name,
          fs_a: x.fs_A,
          fs_b: x.fs_B,
          team_a_id: x.team_A_id,
          team_a_logo: x.team_A_logo,
          team_a_name: x.team_A_name,
          team_b_id: x.team_B_id,
          team_b_logo: x.team_B_logo,
          team_b_name: x.team_B_name,
          status: x.status, // Fixture  Played Playing
          match_title: x.match_title,
          match_id: x.match_id,
          minute: minute,
        }
      })
    } catch (err) {
      console.log('err', err)
      ctx.body = err
    }
  })

  return app.serve()
}

async function getJsonData ($, $trs) {
  const allowMiniType = ['NBA', '西甲', '英超', '意甲', '德甲', '法甲', '欧冠']
  const res = []
  for (let i = 0; i < $trs.length; i++) {
    const item = $trs[i]
    // 选取td元素
    const children = item.children.filter(x => {
      return x.name === 'td'
    })

    // 大类
    let type = $(children[0]).attr('title')
    if (type === '足球') {
      type = 'football'
    } else if (type === '篮球') {
      type = 'basketball'
    } else {
      continue
    }
    const miniType = $(children[1].children).text()
    if (!allowMiniType.includes(miniType)) {
      continue
    }
    res.push({
      type: type,
      miniType: miniType,
      time: $(children[2]).text(),
      status: $(children[3].children).text(),
      team_a: $(children[4].children).text(),
      team_b: $(children[6].children).text(),
      live_link: children[7].children.filter(x => x.name === 'a' && $(x).text() !== '更多').map(x => {
        return {
          href: $(x).attr('href'),
          text: $(x).text(),
        }
      }),
    })
  }
  return res
}
