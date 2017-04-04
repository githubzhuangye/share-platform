import { fromJS, List } from 'immutable';
import { commonApi } from 'api';
import cache from 'helpers/cache';

const PREFIX = '@@COMMON/';
const SET_PROVINCE_AND_CITY = PREFIX + 'SET_PROVINCE_AND_CITY';
const SET_SAAS_LIST = PREFIX + 'SET_SAAS_LIST';

function setProvinceAndCity(provinceAndCity) {
  return {
    type: SET_PROVINCE_AND_CITY,
    provinceAndCity
  };
}

function setSaasList(saasList) {
  return {
    type: SET_SAAS_LIST,
    saasList
  };
}

export function handleFetchProvinceAndCity() {
  return dispatch => {
    return cache.get(commonApi.fetchProvinceAndCity())
      .then(provinceAndCity => dispatch(setProvinceAndCity(provinceAndCity)));
  };
}

export function handleFetchSaasList() {
  return dispatch => {
    return commonApi
      .fetchSaasList()
      .then(saasList => {
        dispatch(setSaasList(saasList));
        return saasList;
      });
  };
}

const initialState = fromJS({
  provinceAndCity: [],
  saasList: []
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_PROVINCE_AND_CITY:
      return state.set('provinceAndCity', List(action.provinceAndCity));
    case SET_SAAS_LIST:
      return state.set('saasList', List(action.saasList));
    default:
      return state;
  }
}
