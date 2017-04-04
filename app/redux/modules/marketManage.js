import { marketManageApi } from 'api';
import { transformStatus, updateArray } from 'helpers/util';
import { FORM_MODE, MARKET_STATUS } from 'config/constants';

const { NEW, EDIT } = FORM_MODE;

const PREFIX = '@@MARKT_MANAGE/';
const FETCH_MARKET = PREFIX + 'FETCH_MARKET';
const FETCH_MARKET_SUCCESS = PREFIX + 'FETCH_MARKET_SUCCESS';
const SET_TOTAL_MARKET = PREFIX + 'SET_TOTAL_MARKET';
const SET_PAGE = PREFIX + 'SET_PAGE';
const SET_SELECTED_KEYS = PREFIX + 'SET_SELECTED_KEYS';
const CHANGE_MARKETS_STATUS = PREFIX + 'CHANGE_MARKETS_STATUS';
const SET_QUERY_DATA = PREFIX + 'SET_QUERY_DATA';
const OPEN_UPSERT_FORM = PREFIX + 'OPEN_UPSERT_FORM';
const CLOSE_UPSERT_FORM = PREFIX + 'CLOSE_UPSERT_FORM';
const SET_UPSERT_FORM_DATA = PREFIX + 'SET_UPSERT_FORM_DATA';
const SET_UPSERT_FORM_MODE_NEW = PREFIX + 'SET_UPSERT_FORM_MODE_NEW';
const SET_UPSERT_FORM_MODE_EDIT = PREFIX + 'SET_UPSERT_FORM_MODE_EDIT';
const ADD_MARKET = PREFIX + 'ADD_MARKET';
const EDIT_MARKET = PREFIX + 'EDIT_MARKET';
const SET_REGION = PREFIX + 'SET_REGION';

function fetchMarket() {
  return {
    type: FETCH_MARKET
  };
}

function fetchMarketSuccess(dataSource) {
  return {
    type: FETCH_MARKET_SUCCESS,
    dataSource
  };
}

function setTotalMarket(totalMarket) {
  return {
    type: SET_TOTAL_MARKET,
    totalMarket
  }
}

function setPage(page) {
  return {
    type: SET_PAGE,
    page
  };
}

function changeMarketsStatus(selectedKeys, status) {
  return {
    type: CHANGE_MARKETS_STATUS,
    selectedKeys,
    status
  };
}

function setQueryData(queryData) {
  return {
    type: SET_QUERY_DATA,
    queryData
  };
}

export function setSelectedKeys(selectedKeys) {
  return {
    type: SET_SELECTED_KEYS,
    selectedKeys
  };
}

export function openUpsertForm() {
  return {
    type: OPEN_UPSERT_FORM
  };
}

function closeUpsertForm() {
  return {
    type: CLOSE_UPSERT_FORM
  };
}

function setUpsertFormData(upsertFormData) {
  return {
    type: SET_UPSERT_FORM_DATA,
    upsertFormData
  };
}

function setUpsertFormModeNew() {
  return {
    type: SET_UPSERT_FORM_MODE_NEW
  };
}

function setUpsertFormModeEdit() {
  return {
    type: SET_UPSERT_FORM_MODE_EDIT
  };
}

export function handleFetchMarket() {
  return (dispatch, getState) => {
    const { queryData, page } = getState().marketManage;
    dispatch(fetchMarket());
    marketManageApi
      .fetchMarket({...queryData, curpage: page})
      .then(({dataSource, totalMarket}) => {
        dispatch(fetchMarketSuccess(dataSource))
        dispatch(setTotalMarket(totalMarket))
      })
  };
}

export function handlePageChange(page) {
  return (dispatch, getState) => {
    const { queryData } = getState().marketManage;
    dispatch(setPage(page));
    dispatch(handleFetchMarket());
  };
}

export function handleMarketsStatusChange(status) {
  return (dispatch, getState) => {
    const { selectedKeys } = getState().marketManage;
    // TODO: api
    dispatch(changeMarketsStatus(selectedKeys, status));
    dispatch(setSelectedKeys([]));
  };
}

export function handleQuery(queryData) {
  return dispatch => {
    dispatch(setQueryData(queryData));
    dispatch(handleFetchMarket());
  };
}

