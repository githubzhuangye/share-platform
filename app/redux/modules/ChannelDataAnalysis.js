import moment from 'moment';
import { ChannelDataAnalysisApi,DataPublicApi } from 'api';
import { PRODUCT_STATUS, FORM_MODE } from 'config/constants';
import { transformStatus } from 'helpers/util';



const PREFIX='@@CHANNELDATAANALYSIS/';

const FETCH_ACTIVELIST = PREFIX + 'FETCH_ACTIVELIST';
const FETCH_CHANNELDATAUSE = PREFIX + 'FETCH_CHANNELDATAUSE';
const FETCH_CHANNELDATAGET = PREFIX + 'FETCH_CHANNELDATAGET';
const FETCH_LOADED= PREFIX + 'FETCH_LOADED';

const initialState = {
  activeList: [],
  channelDataUse: {},
  channelDataGet: {},
  loading:false,
};

function fetchActiveList(activeList) {
  return {
    type: FETCH_ACTIVELIST,
    activeList: activeList
  };
}

function fetchChannelDataUse(channelDataUse) {
  return {
    type: FETCH_CHANNELDATAUSE,
    channelDataUse: channelDataUse
  };
}
function fetchChannelDataGet(channelDataGet) {
  return {
    type: FETCH_CHANNELDATAGET,
    channelDataGet: channelDataGet
  };
}
function fetchLoading(loading){
  return {
    type:FETCH_LOADED,
    loading:loading
  }
}

export function handleActiveList(){
  return dispatch => {
    DataPublicApi.fetchActivityList()
    .then(data => dispatch(fetchActiveList(data)));
  }
}
export function handleChannelDataUse(){
  return dispatch => {
    ChannelDataAnalysisApi.channelDataAnalysis('USE')
    .then(data => dispatch(fetchChannelDataUse(data)));
  }
}
export function handleChannelDataGet(){
  return dispatch => {
    dispatch(fetchLoading());
    ChannelDataAnalysisApi.channelDataAnalysis('GET')
    .then(data => {
      dispatch(fetchChannelDataGet(data))
      dispatch(fetchLoading(true))
    });
  }
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_ACTIVELIST:
      return {...state, activeList: action.activeList};
    case FETCH_CHANNELDATAUSE:
      return {...state, channelDataUse: action.channelDataUse};
    case FETCH_CHANNELDATAGET:
      return {...state, channelDataGet: action.channelDataGet};
    case FETCH_LOADED:
      return {...state, loading: !action.loading};
    default:
      return state;
  }
}
