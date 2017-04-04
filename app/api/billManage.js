import { isValidField, generateAuthFields, postWithFormData, transformDate } from 'helpers/util';
import { host, FORM_MODE } from 'config/constants';
import axios from 'axios';

export function queryCharge(queryData) {
    return axios.get(`${host}/cp/coupon/account!queryCharge.action`, {
        params: {...generateAuthFields(), ...queryData}
    }).then(e => e.data)
}

export function queryChargeDetail(queryData) {
    return axios.get(`${host}/cp/coupon/account!queryChargeDetail.action`, {
        params: {...generateAuthFields(), ...queryData}
    }).then(e => e.data)
}
