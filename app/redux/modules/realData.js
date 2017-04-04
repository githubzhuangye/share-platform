import { realDataApi } from 'api';

const PREFIX = '@@REALDATA/';
const FETCH_ACTIVITY_LIST_SUCCESS = PREFIX + 'FETCH_ACTIVITY_LIST_SUCCESS';
const FETCH_DATAOVERVIEW_SUCCESS = PREFIX + 'FETCH_DATAOVERVIEW_SUCCESS';


function fetchActivityListSuccess(activityList) {
  return {
    type: FETCH_ACTIVITY_LIST_SUCCESS,
    activityList
  };
}

function fetchDataOverviewSuccess(pvuvData) {
  return {
    type: FETCH_DATAOVERVIEW_SUCCESS,
    pvuvData
  };
}

export function handleFetchActivityList() {
  return (dispatch, getState) => {
    const { activityList } = getState().realData;
    return realDataApi
      .fetchActivityList()
      .then(data => {
        dispatch(fetchActivityListSuccess(data));
        return data;
      });
  };
}

export function handleFetchPvuvData(value) {
  return (dispatch, getState) => {
    return realDataApi
      .dataOverview(value)
      .then(data => {
        console.log(dispatch(fetchDataOverviewSuccess(data)));
        dispatch(fetchDataOverviewSuccess(data));
        return data;
      })
  };
}

const initialState = {
  activityList: [],
  pvuvData: {}
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_ACTIVITY_LIST_SUCCESS:
      return {...state, activityList: action.activityList};
    case FETCH_DATAOVERVIEW_SUCCESS:
      return {...state, pvuvData: action.pvuvData};
    default:
      return state;
  }
}
