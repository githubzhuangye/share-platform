import { TODAY,SEVENDAY } from 'helpers/util';
import { DataPublicApi } from 'api';

const PREFIX = '@@DATESELECT/';
const SET_DATE = PREFIX + 'SET_DATE';
const FETCH_ACTIVELIST = PREFIX + 'FETCH_ACTIVELIST';
const FETCH_ACTIVEID = PREFIX + 'FETCH_ACTIVEID';
const FETCH_SUBMIT = PREFIX + 'FETCH_SUBMIT';
const FETCH_LOADING = PREFIX + 'FETCH_LOADING';
const FETCH_GET_CATE = PREFIX + 'FETCH_GET_CATE';
const FETCH_USE_CATE = PREFIX + 'FETCH_USE_CATE';
const FETCH_TOPDATA = PREFIX + 'FETCH_TOPDATA';

export function setDates(starttime,endtime) {
  return {
    type: SET_DATE,
    starttime,
    endtime,
  };
}
function fetchActiveList(activeList) {
  return {
    type: FETCH_ACTIVELIST,
    activeList,
  };
}
export function fetchSubmit() {
  return {
    type: FETCH_SUBMIT,
  };
}
export function setLoading(loading){
  return {
    type:FETCH_LOADING,
    loading
  }
}
export function fetchTopData(topData){
  return {
    type:FETCH_TOPDATA,
    topData
  }
}
export function fetchActiveId(activeId){
  return {
    type: FETCH_ACTIVEID,
    activeId,
  };
}




function fetchCateGet(getCate) {
    return {
        type: FETCH_GET_CATE,
        getCate
    };
}

function fetchCateUse(useCate) {
    return {
        type: FETCH_USE_CATE,
        useCate
    };
}

export function handleActivityList(){
  return dispatch => {
    DataPublicApi.fetchActivityList()
    .then(data => {
        dispatch(fetchActiveList(data));
        dispatch(fetchActiveId(data[0].activeid));
        dispatch(setDates(data[0].starttime,data[0].endtime));
      });
  }
}



export function handleAllCate(queryData, type) {
    return (dispatch, getState) => {
      dispatch(setLoading(true));
      DataPublicApi.queryReportTopData(queryData)
      .then(data => {
          dispatch(setLoading(false));
          dispatch(fetchTopData(data));
        });
        DataPublicApi.goodsDataAnalysis(queryData, type).then(data => {
            if (type == 'USE') {
                dispatch(setLoading(false));
                dispatch(fetchCateUse(data.dataCharts));
            } else {
                dispatch(setLoading(false));
                dispatch(fetchCateGet(data.dataCharts));
            }
        });
    };
}




const initialState = {
  starttime: SEVENDAY,
  endtime: TODAY.replace(/-/g,""),
  activeList:[],
  activeId:'',
  Submit:false,
  getCate: [],
  useCate: [],
  loading:false,
  topData:{getusers: "--",useusers: "--",useavg: "--",usepers:"--",getcnt:"--",usecnt:"--"},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_DATE:
      return {...state, starttime: action.starttime, endtime: action.endtime};
    case FETCH_ACTIVELIST:
      return {...state, activeList: action.activeList};
    case FETCH_ACTIVEID:
      return {...state, activeId: action.activeId};
    case FETCH_SUBMIT:
      return {...state, Submit: !state.Submit};
    case FETCH_GET_CATE:
      return {...state, getCate: action.getCate};
    case FETCH_USE_CATE:
      return {...state, useCate: action.useCat};
    case FETCH_LOADING:
      return {...state, loading: action.loading};
    case FETCH_TOPDATA:
      return {...state, topData: action.topData};
    default:
      return state;
  }
}
