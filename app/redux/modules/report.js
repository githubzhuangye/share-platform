import { reportApi } from 'api';

const PREFIX = '@@REPORT/';
const FETCH_ACTIVITY_LIST_SUCCESS = PREFIX + 'FETCH_ACTIVITY_LIST_SUCCESS';
const FETCH_MARKET_LIST_SUCCESS = PREFIX + 'FETCH_MARKET_LIST_SUCCESS';

const marketCache = {};

function fetchActivityListSuccess(activityList) {
  return {
    type: FETCH_ACTIVITY_LIST_SUCCESS,
    activityList
  };
}

function fetchMarketListSuccess(marketList) {
  return {
    type: FETCH_MARKET_LIST_SUCCESS,
    marketList
  };
}

export function handleFetchActivityList() {
  return (dispatch, getState) => {
    const { activityList } = getState().report;
    if (activityList.length) { // 多个报表初始化的时候都会调用这个方法，如果加载过活动列表，就直接返回，不再去后台获取
      return activityList;
    }
    return reportApi
      .fetchActivityList()
      .then(data => {
        dispatch(fetchActivityListSuccess(data));
        return data;
      });
  };
}

export function handleFetchMarketList(activeId) {
  // 该方法会先尝试从marketCache中获取数据，没有的话再去后台拉取数据
  return dispatch => {
    if (marketCache[activeId]) {
      dispatch(fetchMarketListSuccess(marketCache[activeId]));
    } else {
      reportApi
        .fetchMarketList(activeId)
        .then(data => {
          dispatch(fetchMarketListSuccess(data));
          marketCache[activeId] = data;
        })
    }
  };
}

const initialState = {
  activityList: [],
  marketList: []
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_ACTIVITY_LIST_SUCCESS:
      return {...state, activityList: action.activityList};
    case FETCH_MARKET_LIST_SUCCESS:
      return {...state, marketList: action.marketList};
    default:
      return state;
  }
}
