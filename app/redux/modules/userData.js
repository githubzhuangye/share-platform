import moment from 'moment';
import { userDataApi,DataPublicApi } from 'api';
import { PRODUCT_STATUS, FORM_MODE } from 'config/constants';
import { transformStatus } from 'helpers/util';



const PREFIX='@@USERDATA/';
const { START, STOP, ALL } = PRODUCT_STATUS;

const FETCH_ACTIVELIST = PREFIX + 'FETCH_ACTIVELIST';
const FETCH_DATASUMMARY=PREFIX + 'FETCH_DATASUMMARY';
const FETCH_DATAOVERVIEW=PREFIX + 'FETCH_DATAOVERVIEW';
const FETCH_USERDATAUSE=PREFIX + 'FETCH_USERDATAUSE';
const FETCH_USERDATAGET=PREFIX + 'FETCH_USERDATAGET';
const FETCH_TOPDATA=PREFIX + 'FETCH_TOPDATA';
const FETCH_LOADED=PREFIX + 'FETCH_LOADED';



const initialState = {
  activeList: [],
  dataOverview:{},
  dataSummary:{},
  userDataUse:{},
  userDataGet:{},
  loading: false,
  error: '',
  queryStatus: ALL.value,
  queryData: {},
  productInfoFetched: false,
  topData:{},
};

function fetchActiveList(activeList) {
  return {
    type: FETCH_ACTIVELIST,
    activeList: activeList
  };
}

function fetchDataOverview(dataOverview) {
  return {
    type: FETCH_DATAOVERVIEW,
    dataOverview: dataOverview
  };
}

function fetchDataSummary(dataSummary) {
  return {
    type: FETCH_DATASUMMARY,
    dataSummary: dataSummary
  };
}

function fetchUserDataUse(userDataUse) {
  return {
    type: FETCH_USERDATAUSE,
    userDataUse: userDataUse
  };
}
function fetchUserDataGet(userDataGet) {
  return {
    type: FETCH_USERDATAGET,
    userDataGet: userDataGet
  };
}
function fetchTopData(topData) {
  return {
    type: FETCH_TOPDATA,
    topData: topData
  };
}

function fetchLoading(loading) {
  return {
    type: FETCH_LOADED,
    loading:loading
  };
}

export function handleActiveList(){
  return dispatch => {
    userDataApi.fetchActivityList()
    .then(data => dispatch(fetchActiveList(data)));
  }
}

export function handleDataSummary(){
  return dispatch => {
    userDataApi.fetchSummaryData()
    .then(data => {
      dispatch(fetchDataSummary(data))
    })
  }
}


export function handleDataOverview(){
  return dispatch => {
    userDataApi.dataOverview()
    .then(data => dispatch(fetchDataOverview(data)));
  }
}
//核劵
export function handleUserDataUse(){
  return dispatch => {
    dispatch(fetchLoading())
    userDataApi.userDataUse('USE')
    .then(data => {
      dispatch(fetchUserDataUse(data))
      dispatch(fetchLoading(true))
    })
  }
}
//领劵
export function handleUserDataGet(){
  return dispatch => {
    userDataApi.userDataUse('GET')
    .then(data => {
      dispatch(fetchUserDataGet(data))
    })
  }
}

export function handleTopData(){
  return dispatch => {
    DataPublicApi.queryReportTopData()
    .then(data => dispatch(fetchTopData(data)))
  }
}


export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_ACTIVELIST:
      return {...state, activeList: action.activeList};
    case FETCH_DATAOVERVIEW:
      return {...state, dataOverview: action.dataOverview};
    case FETCH_DATASUMMARY:
      return {...state, dataSummary: action.dataSummary};
    case FETCH_USERDATAUSE:
      return {...state, userDataUse: action.userDataUse};
    case FETCH_USERDATAGET:
      return {...state, userDataGet: action.userDataGet};
    case FETCH_TOPDATA:
      return {...state, topData: action.topData};
    case FETCH_LOADED:
      return {...state, loading: !action.loading};
    default:
      return state;
  }
}
