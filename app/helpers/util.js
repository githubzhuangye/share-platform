import React, { Children } from 'react';
import { Select } from 'antd';
import { filter, map, pickBy, head, flow, values, isArray } from 'lodash/fp';
import md5 from 'blueimp-md5';
import moment from 'moment';
import { SIGN_KEY, DATE_INTERVAL, COUPON_TYPE } from 'config/constants.js';
import store from 'config/store.js';
import { setTab } from 'redux/modules/tab';

const Option = Select.Option;
const { SINGLE, BRAND, SINGLERATE, VOUCHER, VOUCHERRATE } = COUPON_TYPE;

export function parseArrToStr(arr) {
  let str = ''
  for (let i = 0; i < arr.length; i++) {
    str += arr[i]
    if (i !== arr.length - 1) {
      str += ','
    }
  }
  return str
}

export function formatDate(date, tag) {
  var getMonth = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1);
  var getDate = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
  // var getHours=date.getHours()>=10?date.getHours():"0"+date.getHours();
  // var getMinutes=date.getMinutes()>=10?date.getMinutes():"0"+date.getMinutes();
  // var getSeconds=date.getSeconds()>=10?date.getSeconds():"0"+date.getSeconds();
  if (tag == 0) {
    return date.getFullYear() + "-" + getMonth + "-" + getDate + " 00:00:00"; //return date.getFullYear() + "-" + getMonth + "-" + getDate + " " + getHours + ":" + getMinutes + ":" + getSeconds;
  } else {
    return date.getFullYear() + "-" + getMonth + "-" + getDate + " 23:59:59";
  }
}

export function extractChildren(children, keyProp, openedKeys) {
  return Children.toArray(children).filter(item => openedKeys.includes(item.props[keyProp]));
}

export function addRequiredDecorator(fields, getFieldDecorator) {
  const fieldDecorators = fields
    .map(field => {
      const requiredOption = {
        validate: [{
          rules: [
            { required: true, message: '请填写该选项' }
          ],
          trigger: 'onBlur'
        }]
      };
      if (typeof field === 'string') {
        return getFieldDecorator(field, requiredOption);
      } else {
        return getFieldDecorator(field.field, {...requiredOption, ...field.options});
      }
    })
    .reduce((total, cur, index, arr) => {
      const fieldName = typeof fields[index] === 'string' ? fields[index] : fields[index].field ;
      total[fieldName] = cur;
      return total;
    }, {});
  return fieldName => fieldDecorators[fieldName];
}

// 对表单数据过滤和处理
export function isValidField(fieldValue) {
  return fieldValue !== null && fieldValue !== undefined && fieldValue !== '';
}

export function filterFormData(formData, ...predicates) {
  const allPredicates = [isValidField, ...predicates];
  return allPredicates
    .reduce((obj, predicate) => pickBy(predicate, obj), formData);
}

export function transformDate(obj, formatStr = 'YYYY-MM-DD') {
  if (obj instanceof Date) {
    return moment(obj).format(formatStr);
  } else {
    return obj;
  }
}

export function extractStatus(statusObj) {
  return value => {
    return flow(
      values,
      filter(o => o.value === parseInt(value)),
      map(o => o.text),
      head
    )(statusObj);
  }
}

export function flattenStatus(statusObj) {
  return Object.keys(statusObj).map(value => statusObj[value]);
}

// 签名验证相关方法
function generateSign(accountId, signkey) {
  const signStr = `&account_id=${accountId}&signkey=${signkey}`;
  return md5(signStr).toUpperCase();
}

export function generateAuthFields() {
  const accountId = store.getState().auth.accountId;
  return { account_id: accountId, sign: generateSign(accountId, SIGN_KEY) };
}

export function getUserType() {
  const userType = store.getState().auth.userType;
  return { userType };
}

// 用于发送multipart/formData数据
export function postWithFormData(url, formData) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.send(formData);
    xhr.responseType = 'json';
    xhr.onload = function (data) {
      resolve(typeof xhr.response === 'string' ? JSON.parse(xhr.response) : xhr.response);
    };
  });
}

// 计算出券状态颜色的函数
export function ticketStatusColor(status) {
  switch (parseInt(status)) {
    case 0:
    case 1:
    case 2: return 'blue';
    case 3: return 'yellow';
    case 4: return 'green';
    case 5: return 'red';
    default: return 'red';
  }
}

export function fuckBackend(data) {
  return Object.keys(data).map(key => `${key}=${data[key]}`).join('&');
}

