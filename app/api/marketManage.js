import axios from 'axios';
import { generateAuthFields, fuckBackend } from 'helpers/util';
import { host } from 'config/constants';

function formatMarket(data) {
  return data.map(item => ({...item, key: `${item.saas}-${item.id}`}));
}

export function fetchMarket(queryData) {
  return axios.get(`${host}/cp/market/market!showMarketManagePort.action`, {
    params: {...generateAuthFields(), ...queryData}
  })
    .then(data => {
      const result = data.data.data;
      return {
        dataSource: formatMarket(result.listmarket),
        totalMarket: parseInt(result.marketcount)
      };
    })
}

export function addMarket(marketInfo) {
  return axios.post(`${host}/cp/market/market!addMarketPort.action`, fuckBackend({...generateAuthFields(), ...marketInfo}))
    .then(data => data.data);
}

export function updateMarket(marketInfo) {
  return axios.post(`${host}/cp/market/market!updateMarketPort.action`, fuckBackend({...generateAuthFields(), ...marketInfo}))
    .then(data => data.data);
}
           