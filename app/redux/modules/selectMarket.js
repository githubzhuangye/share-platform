import { fromJS, List } from 'immutable';
import { couponPublishApi, alCouponApi } from 'api';
import { USER_TYPE } from 'config/constants';

const PREFIX = '@@SELECT_MARKET/';
const OPEN_MODAL = PREFIX + 'OPEN_MODAL';
const CLOSE_MODAL = PREFIX + 'CLOSE_MODAL';
const SET_ALL_REGION = PREFIX + 'SET_ALL_REGION';
const SET_SELECTED_REGION = PREFIX + 'SET_SELECTED_REGION';
const SET_SAAS_ID = PREFIX + 'SET_SAAS_ID';
const SET_NEXT_DATASOURCE = PREFIX + 'SET_NEXT_DATASOURCE';
const SET_NEXT_TARGET_KEYS = PREFIX + 'SET_NEXT_TARGET_KEYS';
const REPLACE_NEXT_MARKETS_WITH_CURRENT = PREFIX + 'REPLACE_NEXT_MARKETS_WITH_CURRENT';
const REPLACE_CURRENT_MARKETS_WITH_NEXT = PREFIX + 'REPLACE_CURRENT_MARKETS_WITH_NEXT';
const RESET_MARKETS = PREFIX + 'RESET_MARKETS';
const ADD_SAAS = PREFIX + 'ADD_SAAS';
const REMOVE_SAAS = PREFIX + 'REMOVE_SAAS';

export function openModal() {
  return {
    type: OPEN_MODAL,
  };
}

export function closeModal() {
  return {
    type: CLOSE_MODAL,
  };
}

export function setAllRegion(allRegion, index) {
  return {
    type: SET_ALL_REGION,
    allRegion,
    index,
  };
}

export function setSelectedRegion(selectedRegion, index) {
  return {
    type: SET_SELECTED_REGION,
    selectedRegion,
    index,
  };
}

export function setSaasId(saasId, index) {
  return {
    type: SET_SAAS_ID,
    saasId,
    index,
  };
}

function replaceNextMarketsWithCurrent() {
  return {
    type: REPLACE_NEXT_MARKETS_WITH_CURRENT
  };
}

export function replaceCurrentMarketsWithNext() {
  return {
    type: REPLACE_CURRENT_MARKETS_WITH_NEXT
  };
}

export function setNextDataSource(dataSource, index) {
  return {
    type: SET_NEXT_DATASOURCE,
    dataSource,
    index,
  };
}

export function setNextTargetKeys(targetKeys, index) {
  return {
    type: SET_NEXT_TARGET_KEYS,
    targetKeys,
    index,
  };
}

export function resetMarkets() {
  return {
    type: RESET_MARKETS
  };
}

export function addSaas() {
  return {
    type: ADD_SAAS,
  };
}

export function removeSaas(index) {
  return {
    type: REMOVE_SAAS,
    index,
  };
}

export function handleOpenModal() {
  return (dispatch, getState) => {
    const { userType } = getState().auth;
    const saasList = getState().common.get('saasList');
    const partnerId = getState().publishForm.get('partnerId');
    const isSelectMode = getState().publishForm.get('isSelectMode');
    dispatch(openModal());
    dispatch(replaceNextMarketsWithCurrent());
    // if userType is RETAILER, set saasId manully
    if (userType === USER_TYPE.RETAILER.value && isSelectMode !== 2) {
      dispatch(handleSaasChange(saasList.get(0).ID, 0));
    } else if(isSelectMode === 2) {
      dispatch(handleSaasChange(saasList.get(0).ID, 0,partnerId,isSelectMode));
      dispatch(setNextTargetKeys([], 0));
      dispatch(setNextDataSource([], 0));
    }
  };
}

export function handleConfirmModal() {
  return dispatch => {
    dispatch(closeModal());
    dispatch(replaceCurrentMarketsWithNext());
  };
}

// 改变选中的saasId, 并根据saasId请求可选的区域
export function handleSaasChange(saasId, index,partnerid,isSelectMode) {
  return (dispatch, getState) => {
    dispatch(setSaasId(saasId, index));
    if (isSelectMode === 2) {
      const partnerId = getState().publishForm.get("partnerId")
      return alCouponApi.queryCityBySaas(partnerId)
        .then(transformProviceAndCityByAlipay)
        .then(data => dispatch(setAllRegion(data, index)));
    } else if (saasId) {
      return couponPublishApi.queryCityBySaas(saasId)
        .then(transformProviceAndCity)
        .then(data => dispatch(setAllRegion(data, index)));
    } else {
      // 如果saasId为空(用户清除了选中的商户)则置空所有相关信息
      dispatch(setSelectedRegion([], index));
      dispatch(setAllRegion([], index));
      dispatch(setNextDataSource([], index));
      dispatch(setNextTargetKeys([], index));
    }
  };
}

