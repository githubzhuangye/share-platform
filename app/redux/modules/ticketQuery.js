import { message } from 'antd';
import { ticketQueryApi } from 'api';
import { COUPON_STATUS } from 'config/constants';
import { updateArray } from 'helpers/util';

const { VERIFIED, VERIFIED_FAIL, OVER } = COUPON_STATUS;

const PREFIX = '@@TICKET_QUERY/'
const FETCH_TICKET_QUERY = PREFIX + 'FETCH_TICKET_QUERY';
const FETCH_TICKET_QUERY_SUCCESS = PREFIX + 'FETCH_TICKET_QUERY_SUCCESS';
const FETCH_TICKET_QUERY_FAIL = PREFIX + 'FETCH_TICKET_QUERY_FAIL';
const SET_TICKET_QUERY_PAGE = PREFIX + 'SET_TICKET_QUERY_PAGE';
const SET_TICKET_QUERY_TOTAL = PREFIX + 'SET_TICKET_QUERY_TOTAL';
const SET_QUERY_DATA = PREFIX + 'SET_QUERY_DATA';
const SET_SELECTED_KEYS = PREFIX + 'SET_SELECTED_KEYS';
const SET_COUPON_TYPE = PREFIX + 'SET_COUPON_TYPE';
const OFF_TICKETS = PREFIX + 'OFF_TICKETS';
const PASS_TICKET = PREFIX + 'PASS_TICKET';
const REJECT_TICKET = PREFIX + 'REJECT_TICKET';

function fetchTicketQuery() {
  return {
    type: FETCH_TICKET_QUERY
  }
}

function fetchTicketQuerySuccess(list) {
  return {
    type: FETCH_TICKET_QUERY_SUCCESS,
    list
  };
}

function fetchTicketQueryFail(error) {
  return {
    type: FETCH_TICKET_QUERY_FAIL,
    error
  };
}

function setQueryData(queryData) {
  return {
    type: SET_QUERY_DATA,
    queryData
  };
}

export function offTickets(offKeys) {
  return {
    type: OFF_TICKETS,
    offKeys
  }
}

export function setSelectedKeys(selectedKeys) {
  return {
    type: SET_SELECTED_KEYS,
    selectedKeys
  };
}

export function selectCouponType(couponType) {
  return {
    type: SET_COUPON_TYPE,
    couponType,
  };
}

export function handleOffTickets() {
  return (dispatch, getState) => {
    // api request
    const selectedKeys = getState().ticketQuery.selectedKeys;
    ticketQueryApi
      .offTickets(selectedKeys)
      .then(code => {
        if (+code === 200) {
          message.success('下架成功');
          dispatch(offTickets(selectedKeys));
          dispatch(setSelectedKeys([]));
        } else {
          message.error('下架失败');
        }
      });
  };
}

export function handleFetchTicketQuery(queryData = {}) {
  return dispatch => {
    dispatch(fetchTicketQuery());
    ticketQueryApi.fetchTicketQuery(queryData)
      .then(({dataSource, total}) => {
        dispatch(fetchTicketQuerySuccess(dataSource))
        dispatch(setTotal(total));
      })
      .catch(error => dispatch(fetchTicketQueryFail(error.message)));
  };
}

export function handleQueryTicket(queryData) {
  return dispatch => {
    dispatch(setPage(1));
    dispatch(setQueryData(queryData));
    dispatch(handleFetchTicketQuery(queryData));
  };
}

export function handlePageChange(page) {
  return (dispatch, getState) => {
    const queryData = getState().ticketQuery.queryData;
    dispatch(setPage(page));
    dispatch(handleFetchTicketQuery({...queryData, page}));
  };
}

function setPage(page) {
  return {
    type: SET_TICKET_QUERY_PAGE,
    page
  };
}

function setTotal(total) {
  return {
    type: SET_TICKET_QUERY_TOTAL,
    total
  };
}

function passTicket(index) {
  return {
    type: PASS_TICKET,
    index
  };
}

function rejectTicket(index) {
  return {
    type: REJECT_TICKET,
    index
  };
}

function handleCheckTicket(ticketId, status, checkFn) {
  return (dispatch, getState) => {
    return ticketQueryApi.checkTicket(ticketId, status)
      .then(({code, msg}) => {
        if (parseInt(code) === 400) {
          throw new Error(msg);
        } else {
          const { dataSource } = getState().ticketQuery;
          const index = dataSource.findIndex(item => item.key === ticketId);
          dispatch(checkFn(index));
        }
      });
  };
}

export function handlePassTicket(ticketId) {
  return dispatch => {
    return dispatch(handleCheckTicket(ticketId, VERIFIED.value, passTicket));
  }
}

export function handleRejectTicket(ticketId) {
  return dispatch => {
    return dispatch(handleCheckTicket(ticketId, VERIFIED_FAIL.value, rejectTicket));
  }
}

const initialState = {
  page: 1,
  total: 0,
  dataSource: [],
  loading: false,
  error: '',
  queryData: {
    query_type: 1,
  },
  selectedKeys: [],
  couponType: 1,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_TICKET_QUERY:
      return {...state, loading: true};
    case FETCH_TICKET_QUERY_SUCCESS:
      return {...state, loading: false, dataSource: action.list};
    case FETCH_TICKET_QUERY_FAIL:
      return {...state, loading: false, error: action.error};
    case SET_TICKET_QUERY_PAGE:
      return {...state, page: action.page};
    case SET_TICKET_QUERY_TOTAL:
      return {...state, total: action.total};
    case SET_QUERY_DATA:
      return {...state, queryData: action.queryData};
    case SET_SELECTED_KEYS:
      return {...state, selectedKeys: action.selectedKeys};
    case SET_COUPON_TYPE:
      return {...state, couponType: action.couponType};
    case OFF_TICKETS:
      return {...state, dataSource: state.dataSource.map(item => {
        if (action.offKeys.includes(item.key)) {
          return {...item, status: OVER.value};
        } else {
          return item;
        }
      })};
    case PASS_TICKET:
      return {...state, dataSource: updateArray(state.dataSource, action.index, {status: VERIFIED.value})};
    case REJECT_TICKET:
      return {...state, dataSource: updateArray(state.dataSource, action.index, {status: VERIFIED_FAIL.value})};
    default:
      return state;
  }
}
