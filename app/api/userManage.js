import axios from 'axios';
import { host } from 'config/constants';
import { generateAuthFields, fuckBackend } from 'helpers/util';

// 根据券名称模糊查询(客服界面，仅查询当前有效的券)
export function matchCouponList(couponname) {
  return axios.get(`${host}/cp/operate/operate!matchCouponList.action`, {
    params: { ...generateAuthFields(), couponname },
  })
    .then(data => data.data.data.coupon)
    .then(data => data.map(item => `${item.pubid}:${item.couponname}`))
}

// 向指定用户分配券
export function couponAssign(data) {
  return axios.post(`${host}/cp/operate/operate!allotCoupon.action`, fuckBackend({
    ...generateAuthFields(),
    ...data,
  }))
    .then(data => data.data.data.result);
}
