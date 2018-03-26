'use strict'

module.exports = {
  formatDate(d, fmt) {
    fmt = fmt || 'yyyy-MM-dd hh:mm:ss'; //支持的格式模板部件有：y--年份，M--月份，d--日，h--24制小时，H--12制小时，m--分

    let o = {
      "M+": d.getMonth() + 1, //月份
      "d+": d.getDate(), //日
      "H+": d.getHours() % 12 === 0 ? 12 : d.getHours() % 12, //小时
      "h+": d.getHours(), //小时
      "m+": d.getMinutes(), //分
      "s+": d.getSeconds(), //秒
      "S": d.getMilliseconds() //毫秒
    };

    /(y+)/.test(fmt) && (fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length)));

    for (let k in o) {
      let v = o[k];
      new RegExp("(" + k + ")").test(fmt) && (fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? v : ("00" + v).substr(("" + v).length)));
    }
    return fmt;
  },

  formatLocalDate(date, hasWeek) {
    date = this.isDate(date) ? date : new Date(date);
    let week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let fmt = date.getFullYear() + '-' + this.zero(date.getMonth() + 1) + '-' + this.zero(date.getDate());
    if (hasWeek) fmt += ' ' + week[date.getDay()];
    return fmt;
  },

  isDate(date) {
    return Object.prototype.toString.call(date) === '[object Date]';
  },

  getLocalMonth(month) {
    return 'January February March April May June July August September October November '.split(' ')[month];
  },

  // 生成4位数的随机数字符串
  getRandom(len) {
    let max = Math.pow(10, len) - 1;
    let n = '' + Math.ceil(Math.random() * max);
    if (n.length >= len) return n;
    let prefix = '';
    for (let i = 0; i < len - n.length; i++) prefix += '0';
    return prefix + n;
  },

  // 大写金额
  getMoneyUpper(num) {
    let str = '';
    let unit = '仟佰拾亿仟佰拾万仟佰拾元角分';
    num += '00';
    let intPos = num.indexOf('.');
    if (intPos >= 0) num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
    unit = unit.substr(unit.length - num.length);
    for (let i = 0; i < num.length; i++) {
      str += '零壹贰叁肆伍陆柒捌玖'.substr(num.substr(i, 1), 1) + unit.substr(i, 1);
    }
    return str.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, '零元');
  },

  wrapResult(success = true, msg = '', result = null){
    return { success, msg, result }
  },

  response(res, data) {
    res.json(this.wrapResult(true, null, data));
  },

  createId(prefix, len, caller) {
    return new Promise((resolve, reject) => {
      let _create = () => {
        let id = prefix + this.getRandom(len);
        return caller.checkExists(id)
          .then((data) => {
            if (data.length) return _create();
            resolve(id);
          })
          .catch(err => reject(err))
      };
      return _create();
    });
  },

  zero(n, len = 2) {
    n = '' + n;
    if (n.length >= len) return n;
    let prefix = '';
    for (let i = 0; i < len - n.length; i++) prefix += '0';
    return prefix + n;
  }
}
