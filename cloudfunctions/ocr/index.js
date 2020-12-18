// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'bankcard': {
      return getBankcard(event)
    }
    case 'idcard': {
      return getIdcard(event)
    }
    default: {
      return ''
    }
  }
}

// 银行卡
async function getBankcard (event) {
  try {
    const result = await cloud.openapi.ocr.bankcard({
      type: 'photo',
      imgUrl: event.imgUrl,
    })
    return result
  } catch (err) {
    return err
  }
}

// 身份证
async function getIdcard (event) {
  try {
    const result = await cloud.openapi.ocr.idcard({
      type: 'photo',
      imgUrl: event.imgUrl,
      // img: {
      //   contentType: 'image/png',
      //   value: Buffer
      // }
    })
    return result
  } catch (err) {
    return err
  }
}
