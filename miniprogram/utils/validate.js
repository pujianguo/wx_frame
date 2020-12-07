/*
 * @Descripttion: 表单验证
 * @Author: pujianguo
 * @Date: 2020-12-07 13:58:22
 */

/**
 * select 包含了picker, radio, 都是字符串，没有其他属性，定义时校验required, 不校验时不写在rule中即可
 * 不需要required的有：select, image, images, 不校验时不写在rule中即可
 * 邮箱和手机号码为特殊类型
 * string, number, array 均有min和max属性
 * string有正则验证，并且需要传递错误提示
 */
/**
{ key: 'name', label: '姓名', type: 'string', required: true, min: 5, max: 10, regexp: /^[0-9a-zA-Z]*$/, regMsg: '只能包含大小写字母，数字和下划线' },
{ key: 'age', label: '年龄', type: 'number', required: true, min: 1, max: 100 },
{ key: 'email', label: '邮箱', type: 'email', required: true },
{ key: 'phone', label: '手机号码', type: 'phone', required: true },
{ key: 'code', label: '验证码', type: 'string', regexp: /^\d{4}$/, regMsg: '4位数字' },
{ key: 'money', label: '收入', type: 'number', required: true },
{ key: 'checkbox', label: '爱好', type: 'array', required: true, min: 1, max: 2 },
{ key: 'cardType', label: '证件类型', type: 'select' },
{ key: 'radio', label: '学历', type: 'select' },
{ key: 'images', label: '生活照', type: 'images' },
{ key: 'card1', label: '身份证正面照 ', type: 'image' },
{ key: 'card2', label: '身份证反面照 ', type: 'image' }
 *
 */
export default (data, rules) => {
  let msg = ''
  for (let i = 0; i < rules.length; i++) {
    let rule = rules[i]
    let value = data[rules[i].key]

    if (['string', 'phone', 'email', 'number'].includes(rule.type) && value === '') {
      if (rule.required) {
        return `请填写${rule.label}`
      } else {
        continue
      }
    }
    if (rule.type === 'array' && value.length === 0) {
      if (rule.required) {
        return `请至少选择一个${rule.label}`
      } else {
        continue
      }
    }

    if (rule.type === 'select' && value === '') {
      return `请选择${rule.label}`
    }
    if (rule.type === 'images' && value.length === 0) {
      return `请至少上传一张${rule.label}`
    }
    if (rule.type === 'image' && value === '') {
      return `请上传${rule.label}`
    }
    switch (rule.type) {
      case 'phone':
        if (!(/^1\d{10}$/).test(value)) {
          return `请检查${rule.label}格式`
        }
        break
      case 'email':
        if (!(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/).test(value)) {
          return `请检查${rule.label}格式`
        }
        break
      case 'array':
        if (rule.min && value.length < rule.min) {
          return `${rule.label}最少选择${rule.min}个`
        }
        if (rule.max && value.length > rule.max) {
          return `${rule.label}最多选择${rule.max}个`
        }
        break
      case 'string':
        if (rule.min && value.length < rule.min) {
          return `${rule.label}最少${rule.min}个字符`
        }
        if (rule.max && value.length > rule.max) {
          return `${rule.label}最多${rule.max}个字符`
        }
        if (!rule.regexp.test(value)) {
          return `请检查${rule.label}格式：${rule.regMsg}`
        }
        break
      case 'number':
        if (rule.min && Number(value) < rule.min) {
          return `${rule.label}最小值为${rule.min}`
        }
        if (rule.max && Number(value) > rule.max) {
          return `${rule.label}最大值为${rule.max}`
        }
        break
    }
  }
  return msg
}
