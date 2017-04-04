import axios from 'axios';
import jsonp from 'jsonp';
import moment from 'moment';
import { host } from 'config/constants';
import md5 from "md5";
import { fuckBackend, generateAuthFields } from 'helpers/util';


export const KEY = 'urzlUkKBB19x6KfSqnqQNiWDbQwVTvK0';

export function createSign(partnerid,key) {
  const signStr= "&partner_id="+partnerid+"&key="+key;
  return md5(signStr).toUpperCase();
}

// 获取商户省，市 (口碑营销)
export function queryCityBySaas(partnerid, provname) {
  // return axios.get(`http://member.miyapay.com/Member/Activity/getProvinceCity`, {
  // return axios.get(`http://120.27.186.62/h5/vip_pay_api/?action=getProvinceCity&callback=`, {
  // // return axios.get(`http://localhost:8080/test_1.json`, {
  //   params: { partner_id: partnerid, key: provname, sign: sign },
  // }, {
  //   responseType: 'jsonp'
  // })
  //   .then(data => data.data.data);
    const sign = createSign(partnerid,KEY);
    const ReData = 'partner_id='+partnerid+'&key='+provname+'&sign='+sign+'';
    return new Promise(function(resolve, reject) {
        jsonp('http://120.27.186.62/h5/vip_pay_api/?action=getProvinceCity&'+ReData, null, function (err, data) {
            if (err) {
                reject(console.error(err.message));
            } else {
                resolve(data.data);
            }
        });

    });

}

// 门店列表
export function fetchMarketList(partnerid, cityname) {


  // return axios.get(`http://member.miyapay.com/Member/Activity/saasshops`, {
  // return axios.get(`http://120.27.186.62/h5/vip_pay_api/?action=saasshops&callback?=`, {
  // // return axios.get(`http://localhost:8080/test_2.json`, {
  //   params: { partner_id: partnerid, key: cityname, sign: sign },
  // })
  //   .then(data => data.data.data)
  //   .then(data => data.map(item => ({ID: item.shopId, NAME: item.shopName})))
  //   .then(data => ({market: data}));

  const sign = createSign(partnerid,KEY);
  const ReData = 'partner_id='+partnerid+'&key='+cityname+'&sign='+sign+'';

  // jsonp('http://120.27.186.62/h5/vip_pay_api/?action=saasshops&'+ReData, null, function (err, data) {
  //     if (err) {
  //         console.error(err.message);
  //     } else {
  //         const data = {market: data.data.map(item => ({ID: item.shopId, NAME: item.shopName})))};
  //     }
  // });
  return new Promise(function(resolve, reject) {
      jsonp('http://120.27.186.62/h5/vip_pay_api/?action=saasshops&'+ReData, null, function (err, data) {
          if (err) {
              reject(console.error(err.message));
          } else {
              resolve(data);
          }
      });
  })
  .then(data => data.data)
  .then(data => data.map(item => ({ID: item.shopId, NAME: item.shopName})))
  .then(data => ({market: data}));
}
