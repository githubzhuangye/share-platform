import axios from 'axios';
import jsonp from 'jsonp';
import md5 from "md5";
import {host} from 'config/constants';
import {generateAuthFields,TODAY} from 'helpers/util';

// 获取活动列表
export function fetchActivityList() {
    return axios.get(`${host}/cp/coupon/query!queryActiveDropList.action`, {
        params: {
            ...generateAuthFields()
        }
    }).then(data => data.data.data.list);
}
//数据实时看板
// export function realData(queryData) {
//     return axios.get(`${host}/cp/brand/brand_realtimeData.action`, {
//         params: {
//             ...generateAuthFields(),
//             ...queryData
//         }
//     }).then(e => e.data)
// }

export function realData(id) {
    const time = Math.round(new Date().getTime()/1000);
    let private_pw = 'miyacouponpassword';
    let public_pw = 'miyacoupon';
    let hash = md5("GET"+TODAY+time+private_pw);
    let sign=public_pw+":"+hash;

    const miuData = ''+TODAY+'/'+id+'/'+sign+'/'+time+'';

    const MapPromise = new Promise(function(resolve, reject) {
        jsonp('http://116.62.53.12:81/miyabigdatareport/rest/coupon/couponrealtime/'+miuData, {prefix: 'getMessage',name: 'couponrealtime',timeout : 20000}, function (err, data) {
            if (err) {
                reject(console.log(err.message));
            } else {
                resolve(data);
            }
        });
    })

    return MapPromise;

}
// 数据概要
export function dataOverview(queryData) {
    return axios.get(`${host}/cp/message/m_dataOverview.action`, {
    // return axios.get(`http://localhost:8080/data.json`, {
        params: {
            ...generateAuthFields(),
            ...queryData
        }
    }).then(e => e.data.data)
}

// 数据走势图
export function dataCurve(queryData) {
    return axios.get(`${host}/cp/message/m_dataCurve.action`, {
        params: {
            ...generateAuthFields(),
            ...queryData
        }
    })
    .then(data => data.data.data)
    .then(data => ({
        pvuvData: data.map(item => ({day: item.day, pv: item.pv, uv: item.uv})).reduce((result, item) => {
            result.day.push(item.day);
            result.pv.push(item.pv);
            result.uv.push(item.uv);
            return result;
        }, {
            day: [],
            pv: [],
            uv: []
        }),
        couponData: data.map(item => ({day: item.day, cget: item.cget, cuse: item.cuse})).reduce((result, item) => {
            result.day.push(item.day);
            result.cget.push(item.cget);
            result.cuse.push(item.cuse);
            return result;
        }, {
            day: [],
            cget: [],
            cuse: []
        }),
        userData: data.map(item => ({day: item.day, uget: item.uget, uuse: item.uuse})).reduce((result, item) => {
            result.day.push(item.day);
            result.uget.push(item.uget);
            result.uuse.push(item.uuse);
            return result;
        }, {
            day: [],
            uget: [],
            uuse: []
        })
    }));
}

// 漏斗图
export function dataFunnel(queryData) {
    return axios.get(`${host}/cp/message/m_dataFunnel.action`, {
        params: {
            ...generateAuthFields(),
            ...queryData
        }
    }).then(data => data.data.data)
}
