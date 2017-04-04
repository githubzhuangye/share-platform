import axios from 'axios';
import {host} from 'config/constants';
import { generateAuthFields, postWithFormData, fuckBackend } from 'helpers/util';
import { hqCouponApi,alCouponApi } from 'api';

export function queryGoodCount(){//根据用户查询商品数量
    const {account_id, sign} = generateAuthFields();
    return axios(`${host}/cp/good/good!queryGoodCount.action`, {
        params: { account_id, sign}
    })
        .then(data => data.data)
        .then(({code, msg, data}) => {
            if (parseInt(code) === 200) {
                return data;
            } else {
                throw new Error(msg);
            }
        });
}

export function queryCategoryByUser(account_id) {  //根据用户查询品类列表
    return axios(`${host}/cp/operate/operate!queryCategoryByUser.action`, {
        params: { account_id: account_id }
    })
        .then(data => data.data)
        .then(({code, msg, data}) => {
            if (parseInt(code) === 200) {
                return { msg, dataSource: data };
            } else {
                throw new Error(msg);
            }
        });
}

export function createCoupon(coupon) {  //发行券
  const mergeData = Object.assign(generateAuthFields(), coupon);
  const formData = Object
    .keys(mergeData)
    .reduce((pre, cur) => {
      pre.append(cur, mergeData[cur]);
      return pre;
    }, new FormData());
  // 根据是否存在hqType字段决定是普通的发券还是会抢模式的发券
  const url = coupon.hq_type
  ? `${host}/cp/operate/operate!createCouponForHq.action`
  : `${host}/cp/operate/operate!createCoupon.action`;
  return postWithFormData(url, formData);
}

// 编辑券
export function editCoupon(data) {
  return axios.post(`${host}/cp/operate/operate!editCoupon.action`,
    fuckBackend({...generateAuthFields(), ...data})
  )
    .then(data => data.data)
    .then(data => {
      if (+data.code !== 200) {
        throw new Error(data.msg);
      }
    });
}

export function upsertCoupon(data) {
    const mergeData = Object.assign({}, generateAuthFields(), data);
    const formData = Object
        .keys(mergeData)
        .reduce((pre, cur) => {
            pre.append(cur, mergeData[cur]);
            return pre;
        }, new FormData());
    return postWithFormData(`${host}/cp/operate/operate!createCoupon.action`, formData);
}

export function queryBrandByUser(brandname) {  //根据用户查询品牌列表
    const {account_id, sign} = generateAuthFields();
    return axios(`${host}/cp/operate/operate!queryBrandByUser.action`, {
        params: { account_id, brandname, sign }
    })
        .then(data => data.data)
        .then(({code, msg, data}) => {
            if (parseInt(code) === 200) {
                return data;
            } else {
                throw new Error(msg);
            }
        });
}

export function queryCity(type, condition) {  //查询省市列表
    const {account_id, sign} = generateAuthFields();
    return axios(`${host}/cp/operate/operate!queryCity.action`, {
        params: { type, condition, sign, account_id }
    })
        .then(data => data.data)
        .then(({code, msg, data}) => {
            if (parseInt(code) === 200) {
                return data;
            } else {
                throw new Error(msg);
            }
        });
}

export function querySaasList(saasname) {  //	查询商户列表
    const {account_id, sign} = generateAuthFields();
    return axios(`${host}/cp/operate/operate!querySaasList.action`, {
        params: { account_id, sign, saasname }
    })
        .then(data => data.data)
        .then(({code, msg, data}) => {
            if (parseInt(code) === 200) {
                return data;
            } else {
                throw new Error(msg);
            }
        });
}

// 根据商户查询有门店的城市列表
export function queryCityBySaas(saas) {
  return axios.get(`${host}/cp/operate/operate!queryCityListBySaas.action`, {
    params: { ...generateAuthFields(), saas },
  })
    .then(data => data.data.data.prov);
}

// 根据商户号和城市编码查询门店列表
export function queryMarketByCity(saas_id, citycode, isSelectMode, isMyVip, partnerId) {
  const { account_id, sign } = generateAuthFields();

  if (isSelectMode === 1) {
    return hqCouponApi.fetchMarketList(saas_id, citycode);
  }

  if (isSelectMode === 2 && isMyVip) {
    return alCouponApi.fetchMarketList(partnerId, citycode);
  }

  return axios(`${host}/cp/operate/operate!queryMarketByCity.action`, {
    params: { account_id, sign, saas_id, citycode }
  })
    .then(data => data.data)
    .then(({code, msg, data}) => {
      if (parseInt(code) === 200) {
        return data;
      } else {
        throw new Error(msg);
      }
    });
}

export function matchSaasList(account_id, saasname) {  //		查询商户列表(根据商户名称模糊查询)
    return axios(`${host}/cp/operate/operate!querySaasList.action`, {
        params: { account_id: account_id, saasname: saasname }
    })
        .then(data => data.data)
        .then(({code, msg, data}) => {
            if (parseInt(code) === 200) {
                return { msg, dataSource: data };
            } else {
                throw new Error(msg);
            }
        });
}

export function matchGoodList(goodname) {  //	根据商品名称模糊查询商品列表
    const {account_id, sign} = generateAuthFields();
    return axios(`${host}/cp/good/good!matchGoodList.action`, {
        params: { account_id, goodname, sign }
    })
        .then(data => data.data)
        .then(({code, msg, data}) => {
            if (parseInt(code) === 200) {
                return { msg, dataSource: data };
            } else {
                throw new Error(msg);
            }
        });
}

// 查询有没有订阅米雅营销会员
export function queryIsSubscribe() {
  return axios.get(`${host}/cp/market/saas!isSubscribe.action`, {
    params: { ...generateAuthFields() },
  })
    .then(data => data.data)
}

// 查询账户券点
export function queryWxBalance() {
  return axios.get(`${host}/cp/wxcard/wxcoupon!queryWechatCoinAccountInfo.action`, {
    params: { ...generateAuthFields() },
  })
    .then(data => data.data)
}
