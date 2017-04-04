import { isValidField, generateAuthFields, postWithFormData, transformDate } from 'helpers/util';
import { host, FORM_MODE } from 'config/constants';
import axios from 'axios';

//更改商户券类型
export function changeBusinesstype(queryData) {
    return axios.get(`${host}/cp/market/saas!changeBusinesstype.action`, {
        params: {...generateAuthFields(), ...queryData}
    }).then(e => e.data)
}

//设置商户券类型
export function businessConfig(queryData) {
    return axios.get(`${host}/cp/market/saas!businessConfig.action`, {
        params: {...generateAuthFields(), ...queryData}
    }).then(e => e.data)
}
//	查询商户的券类型
export function queryBusinesstype(queryData) {
    return axios.get(`${host}/cp/market/saas!queryBusinesstype.action`, {
        params: {...generateAuthFields(), ...queryData}
    }).then(e => e.data)
}
