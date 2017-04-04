import axios from 'axios';
import { host } from 'config/constants';
import { postWithFormData } from 'helpers/util';

export function submit(data) {
  const formData = new FormData();
  Object.keys(data).forEach(name => formData.append(name, data[name]));
  return postWithFormData(`${host}/cp/market/saas!regist.action`, formData);
}

export function searchForUser(username) {
  return axios.get(`${host}/cp/login/login!search_user.action`, {
    params: {
      account_id: username
    }
  })
    .then(res => ({code: res.data.result}));
}
