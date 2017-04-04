import moment from 'moment';
import { DataPublicApi } from 'api';
import { PRODUCT_STATUS, FORM_MODE } from 'config/constants';
import { transformStatus } from 'helpers/util';



const PREFIX='@@TRADESMAN/';

const FETCH_ACTIVELIST = PREFIX + 'FETCH_ACTIVELIST';
const FETCH_TRADESPARENT = PREFIX + 'FETCH_TRADESPARENT';
const FETCH_TRADESCHILD = PREFIX + 'FETCH_TRADESCHILD';
const FETCH_LOADING = PREFIX + 'FETCH_LOADING';

const initialState = {
  activeList: [],
  tradesParent:{},
  tradesChild:{},
  loading:false,
};

function fetchActiveList(activeList) {
  return {
    type: FETCH_ACTIVELIST,
    activeList: activeList
  };
}
function fetchTradesChild(tradesChild) {
  return {
    type: FETCH_TRADESCHILD,
    tradesChild: tradesChild
  };
}
function fetchTradesParent(tradesParent) {
  return {
    type: FETCH_TRADESPARENT,
    tradesParent: tradesParent
  };
}
 function fetchLoading(loading){
   return{
     type:FETCH_LOADING,
     loading:loading
   }
 }

export function handleActiveList(){
  return dispatch => {
    DataPublicApi.fetchActivityList()
    .then(data => dispatch(fetchActiveList(data)));
  }
}
export function handleTradesParent(){
  return dispatch => {
    dispatch(fetchLoading())
    DataPublicApi.TradesParent()
    .then(data => {
      dispatch(fetchTradesParent(data))
      dispatch(fetchLoading(true))
    });
  }
}
export function handleTradesChild(){
  return dispatch => {
    DataPublicApi.TradesChild()
    .then(data => dispatch(fetchTradesChild(data)));
  }
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_ACTIVELIST:
      return {...state, activeList: action.activeList};
    case FETCH_TRADESPARENT:
      return {...state, tradesParent: action.tradesParent};
    case FETCH_TRADESCHILD:
      return {...state, tradesChild: action.tradesChild};
    default:
      return state;
  }
}
