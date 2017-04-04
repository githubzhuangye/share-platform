import axios from 'axios';
import { host } from 'config/constants';
import { generateAuthFields } from 'helpers/util';

export function auth(data) {
  return axios(`${host}/cp/login/login!loginssh.action`, {
    params: {account_id: data.accountId, pwd: data.pwd}
  })
    .then(data => data.data)
    .then(({result, username, type, msg, account_id, saas_logo, saasid, business}) => {
      if (parseInt(result) === 200) {
        return {username, type, accountId: account_id, saasLogo: saas_logo, saasId: saasid, business};
      } else {
        throw new Error(msg);
      }
    });
}

export function fetchSaaslist() {
  return axios.get(`${host}/cp/market/market!showAddMarketPort.action`, {
    params: {...generateAuthFields()}
  })
    .then(data => data.data.data.saaslist);
}

export function logout() {
  return axios.get(`${host}/cp/login/login!logoutssh.action`, {
    params: {account_id: generateAuthFields().account_id}
  })
    .then(data => data.data);
}
