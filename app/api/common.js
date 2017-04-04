import axios from 'axios';
import moment from 'moment';
import { host } from 'config/constants';
import { generateAuthFields, shortenStr } from 'helpers/util';

function formatCoupon(data) {
  return data.map(item => ({phone: item.USER, coupon: item.COUPONNAME}));
}

function formatMessage(data) {
  return data.map(item => ({
    title: shortenStr(item.title || item.cont, 4),
    content: item.cont,
    date: moment(item.create_time).format('MM/DD'),
    isRead: item.is_read > 0
  }));
}

// new add.
function homeMessage(data) {
  return data.map(item => ({
    title: item.title || item.cont,
    content: item.cont,
    month: moment(item.create_time).format('MM/DD').split("/")[0],
    date: moment(item.create_time).format('MM/DD').split("/")[1]
  }));
}

export function fetchLiveCoupon() {
  return axios.get(`${host}/cp/login/login!couponGetInfo.action`, {
    params: {account_id: generateAuthFields().account_id}
  })
    .then(data => formatCoupon(data.data.data.getCoupon));
}

export function fetchMessage() {
  return axios.get(`${host}/cp/message/m_query.action`, {
    params: {...generateAuthFields()}
  })
    .then(data => ({unread: data.data.data.msgcount, messageList: formatMessage(data.data.data.msglist)}))
}

//new add.
export function fetchHomeMessage() {
  return axios.get(`${host}/cp/message/m_query.action`, {
    params: {...generateAuthFields()}
  })
    .then(data => ({messageList: homeMessage(data.data.data.msglist)}))
}

// 	查询券的每日发行和核销数据
export function fetchAnalysisData(startDate, endDate, page = 1) {
  return axios.get(`${host}/cp/message/m_dailyData.action`, {
    params: {...generateAuthFields(), start: startDate, end: endDate, page}
  })
    .then(data => data.data.data)
    .then(data => ({totalSaas: +data.totalsaas, activeSaas: +data.activesaas, pageTotal: +data.saascount, dataSource: data.saaslist}));
}

export function fetchSaasList() {
  return axios.get(`${host}/cp/operate/operate!querySaasList.action`, {
    params: {...generateAuthFields()}
  })
    .then(data => data.data.data.saas);
}

// TODO: need to replace the multi request to single
export function fetchProvinceAndCity() {
  return axios
    .get(`${host}/cp/operate/operate!queryCity.action`, {
      params: {...generateAuthFields(), type: 1}
    })
    .then(data => data.data.data.province)
    .then(provinces => {
      const promises = provinces.map(province => {
        return axios.get(`${host}/cp/operate/operate!queryCity.action`, {
          params: {...generateAuthFields(), type: 2, condition: province.CODE}
        })
          .then(data => ({cities: data.data.data.city}))
      });
      return Promise
        .all(promises)
        .then(arr => arr.map((item, index) => ({province: { ...provinces[index] }, ...item})));
    });
}
