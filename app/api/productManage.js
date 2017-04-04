import { isValidField, generateAuthFields, postWithFormData, transformDate } from 'helpers/util';
import { host, FORM_MODE } from 'config/constants';
import { pickBy } from 'lodash/fp';
import axios from 'axios';

function formatProduct(list) {
  return list.map(item => ({
    ...item,
    key: item.goodid
  }));
}

export function fetchProduct(queryData) {
  const formData = pickBy(isValidField)({curpage: 1, ...queryData})
  
  return axios.get(`${host}/cp/good/good!queryGoodsPort.action`, {
    params: {...generateAuthFields(), ...formData}
  })
    .then(data => ({
      dataSource: formatProduct(data.data.data.goodlist),
      total: data.data.data.goodcount
    }));
}

export function stopProducts(productKeys) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('stop', productKeys);
      resolve();
    }, 200);
  });
}

export function startProducts(productKeys) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('start', productKeys);
      resolve();
    }, 200);
  });
}

export function upsertProduct(data, type = FORM_MODE.NEW.value) {
  const mergeData = {...generateAuthFields(), ...data};
  let url;
  switch (type) {
    case FORM_MODE.NEW.value: url = `${host}/cp/good/good!insertGoodsPort.action`; break;
    case FORM_MODE.EDIT.value: url = `${host}/cp/good/good!insertGoodsPort.action`; break;
    default: url = `${host}/cp/good/good!insertGoodsPort.action`;
  }
  const formData = Object
    .keys(mergeData)
    .reduce((pre, cur) => {
      pre.append(cur, mergeData[cur]);
      return pre;
    }, new FormData());
  return postWithFormData(url, formData)
    .then(({code, msg}) => {
      if (parseInt(code) !== 200) {
        throw new Error(msg);
      }
    });
}

export function queryProductInfo() {
  return axios.get(`${host}/cp/good/good!addGoodsPort.action`, {
    params: {...generateAuthFields()}
  })
    .then(data => data.data.data);
}