export function generateOptions(data, valueField, textFiled) {
  return data.map((item, index) => <Option key={index} value={item[valueField] + ''}>{item[textFiled]}</Option>);
}

export function generateOptionsByTime(data, valueField, startTime, endTime, status, textFiled) {
  return data.map((item, index) => <Option key={index} value={item[valueField] + '_' + item[startTime].split(' ')[0]+ '_' + item[endTime].split(' ')[0]+'_'+item[status]+''}>{item[textFiled]}</Option>);
}

// 用于转换Table status
function existIn(keys) {
  return key => keys.includes(key);
}

export function transformStatus(status, dataSource, transformKeys) {
  return dataSource.map(item => existIn(transformKeys)(item.key) ? {...item, status} : item);
}

// 校验用户输入的正则
export function checkPhone(value) {
  // 手机号码: 1\d{10}
  // 座机:    \d{3}-\d{7,8}|\d{4}-\d{7,8}
  return /^(1\d{10})|\d{3}-\d{7,8}|\d{4}-\d{7,8}$/.test(value);
}

export function checkProductCode(value) {
  return /^\d+$/.test(value);
}

export function checkPaasword(value) {
  return value.length >= 6 && value.length <= 16;
}

export function updateDataSource(dataSource, key, newItemKey, newItem) {
  const index = dataSource.findIndex(item[key] === newItemKey);
  return [...dataSource.slice(0, index), newItem, ...dataSource.slice(index + 1)];
}

export function updateArray(array, index, updatedObj) {
  let indexes = isArray(index) ? index : [index];
  return array.map((item, index) => {
    if (indexes.includes(index)) {
      return {...item, ...updatedObj};
    } else {
      return item;
    }
  });
}

// 将@Form.create创建的validateFields转换成promise形式
export function validateFields(form) {
  return new Promise((resolve, reject) => {
    form.validateFields((errors, values) => {
      if (errors) {
        reject(errors);
      } else {
        resolve(values);
      }
    });
  });
}

// 将超出一定长度的自符转化成...
export function shortenStr(str, length) {
  if (str.length < length) {
    return str;
  } else {
    return str.slice(0, length) + '...';
  }
}

// 格式化时间
export function formatFrontDate(date) {
  return moment(date).format('YYYY-MM-DD');
}

export function formatBackendDate(date) {
  if (date === null) {
    return;
  }
  return moment(date).format('YYYYMMDD');
}

// 格式化金额: 分->元
export function centToYuan(cent) {
  return cent && +cent !== 0 ? (cent / 100).toFixed(2) : '';
}

// 格式化成Cascader和TreeSelect组件需要的数据格式
export function transformProviceAndCity(provinceAndCity) {
  function format(item) {
    return {
      key: `${item.CODE}-${item.NAME}`,
      value: `${item.CODE}-${item.NAME}`,
      label: item.NAME
    };
  }
  return provinceAndCity
  .map(item => ({
    ...format(item.province),
    children: item.cities.map(city => format(city))
  }));
}

export function disabledDate(interval, days = 0) {
  const { BEFORE, AFTER } = DATE_INTERVAL;
  return function (current) {
    switch (interval) {
      case BEFORE: return current && current.valueOf() < Date.now() - days * 3600 * 24 * 1000;
      case AFTER: return current && current.valueOf() > Date.now() + days * 3600 * 24 * 1000;
    }
  }
}

export function formatPrice(num) {
  var strOutput = "";
  var strUnit = '千百十亿千百十万千百十元角分';
  num += "00";
  var intPos = num.indexOf('.');
  if (intPos >= 0)
  num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
  strUnit = strUnit.substr(strUnit.length - num.length);
  for (var i = 0; i < num.length; i++)
  strOutput += '零一二三四五六七八九'.substr(num.substr(i, 1), 1) + strUnit.substr(i, 1);
  return strOutput.replace(/零角零分$/, '整').replace(/零[千百十]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, "零元");
};

export function formatMoney(number) {
  function outputdollars(number) {
    if (number.length <= 3) {
      return (number == '' ? '0' : number);
    } else {
      var mod = number.length % 3;
      var output = (mod == 0 ? '' : (number.substring(0, mod)));
      for (let i = 0; i < Math.floor(number.length / 3); i++) {
        if ((mod == 0) && (i == 0)) {
          output += number.substring(mod + 3 * i, mod + 3 * i + 3);
        } else {
          output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
        }
      }
      return (output);
    }
  }
  function outputcents(amount) {
    amount = Math.round(((amount) - Math.floor(amount)) * 100);
    return (amount < 10 ? '.0' + amount : '.' + amount);
  }
  number = number.replace(/\,/g, "");
  if (isNaN(number) || number == "") return "";
  number = Math.round(number * 100) / 100;
  if (number < 0)
  return '-' + outputdollars(Math.floor(Math.abs(number) - 0) + '') + outputcents(Math.abs(number) - 0);
  else
  return outputdollars(Math.floor(number - 0) + '') + outputcents(number - 0);
}

