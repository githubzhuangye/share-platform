import axios from 'axios';
import moment from 'moment';
import { host } from 'config/constants';
import { fuckBackend, generateAuthFields } from 'helpers/util';

// 平台获取零售商接收的订单
export function fetchCouponList(saasId, page) {
  const format = orderlist => orderlist.map(item => ({
    brandler: item.name,
    couponType: item.cptype,
    couponName: item.couponname,
    amount: parseInt(item.cpcount),
    date: `${item.starttime}至${item.endtime}`,
    key: item.pubid,
    allotStatus: item.allotstatus,
    receiveId: item.receive_id,
  }));
  
  return axios.get(`${host}/cp/huiqiang/hqh5!getOrderListOnPC.action`, {
    params: { saasId, page },
  })
    .then(data => data.data.data)
    .then(data => ({
      total: +data.totalcount,
      dataSource: format(data.orderlist),
    }));
}

// 根据投放区域获取城市列表
export function fetchProvinceAndCity(pubid, saasId) {
  function transformProviceAndCity(provinceAndCity) {
    function format(item) {
      return {
        key: `${item.code}-${item.name}`,
        value: `${item.code}-${item.name}`,
        label: item.name,
      };
    }
    return provinceAndCity
    .map(item => ({
      ...format(item),
      children: item.city.map(city => format(city))
    }));
  }

  return axios.get(`${host}/cp/huiqiang/hqh5!getCityList.action`, {
    params: { pubid, saasId }
  })
    .then(data => data.data.data.prov)
    .then(transformProviceAndCity);
}

// 门店列表
export function fetchMarketList(saasId, cityCode) {
  return axios.get(`${host}/cp/huiqiang/hqh5!getMarketList.action`, {
    params: { saasId, cityCode },
  })
    .then(data => data.data.data)
    .then(data => data.map(item => ({ID: item.id, NAME: item.marketname})))
    .then(data => ({market: data}));
}

// 选择门店
export function assignMarkets(pubId, saasId, addMarket, removeMarket) {
  return axios.post(`${host}/cp/huiqiang/hqh5!selectMarket.action`, fuckBackend({
    pubId,
    saasId,
    addMarket,
    removeMarket,
  }))
    .then(data => data.data)
    .then(({code, message}) => {
      if (+code !== 200) {
        throw new Error(message);
      }
    });
}

// 获取分配过的门店信息
export function fetchAssignedMarketInfo(pubid) {
  return axios.get(`${host}/cp/huiqiang/hqh5!getMarketAllotInfo.action`, {
    params: { ...generateAuthFields(), pubid }
  })
    .then(data => data.data.data);
}
