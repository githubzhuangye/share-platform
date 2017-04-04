import { isValidField, generateAuthFields, postWithFormData, transformDate } from 'helpers/util';
import { host, FORM_MODE } from 'config/constants';
import axios from 'axios';

//查询券批次号下该券活动商户的生鲜券二维码
export function queryMarketFreshQRCodeByPubid(queryData) {
    return axios.get(`${host}/cp/coupon/fresh_queryMarketFreshQRCodeByPubid.action`, {
        params: {...generateAuthFields(), ...queryData}
    }).then(e => e.data)
}

//导出生鲜券二维码
export function exportFreshQRCode(queryData) {
    return axios.get(`${host}/cp/coupon/fresh_exportFreshQRCode.action`, {
        params: {...generateAuthFields(), ...queryData}
    }).then(e => e.data)
}