export function handleCloseUpsertForm() {
  return dispatch => {
    dispatch(closeUpsertForm());
    dispatch(setUpsertFormModeNew());
  };
}

function addMarket(marketInfo) {
  return {
    type: ADD_MARKET,
    marketInfo
  };
}

function editMarket(index, marketInfo) {
  return {
    type: EDIT_MARKET,
    index,
    marketInfo
  };
}

export function setRegion(region) {
  return {
    type: SET_REGION,
    region
  };
}

function getRegion(provinceAndCity, citycode) {
  let region;
  for (let item of provinceAndCity) {
    for (let city of item.cities) {
      if (city.CODE === citycode) {
        const province = item.province;
        region = [`${province.CODE}-${province.NAME}`, `${city.CODE}-${city.NAME}`];
        return region;
      }
    }
  }
  return [];
}

function extractAddress(address, region) {
  if (!region.length) {
    return address;
  }
  const [ province, city ] = region;
  const provinceName = province.split('-')[1];
  const cityName = city.split('-')[1];
  const prefix = provinceName + cityName;
  return address.slice(prefix.length);
}

export function getEditedMarektFormData(marketId) {
  return (dispatch, getState) => {
    const { dataSource } = getState().marketManage;
    const provinceAndCity = getState().common.get('provinceAndCity').toJS();
    const market = dataSource.find(item => item.key === marketId);
    const region = getRegion(provinceAndCity, market.citycode);
    dispatch(setRegion(region));
    dispatch(setUpsertFormData(market));
    return market;
  };
}

export function handleAddMarket(marketInfo) {
  return (dispatch, getState) => {
    const saas = getState().auth.saasId;
    return marketManageApi
      .addMarket({...marketInfo, saas})
      .then(({code, msg}) => {
        if (parseInt(code) !== 400) {
          dispatch(addMarket({...marketInfo, status: MARKET_STATUS.START.value}))
        } else {
          return Promise.reject({message: msg});
        }
      });
  };
}

export function handleEditMarket(marketInfo) {
  return (dispatch, getState) => {
    const { upsertFormData, dataSource } = getState().marketManage;
    const saas = getState().auth.saasId;
    const index = dataSource.findIndex(item => item.key === upsertFormData.key);
    return marketManageApi
      .updateMarket({...marketInfo, saas})
      .then(({code, msg}) => {
        if (parseInt(code) !== 400) {
          dispatch(editMarket(index, {...upsertFormData, ...marketInfo}));
        } else {
          return Promise.reject({message: msg});
        }
      });
  };
}

const initialState = {
  loading: false,
  dataSource: [],
  totalMarket: 0,
  page: 1,
  queryData: {},
  selectedKeys: [],
  upsertFormMode: NEW.value,
  upsertFormData: {},
  upsertFormVisible: false,
  region: []
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_MARKET:
      return {...state, loading: true};
    case FETCH_MARKET_SUCCESS:
      return {...state, dataSource: action.dataSource, loading: false};
    case SET_TOTAL_MARKET:
      return {...state, totalMarket: action.totalMarket};
    case SET_PAGE:
      return {...state, page: action.page};
    case SET_SELECTED_KEYS:
      return {...state, selectedKeys: action.selectedKeys};
    case CHANGE_MARKETS_STATUS:
      return {...state, dataSource: transformStatus(action.status, state.dataSource, action.selectedKeys)};
    case SET_QUERY_DATA:
      return {...state, queryData: action.queryData};
    case OPEN_UPSERT_FORM:
      return {...state, upsertFormVisible: true};
    case CLOSE_UPSERT_FORM:
      return {...state, upsertFormVisible: false};
    case SET_UPSERT_FORM_DATA:
      return {...state, upsertFormData: action.upsertFormData};
    case SET_UPSERT_FORM_MODE_NEW:
      return {...state, upsertFormMode: NEW.value};
    case SET_UPSERT_FORM_MODE_EDIT:
      return {...state, upsertFormMode: EDIT.value};
    case ADD_MARKET:
      return {...state, dataSource: [action.marketInfo, ...state.dataSource]};
    case EDIT_MARKET:
      return {...state, dataSource: updateArray(state.dataSource, action.index, action.marketInfo)};
    case SET_REGION:
      return {...state, region: action.region};
    default:
      return state;
  }
}
