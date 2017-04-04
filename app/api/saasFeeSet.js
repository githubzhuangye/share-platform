import { isValidField, generateAuthFields, postWithFormData, transformDate } from 'helpers/util';
import { host, FORM_MODE } from 'config/constants';
import axios from 'axios';

export function querySaas(queryData) {
    return axios.get(`${host}/cp/coupon/account_querySaas.action`, {
        params: {...generateAuthFields(), ...queryData}
    }).then(e => e.data)
}

export function setCharge(queryData) {
    return axios.get(`${host}/cp/coupon/account_setCharge.action`, {
        params: {...generateAuthFields(), ...queryData}
    }).then(e => e.data)
}
