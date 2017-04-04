import { fromJS, Map, List } from 'immutable';
import { reportApi } from 'api';

const PREFIX = '@@BARNDER_QUERY_HEADER';
const FETCH = PREFIX + 'FETCH';
const FETCH_SUCCESS = PREFIX + 'FETCH_SUCCESS';
const FETCH_AREA_LIST_SUCCESS = PREFIX + 'FETCH_AREA_LIST_SUCCESS';
const FETCH_SAAS_LIST_SUCCESS = PREFIX + 'FETCH_SAAS_LIST_SUCCESS';
const FETCH_MARKET_LIST_SUCCESS = PREFIX + 'FETCH_MARKET_LIST_SUCCESS';

function fetch() {
  return {
    type: FETCH,
  };
}

function fetchSuccess() {
  return {
    type: FETCH_SUCCESS,
  };
}

function fetchAreaListSuccess(areaList) {
  return {
    type: FETCH_AREA_LIST_SUCCESS,
    areaList,
  };
}

function fetchSaasListSuccess(saasList) {
  return {
    type: FETCH_SAAS_LIST_SUCCESS,
    saasList,
  };
}

function fetchMarketListSuccess(marketList) {
  return {
    type: FETCH_MARKET_LIST_SUCCESS,
    marketList,
  };
}

export function handleFetchList() {
  return (dispatch, getState) => {
    const brandlerQueryHeader = getState().brandlerQueryHeader;
    const isFetched = brandlerQueryHeader.get('isFetched');
    if (!isFetched) {
      dispatch(fetch());
      Promise.all([
        reportApi.fetchAreaList(),
        reportApi.fetchSaasList(),
      ])
        .then(data => {
          dispatch(fetchAreaListSuccess(data[0]));
          dispatch(fetchSaasListSuccess(data[1]));
          dispatch(fetchSuccess());
        });
    }
  };
}

export function handleFetchMarketList(query) {
  return dispatch => {
    dispatch(fetch());
    reportApi.fetchBrandlerMarketList(query)
      .then(data => dispatch(fetchMarketListSuccess(data)))
      .then(() => dispatch(fetchSuccess()));
  };
}

const initialState = fromJS({
  isFetched: false,
  loading: false,
  areaList: [],
  saasList: [],
  marketList: [],
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH:
      return state.set('loading', true);
    case FETCH_SUCCESS:
      return state.set('loading', false).set('isFetched', true);
    case FETCH_AREA_LIST_SUCCESS:
      return state.set('areaList', List(action.areaList));
    case FETCH_SAAS_LIST_SUCCESS:
      return state.set('saasList', List(action.saasList));
    case FETCH_MARKET_LIST_SUCCESS:
      return state.set('marketList', List(action.marketList));
    default:
      return state;
  }
}