export function transformProviceAndCity(provinceAndCity) {
  function format(item) {
    return {
      key: `${item.id}-${item.name}`,
      value: `${item.id}-${item.name}`,
      label: item.name,
    };
  }
  return provinceAndCity
  .map(item => ({
    ...format(item),
    children: item.city.map(city => format(city))
  }));
}
export function transformProviceAndCityByAlipay(provinceAndCity) {

  function format(item) {
    return {
      key: `${item.province}-${item.province}`,
      value: `${item.province}-${item.province}`,
      label: item.province,
    };
  }

  function formatCity(item) {
    return {
      key: `${item}-${item}`,
      value: `${item}-${item}`,
      label: item,
    };
  }

  return provinceAndCity
  .map(item => ({
    ...format(item),
    children: item.city.map(city => formatCity(city))
  }));
}

// 选中区域后，设置selectedRegion并请求对应的门店,然后设置对应的dataSource
export function handleRegionChange(region, index) {
  return dispatch => {
    dispatch(setSelectedRegion(region, index));
    if (region.length) {
      dispatch(handleFetchMarket(index));
    } else {
      // 如果region为空数组(用户清空了选中的区域), 置空targetKeys和dataSource
      dispatch(setNextDataSource([], index));
      dispatch(setNextTargetKeys([], index));
    }
  };
}

function handleFetchMarket(index) {
  return (dispatch, getState) => {
    const selectMarket = getState().selectMarket;
    const publishForm = getState().publishForm;
    const selectedRegion = selectMarket.getIn(['nextMarkets', index, 'selectedRegion']);
    const saasId = selectMarket.getIn(['nextMarkets', index, 'saasId']);
    const isSelectMode = publishForm.get('isSelectMode');
    const isMyVip = publishForm.get('isMyVip');
    const partnerId = publishForm.get('partnerId');

    const promises = selectedRegion.map(item => {
      const cityCode = item.split('-')[0];
        return couponPublishApi
          .queryMarketByCity(saasId, cityCode, isSelectMode, isMyVip, partnerId)
          .then(data => data.market.map(item => ({...item, cityCode})));
    });
    return Promise.all(promises)
      .then(result => result.reduce((total, cur) => [...total, ...cur], []))
      .then(marketList => marketList.map(item => ({key: `${item.cityCode}:${item.ID}`, title: item.NAME})))
      .then(nextDataSource => {
        const originTargetKeys = selectMarket.getIn(['nextMarkets', index, 'targetKeys']).toArray();
        const nextTargetKeys = originTargetKeys.filter(targetKey => nextDataSource.findIndex(i => i.key === targetKey) !== -1);
        dispatch(setNextTargetKeys(nextTargetKeys, index));
        dispatch(setNextDataSource(nextDataSource, index));
      });
  };
}

export function handleClearMarket() {
  return (dispatch, getState) => {
      dispatch(resetMarkets());
    }
}

const rawMarket = {
  dataSource: [],
  targetKeys: [],
  allRegion: [],
  selectedRegion: [],
  saasId: undefined,
};

const initailState = fromJS({
  modalVisible: false,
  currentMarkets: [rawMarket],
  nextMarkets: [rawMarket],
});

export default function reducer(state = initailState, action) {
  switch (action.type) {
    case OPEN_MODAL:
      return state.set('modalVisible', true);
    case CLOSE_MODAL:
      return state.set('modalVisible', false);
    case SET_SAAS_ID:
      return state.setIn(['nextMarkets', action.index, 'saasId'], action.saasId);
    case SET_ALL_REGION:
      return state.setIn(['nextMarkets', action.index, 'allRegion'], List(action.allRegion));
    case SET_SELECTED_REGION:
      return state.setIn(['nextMarkets', action.index, 'selectedRegion'], List(action.selectedRegion));
    case SET_NEXT_DATASOURCE:
      return state.setIn(['nextMarkets', action.index, 'dataSource'], List(action.dataSource));
    case SET_NEXT_TARGET_KEYS:
      return state.setIn(['nextMarkets', action.index, 'targetKeys'], List(action.targetKeys));
    case REPLACE_NEXT_MARKETS_WITH_CURRENT:
      return state.set('nextMarkets', state.get('currentMarkets'));
    case REPLACE_CURRENT_MARKETS_WITH_NEXT:
      return state.set('currentMarkets', state.get('nextMarkets'));
    case RESET_MARKETS:
      return state
        .set('currentMarkets', initailState.get('currentMarkets'))
        .set('nextMarkets', initailState.get('nextMarkets'));
    case ADD_SAAS:
      return state.update('nextMarkets', nextMarkets => nextMarkets.insert(nextMarkets.size, fromJS(rawMarket)));
    case REMOVE_SAAS:
      return state.update('nextMarkets', nextMarkets => nextMarkets.remove(action.index));
    default:
      return state;
  }
}
