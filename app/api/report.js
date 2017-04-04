import axios from 'axios';
import { host } from 'config/constants';
import { generateAuthFields } from 'helpers/util';
import { DIMENSIONS } from 'config/constants';

/* 零售商报表 */
// 获取活动列表
export function fetchActivityList() {
  return axios.get(`${host}/cp/coupon/query!queryActiveDropList.action`, {
    params: {...generateAuthFields()}
  })
    .then(data => data.data.data.list);
}

// 获取活动相关门店列表
export function fetchMarketList(activeId) {
  return axios.get(`${host}/cp/coupon/query!queryMarketDropList.action`, {
    params: {...generateAuthFields(), activeId}
  })
    .then(data => data.data.data.list);
}

/* 品牌商报表 */
// 品牌商报表首页KPI
export function fetchBrandlerBoard() {
  return axios.get(`${host}/cp/brand/brand_couponBoard.action`, {
    params: {...generateAuthFields()},
  })
    .then(data => data.data.data);
}

// 格式化维度查询结果
function format(data, dimension) {
  let prefix = '';
  switch(dimension) {
    case DIMENSIONS.SAAS: prefix = 'saas'; break;
    case DIMENSIONS.REGION: prefix = 'area'; break;
    case DIMENSIONS.MARKET: prefix = 'market'; break;
  }
  return data.map(item => ({
    id: item[prefix + 'id'],
    name: item[prefix + 'name'],
    use: item.usenum,
    get: item.getnum,
  })).filter(item => item.id && item.name);
}

// 品牌商第一维度查询
export function queryByFirstDimension({dimension, start, end}) {
  return axios.get(`${host}/cp/brand/brand_couponComp.action`, {
    params: {...generateAuthFields(), baseType: dimension, start, end},
  })
    .then(data => data.data.data.detail)
    .then(data => format(data, dimension))
    .then(data => data.reverse());
}

// 品牌商第二维度查询
export function queryBySecondDimension({secondDimension, firstDimension, firstDimensionId, start, end}) {
  function formatFirstDimensionQuery(dimension, value) {
    let prefix = '';
    switch(dimension) {
      case DIMENSIONS.SAAS: prefix = 'saas'; break;
      case DIMENSIONS.REGION: prefix = 'area'; break;
      case DIMENSIONS.MARKET: prefix = 'market'; break;
    }
    return {[prefix + 'id']: value};
  }
  return axios.get(`${host}/cp/brand/brand_couponComp.action`, {
    params: {...generateAuthFields(), baseType: firstDimension, secondType: secondDimension,
      ...formatFirstDimensionQuery(firstDimension, firstDimensionId),
    start, end },
  })
    .then(data => data.data.data.detail)
    .then(data => format(data, secondDimension))
    .then(data => data.reduce((result, item) => {
      result.name.push(item.name);
      result.use.push(item.use);
      result.get.push(item.get);
      return result;
    }, {name: [], use: [], get: []}));
}

// 领券趋势/实时领券的通用方法
function fetchCouponTrendOrRealTime(baseType, query) { // query -> { xxxid, start, end }
  const xAxisKey = baseType === DIMENSIONS.TREND ? 'date' : 'hour';
  return axios.get(`${host}/cp/brand/brand_couponComp.action`, {
    params: {...generateAuthFields(), baseType, ...query},
  })
    .then(data => data.data.data)
    .then(data => ({
      total: {
        use: data.usenum,
        get: data.getnum,
        pp: data.pp
      },
      dataSource: data.detail
        .map(item => ({use: item.usenum, get: item.getnum, pp: item.pp, [xAxisKey]: item[xAxisKey]}))
        .reduce((result, item) => {
          result.use.push(item.use);
          result.get.push(item.get);
          result.pp.push(item.pp);
          result[xAxisKey].push(item[xAxisKey]);
          return result;
        }, {[xAxisKey]: [], use: [], get: [], pp: []})
    }));
}

// 品牌商核券及领券趋势
export function fetchCouponTrend(query) {
  return fetchCouponTrendOrRealTime(DIMENSIONS.TREND, query);
}

// 核券及领券实时趋势
export function fetchCouponRealTime(query) {
  return fetchCouponTrendOrRealTime(DIMENSIONS.REAL_TIME, query);
}

// 品牌商粉丝查询
export function fetchFans() {
  const dataSource = {
    date: [],
    allUse: [],
    partialUse: [],
    notUse: [],
    notGet: [],
  };
  const total = {
    allUse: 0,
    partialUse: 0,
    notUse: 0,
    notGet: 0,
  };
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve({dataSource, total}), 500);
  });
}

// 品牌商单品查询
export function fetchGood(query) { // query -> { xxxid, start, end }
  return axios.get(`${host}/cp/brand/brand_couponComp.action`, {
    params: {...generateAuthFields(), baseType: 5, ...query},
  })
    .then(data => data.data.data.detail)
    .then(data =>
      data.map(item => ({name: item.goodname, get: item.getnum, use: item.usenum}))
    )
    .then(data => ({dataSource: data, total: data}));
}

// 品牌商查询合作商户列表
export function fetchSaasList() {
  return axios.get(`${host}/cp/brand/brand_queryCooSaasList.action`, {
    params: generateAuthFields(),
  })
    .then(data => data.data.data);
}

// 品牌商查询有活动的区域列表
export function fetchAreaList() {
  return axios.get(`${host}/cp/brand/brand_queryCooAreaList.action`, {
    params: generateAuthFields(),
  })
    .then(data => data.data.data);
}

// 品牌商查询有活动的门店列表
export function fetchBrandlerMarketList(query) { // query -> {saasid, areaid}
  return axios.get(`${host}/cp/brand/brand_queryCooMarketList.action`, {
    params: { ...generateAuthFields(), ...query },
  })
    .then(data => data.data.data);
}
