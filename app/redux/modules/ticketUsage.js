import { ticketQueryApi } from 'api';

const PREFIX = '@@TICKET_USAGE/';
const OPEN_TICKET_USAGE_MODAL = PREFIX + 'OPEN_TICKET_USAGE_MODAL';
const CLOSE_TICKET_USAGE_MODAL = PREFIX + 'CLOSE_TICKET_USAGE_MODAL';
const SET_TICKET_USAGE_CONDITION = PREFIX + 'SET_TICKET_USAGE_CONDITION';
const FETCH_TICKET_USAGE = PREFIX + 'FETCH_TICKET_USAGE';
const FETCH_TICKET_USAGE_SUCCESS = PREFIX + 'FETCH_TICKET_USAGE_SUCCESS';
const FETCH_TICKET_USAGE_FAIL = PREFIX + 'FETCH_TICKET_USAGE_FAIL';
const SET_PUBID = PREFIX + 'SET_TICKET_PUBID';

const initialState = {
  ticketUsageModalVisible: false,
  loading: false,
  error: '',
  dataSource: [],
  condition: '全部',
  pubid: '01607266'
};

export function openTicketUsageModal() {
  return {
    type: OPEN_TICKET_USAGE_MODAL
  };
}

export function setUsagePubid(pubid) {
  return {
    type: SET_PUBID,
    pubid
  };
}

export function closeTicketUsageModal() {
  return {
    type: CLOSE_TICKET_USAGE_MODAL
  };
}

function setTicketUsageCondition(condition) {
  return {
    type: SET_TICKET_USAGE_CONDITION,
    condition
  };
}

function fetchTicketUsage() {
  return {
    type: FETCH_TICKET_USAGE
  };
}

function fetchTicketUsageSuccess(dataSource) {
  return {
    type: FETCH_TICKET_USAGE_SUCCESS,
    dataSource
  };
}

function fetchTicketUsageFail(error) {
  return {
    type: FETCH_TICKET_USAGE_FAIL,
    error
  };
}

export function changeConditionAndFetchData(condition) {
  return (dispatch, getState) => {
    const { pubid } = getState().ticketUsage;
    dispatch(setTicketUsageCondition(condition));
    dispatch(fetchTicketUsage());
    // ticketQueryApi
    //   .fetchTicketUsage(condition, pubid)
    //   .then(dataSource => dispatch(fetchTicketUsageSuccess(dataSource)))
    //   .catch(error => dispatch(fetchTicketUsageFail(error.message)));
  };
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_TICKET_USAGE_MODAL:
      return {...state, ticketUsageModalVisible: true};
    case CLOSE_TICKET_USAGE_MODAL:
      return {...state, ticketUsageModalVisible: false};
    case SET_TICKET_USAGE_CONDITION:
      return {...state, condition: action.condition};
    case FETCH_TICKET_USAGE:
      return {...state, loading: true};
    case FETCH_TICKET_USAGE_SUCCESS:
      return {...state, loading: false, dataSource: action.dataSource};
    case FETCH_TICKET_USAGE_SUCCESS:
      return {...state, loading: false, error: action.error};
    case SET_PUBID:
      return {...state, pubid: action.pubid};
    default:
      return state;
  }
}
