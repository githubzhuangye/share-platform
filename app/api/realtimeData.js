import axios from 'axios';
import { host } from 'config/constants';
import { generateAuthFields } from 'helpers/util';

//数据实时看板
export function realtimeData(queryData) {
    return axios.get(`${host}/cp/brand/brand_realtimeData.action`, {
        params: {...generateAuthFields(), ...queryData}
    }).then(e => e.data)
}
