import moment from 'moment';
import { DataPublicApi } from 'api';
import { PRODUCT_STATUS, FORM_MODE } from 'config/constants';
import { transformStatus } from 'helpers/util';



const PREFIX='@@CATEGORYDATA/';

const FETCH_ACTIVELIST = PREFIX + 'FETCH_ACTIVELIST';
const FETCH_CATEGORYUSE = PREFIX + 'FETCH_CATEGORYUSE';
const FETCH_CATEGORYGET = PREFIX + 'FETCH_CATEGORYGET';

const initialState = {
  activeList: [],
  categoryUse:{},
  categoryGet:{},
};

function fetchActiveList(activeList) {
  return {
    type: FETCH_ACTIVELIST,
    activeList: activeList
  };
}

function fetchCategoryGet(categoryGet) {
  return {
    type: FETCH_CATEGORYGET,
    categoryGet: categoryGet
  };
}
function fetchCategoryUse(categoryUse) {
  return {
    type: FETCH_CATEGORYUSE,
    categoryUse: categoryUse
  };
}

export function handleActivityList(){
  return dispatch => {
    DataPublicApi.fetchActivityList()
    .then(data => dispatch(fetchActiveList(data)));
  }
}



export function handleCategoryUse(){
  return dispatch => {
    DataPublicApi.CategoryData('USE')
    .then(data => dispatch(fetchCategoryUse(data)));
  }
}
export function handleCategoryGet(){
  return dispatch => {
    DataPublicApi.CategoryData('GET')
    .then(data => dispatch(fetchCategoryGet(data)));
  }
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_ACTIVELIST:
      return {...state, activeList: action.activeList};
    case FETCH_CATEGORYGET:
      return {...state, categoryGet: action.categoryGet};
    case FETCH_CATEGORYUSE:
      return {...state, categoryUse: action.categoryUse};
    default:
      return state;
  }
}
