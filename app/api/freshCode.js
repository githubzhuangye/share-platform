import { isValidField, generateAuthFields, postWithFormData, transformDate } from 'helpers/util';
import { host, FORM_MODE } from 'config/constants';
import axios from 'axios';

//查询生鲜券条码校验规则
export function queryFreshCode() {
    return axios.get(`${host}/cp/coupon/fresh_queryFreshCode.action`, {
        params: {...generateAuthFields()}
    }).then(e => e.data)
}

//修改生鲜券条形码规则
export function updateFreshCode(queryData) {
    return axios.get(`${host}/cp/coupon/fresh_updateFreshCode.action`, {
        params: {...generateAuthFields(), ...queryData}
    }).then(e => e.data)
}

//	删除生鲜券条码规则
export function delFreshCode(queryData) {
    return axios.get(`${host}/cp/coupon/fresh_delFreshCode.action`, {
        params: {...generateAuthFields(), ...queryData}
    }).then(e => e.data)
}

//添加生鲜券条形码规则
export function codeAssemble(queryData) {
    return axios.get(`${host}/cp/coupon/fresh_codeAssemble.action`, {
        params: {...generateAuthFields(), ...queryData}
    }).then(e => e.data)
}