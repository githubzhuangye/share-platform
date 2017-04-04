import moment from 'moment';
import { DataPublicApi } from 'api';
import { PRODUCT_STATUS, FORM_MODE } from 'config/constants';
import { transformStatus } from 'helpers/util';



const PREFIX='@@REGIONDATA/';

const FETCH_ACTIVELIST = PREFIX + 'FETCH_ACTIVELIST';

const initialState = {
  activeList: []
};

function fetchActiveList(activeList) {
  return {
    type: FETCH_ACTIVELIST,
    activeList: activeList
  };
}

export function handleActiveList(){
  return dispatch => {
    DataPublicApi.fetchActivityList()
    .then(data => dispatch(fetchActiveList(data)));
  }
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_ACTIVELIST:
      return {...state, activeList: action.activeList};
    default:
      return state;
  }
}
