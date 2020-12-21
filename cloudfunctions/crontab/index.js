// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request-promise')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  throwOnNotFound: false, // 数据库获取不到，返回空，不返回异常
})

const db = cloud.database()
const MUSIC_BASE_URL = ' http://neteasecloudmusicapi.zhaoboy.com'
const musicBannerCollection = db.collection('music_banner')

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    if (!event.action) {
      // 同步所有信息
      syncMusicBanner()
      return '同步成功'
    }
    // 只同步musicBanner
    if (event.action === 'musicBanner') {
      await syncMusicBanner()
      return 'ok'
    }
  } catch (err) {
    return err
  }
}

// 同步音乐Banner
async function syncMusicBanner () {
  // 删除原来所有的数据
  const _ = db.command
  await musicBannerCollection.where({
    targetId: _.gt(0),
  }).remove()

  // 获取数据
  const res = await request(MUSIC_BASE_URL + '/banner').then(res => {
    res = JSON.parse(res)
    if (res.code === 200) {
      return res.banners
    } else {
      // 错误格式保持和微信报错一致
      return { errCode: -1, errMsg: '获取数据失败' }
    }
  }).catch(_ => {
    return { errCode: -1, errMsg: '网络异常' }
  })

  if (!res.errCode) {
    // 保存数据
    const apis = res.filter(x => x.targetId).map(x => {
      return musicBannerCollection.add({
        data: {
          imageUrl: x.imageUrl,
          targetId: x.targetId,
          createTime: db.serverDate(),
        },
      })
    })
    const result = await Promise.all(apis)
    return result
  } else {
    return Promise.reject(res)
  }
}
