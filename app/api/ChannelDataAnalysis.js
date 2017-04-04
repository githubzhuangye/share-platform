import axios from 'axios';
import {host} from 'config/constants';
import {generateAuthFields} from 'helpers/util';


// 渠道数据分析
export function channelDataAnalysis(type) {
  //  return axios.get(`${host}/cp/message/m_channelDataAnalysis.action`, {
      return axios.get(`http://localhost:8080/data1.json`, {
        params: {
            ...generateAuthFields(),
            queryType:type
        }
    }).then(data => data.data.data)
}
