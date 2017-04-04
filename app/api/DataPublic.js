import axios from 'axios';
import {host} from 'config/constants';
import {generateAuthFields} from 'helpers/util';

// 获取活动列表
export function fetchActivityList(activeid,starttime,endtime) {
    return axios.get(`${host}/cp/coupon/query!queryActiveDropList.action`, {
        params: {
            ...generateAuthFields(),
            activeid,
            starttime,
            endtime,
        }
    }).then(data => data.data.data.list);
}
//数据实时看板
export function userData(queryData) {
    return axios.get(`${host}/cp/brand/brand_realtimeData.action`, {
        params: {
            ...generateAuthFields(),
            ...queryData
        }
    }).then(e => e.data)
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

// 类目、单品数据
export function CategoryData(type) {
    return axios.get(`${host}/cp/message/m_goodsDataAnalysis.action`, {
  //    return axios.get(`http://localhost:8080/data5.json`, {
        params: {
            ...generateAuthFields(),
            queryType:type
        }
    }).then(data => data.data.data)
}

//零售商&门店parent
export function TradesParent(queryType,tag) {
    return axios.get(`${host}/cp/message/m_marketDataAnalysisByTag.action`, {
    //  return axios.get(`http://localhost:8080/parent.json`, {
        params: {
            ...generateAuthFields(),
            ...queryType,
            tag,
        }
    }).then(data => data.data.data)
}

//零售商&门店child
export function TradesChild(queryType) {
    return axios.get(`${host}/cp/message/m_marketDataAnalysis.action`, {
  //    return axios.get(`http://localhost:8080/child.json`, {
        params: {
            ...generateAuthFields(),
            ...queryType
        }
    }).then(data => data.data.data)
}

// 渠道数据分析
export function channelDataAnalysis(type,activeid,starttime,endtime) {
      return axios.get(`${host}/cp/message/m_channelDataAnalysis.action`, {
      //return axios.get(`http://localhost:8080/data1.json`, {
        params: {
            ...generateAuthFields(),
            queryType:type,
            activeid:activeid,
            starttime:starttime,
            endtime:endtime
        }
    }).then(data => data.data.data)
}

// 用户数据-核劵数据
export function userDataUse(type,activeid,starttime,endtime) {
    return axios.get(`${host}/cp/message/m_userDataAnalysis.action`, {
    //  return axios.get(`http://localhost:8080/use.json`, {
        params: {
            ...generateAuthFields(),
            queryType: type,
            activeid:activeid,
            starttime:starttime,
            endtime:endtime
        }
    }).then(data => data.data.data)
}

//查询报表顶部数据
export function queryReportTopData(queryType) {
    return axios.get(`${host}/cp/message/m_queryReportTopData.action`, {
    //  return axios.get(`http://localhost:8080/top.json`, {
        params: {
            ...generateAuthFields(),
            ...queryType
        }
    }).then(data => data.data.data)
}
