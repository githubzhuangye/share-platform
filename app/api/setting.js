import axios from 'axios';
import { host } from 'config/constants';
import { generateAuthFields, postWithFormData, fuckBackend } from 'helpers/util';

// 查询用户注册信息
export function queryUserInfo() {
  return axios.get(`${host}/cp/market/saas!queryUserInfo.action`, {
    params: generateAuthFields(),
  })
    .then(data => data.data.data.data);
}

// 更新用户注册信息
export function updateUserInfo(data) {
  const mergeData = Object.assign(generateAuthFields(), data);
  const formData = Object
    .keys(mergeData)
    .reduce((pre, cur) => {
      pre.append(cur, mergeData[cur]);
      return pre;
    }, new FormData());
  return postWithFormData(`${host}/cp/market/saas!updateUserInfo.action`, formData)
    .then(data => {
      if (parseInt(data.code) !== 200) {
        throw new Error(data.msg);
      } else {
        return data.msg;
      }
    });
}

// 验证老密码是否正确
export function validatePassword(pwd) {
  return axios.get(`${host}/cp/login/login!validatePwd.action`, {
    params: { ...generateAuthFields(), pwd },
  })
    .then(data => data.data.code);
}

// 修改密码
export function updatePassword(newpassword, oldpassword) {
  return axios.post(`${host}/cp/login/login!modifyPwd.action`, fuckBackend({...generateAuthFields(), newpassword, oldpassword}))
    .then(data => data.data);
}