// RangePicker -> {start: YYYY-MM-DD, end: YYYY-MM-DD} | undefined
export function formatRangePickerDate(date) {
  if (!date || (!date[0] && !date[1])) return;
  return {
    start: moment(date[0]).format('YYYY-MM-DD'),
    end: moment(date[1]).format('YYYY-MM-DD'),
  };
}

// 计算出两次门店提交的差异
export function diffMarkets(oldMarkets, newMarkets) {
  const removeMarket = [];
  const addMarket = [];

  // 找出新增的门店
  newMarkets.forEach(market => {
    if (!oldMarkets.includes(market)) {
      addMarket.push(market);
    }
  });

  // 找出删除的门店
  oldMarkets.forEach(market => {
    if (!newMarkets.includes(market)) {
      removeMarket.push(market);
    }
  });

  return {
    addMarket,
    removeMarket,
  };
}

export function formatFreshRule(rule) {
  if (+rule.type === 2) {
    return `${rule.active_start}至${rule.active_end} ${rule.discount * 10}折`;
  } else {
    return `${rule.active_start}至${rule.active_end} 满${rule.discount_limit / 100}元减${rule.discount / 100}元`;
  }
}

export function filterHQBusiness(business) {
  return business.filter(i => +i.type === SINGLE.value || +i.type === BRAND.value);
}

export function filterKBBusiness(business) {
  return business.filter(i => +i.type === SINGLE.value)
}

export function filterWXBusiness(business) {
  return business.filter(i => +i.type === SINGLE.value)
}

export function formatDateFromStatrToEnd(startTime, endTime) {
  if (!startTime && !endTime) {
    return '';
  }
  if (!startTime) {
    return '至' + moment(endTime).format('YYYY-MM-DD');
  }
  if (!endTime) {
    return '始于' + moment(startTime).format('YYYY-MM-DD');
  }
  return moment(startTime).format('YYYY-MM-DD') + '至' + moment(endTime).format('YYYY-MM-DD');
}

export function navigateTo(to, router) {
  // 如果是to=/admin, tabKey指定默认的'home'
  const tabKey = to.split('/')[2] || 'home';
  router.replaceWith(to);
  store.dispatch(setTab(tabKey));
}

export function exportExcel(url, params) {
  window.location.assign(url + '?' + fuckBackend({...params, ...generateAuthFields()}));
}
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
}


export function getStrLeng(str){
    var realLength = 0;
    var len = str.length;
    var charCode = -1;
    for(var i = 0; i < len; i++){
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) {
            realLength += 1;
        }else{
            // 如果是中文则长度加3
            realLength += 3;
        }
    }
    return realLength;
}
//获取指定日期的相差多少天的日期
function addByTransDate(dateParameter, num) {

    var translateDate = "",
        dateString = "",
        monthString = "",
        dayString = "";
    translateDate = dateParameter.replace("-", "/").replace("-", "/");;

    var newDate = new Date(translateDate);
    newDate = newDate.valueOf();
    newDate = newDate - num * 24 * 60 * 60 * 1000; //备注 如果是往前计算日期则为减号 否则为加号
    newDate = new Date(newDate);

    //如果月份长度少于2，则前加 0 补位
    if ((newDate.getMonth() + 1).toString().length == 1) {
        monthString = 0 + "" + (newDate.getMonth() + 1).toString();
    } else {
        monthString = (newDate.getMonth() + 1).toString();
    }

    //如果天数长度少于2，则前加 0 补位
    if (newDate.getDate().toString().length == 1) {

        dayString = 0 + "" + newDate.getDate().toString();
    } else {

        dayString = newDate.getDate().toString();
    }

    dateString = newDate.getFullYear() + monthString + dayString;
    return dateString;

}
export let TODAY = getNowFormatDate();
//export let YESTERDAY = getNowFormatDate();
export let YESDAY = getNowFormatDate().replace(/\-/g, '');
export let POINTDAY = addByTransDate(TODAY, 30);
export let SEVENDAY = addByTransDate(TODAY, 7);
export let NINTHDAY = addByTransDate(TODAY, 90);
