import axios from 'axios';
import moment from 'moment';
import { host, COUPON_STATUS } from 'config/constants';
import { generateAuthFields, fuckBackend, filterFormData } from 'helpers/util';

function formatTickets(list) {
  return list.map(item => ({
    key: item.pubid,
    ticketName: item.couponname,
    price: item.couponfee,
    amount: item.couponamount,
    time: item.starttime,
    status: item.lockflag,
    type: item.type,
    pubSaasId: item.pubsaasid,
    querytype: item.querytype,
    isupdate: item.isupdate,
  }));
}

function formatShops2(shops,querytype) {

}
function formatShops(shops,querytype) {
  const result = shops.reduce((total, cur) => {
    if(parseInt(querytype)===1){//商户
         if(total[cur.saasname]){
            total[cur.saasname].push(cur.marketname);
          }else{
            total[cur.saasname]=[cur.marketname];
          }
    }else if(parseInt(querytype)===2){//区域
        if (total[cur.cityname]) {
          total[cur.cityname].push(cur.marketname);
        } else {
          total[cur.cityname] = [cur.marketname];
        }
    }
    return total;
  }, {});
  return Object
    .keys(result)
    .map(name => ({name, shopNames: result[name]}));
}

export function fetchTicketQuery(queryData) {
  const formData = filterFormData(queryData);
  if (parseInt(formData.status) === COUPON_STATUS.ALL.value) {
    delete formData.status;
  }
  return axios.get(`${host}/cp/coupon/c_coupons.action`, {
    params: {...generateAuthFields(), ...formData}
  })
    .then(data => ({
      dataSource: formatTickets(data.data.data.couponlist),
      total: data.data.data.totalcount
    }));
}

export function fetchTicketUsage(pubid, queryData) {
  return axios.get(`${host}/cp/coupon/c_receivelist.action`, {
    params: { ...generateAuthFields(), pubid, ...queryData }
  })
    .then(data => data.data.data);
}

export function fetchTicketDetail(pubid) {
  return axios.get(`${host}/cp/coupon/c_querydetail.action`, {
    params: {...generateAuthFields(), pubid}
  })
    .then(data => data.data.data);
}

export function fetchTicketShops(pubid,querytype,isretailer) {
  return axios.get(`${host}/cp/coupon/c_queryshops.action`, {
    // params: {...generateAuthFields(), pubid: '20150918012'}
    params: {...generateAuthFields(), pubid,querytype,isretailer},
  })
    .then(data => formatShops(data.data.data.shops,querytype))
}

export function offTickets(tickets) {
  return axios
    .post(`${host}/cp/operate/operate!cutOffCoupon.action`, fuckBackend({...generateAuthFields(), pubid: tickets.join(',')}))
    .then(data => data.data.code);
}

export function checkTicket(pubid, ispass, reason) {
  return axios
    .post(`${host}/cp/coupon/c_audit.action`, fuckBackend({...generateAuthFields(), pubid, ispass}))
    .then(data => data.data);
}

// 查询券可用商户、区域和门店
export function fetchMarkets(pubid) {
  return axios.get(`${host}/cp/operate/operate!couponArea.action`, {
    params: { ...generateAuthFields(), pubid },
  })
    .then(data => data.data.data.saas);
}

// 券点批价
export function queryWechatCouponPrice(pubid, couponcount) {
  return axios
    .post(`${host}/cp/wxcard/wxcoupon!queryWechatCouponPrice.action`, fuckBackend({...generateAuthFields(), pubid, couponcount}))
    .then(data => data.data.data);
}

// 兑换库存
export function exchangeWechatCoupon(pubid, couponcount) {
  return axios
    .post(`${host}/cp/wxcard/wxcoupon!exchangeWechatCoupon.action`, fuckBackend({...generateAuthFields(), pubid, couponcount}))
    .then(data => data.data);
}
