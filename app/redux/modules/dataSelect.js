import { TODAY,SEVENDAY } from 'helpers/util';
import { DataPublicApi } from 'api';

const PREFIX = '@@DATESELECT/';
const SET_DATE = PREFIX + 'SET_DATE';
const FETCH_ACTIVELIST = PREFIX + 'FETCH_ACTIVELIST';
const FETCH_ACTIVEID = PREFIX + 'FETCH_ACTIVEID';
const FETCH_SUBMIT = PREFIX + 'FETCH_SUBMIT';

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

export function fetchActiveId(activeId){
  return {
    type: FETCH_ACTIVEID,
    activeId,
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






const initialState = {
  starttime: SEVENDAY,
  endtime: TODAY.replace(/-/g,""),
  activeList:[],
  activeId:'',
  Submit:false,
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
      return {...state,Submit: !state.Submit};
    default:
      return state;
  }
}
