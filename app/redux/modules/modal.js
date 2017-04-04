import { ticketQueryApi,couponPublishApi } from 'api';
const PREFIX = '@@MODAL/';
const OPEN_TICKET_INFO_MODAL = PREFIX + 'OPEN_TICKET_INFO_MODAL';
const CLOSE_TICKET_INFO_MODAL = PREFIX + 'CLOSE_TICKET_INFO_MODAL';
const OPEN_TICKET_SHOP_MODAL = PREFIX + 'OPEN_TICKET_SHOP_MODAL';
const CLOSE_TICKET_SHOP_MODAL = PREFIX + 'CLOSE_TICKET_SHOP_MODAL';
const FETCH_TICKET_DETAIL_SUCCESS = PREFIX + 'FETCH_TICKET_DETAIL_SUCCESS';
const FETCH_TICKET_WX_SUCCESS = PREFIX + 'FETCH_TICKET_WX_SUCCESS';
const FETCH_TICKET_SHOPS_SUCCESS = PREFIX + 'FETCH_TICKET_SHOPS_SUCCESS';
const OPEN_TICKET_WX_MODAL = PREFIX + 'OPEN_TICKET_WX_MODAL';
const CLOSE_TICKET_WX_MODAL = PREFIX + 'CLOSE_TICKET_WX_MODAL';
const FETCH_TICKET_PAY_SUCCESS = PREFIX + 'FETCH_TICKET_PAY_SUCCESS';
const FETCH_TICKET_NEED_SUCCESS = PREFIX + 'FETCH_TICKET_NEED_SUCCESS';
const FETCH_TICKET_KEY_SUCCESS = PREFIX + 'FETCH_TICKET_KEY_SUCCESS';
const FETCH_TICKET_SUB_SUCCESS = PREFIX + 'FETCH_TICKET_SUB_SUCCESS';


const initialState = {
  ticketInfoModalVisible: false,
  ticketInfo: {},
  ticketWx: {},
  ticketShopModalVisible: false,
  WxticketModalVisible: false,
  shopsInfo: [],
  totalpay: '',
  needpay: '0',
  wxkey: '',
  subWx: false,
};

function ticketWxSub() {
  return {
    type: FETCH_TICKET_SUB_SUCCESS
  };
}


function openTicketInfoModal() {
  return {
    type: OPEN_TICKET_INFO_MODAL
  };
}

export function closeTicketInfoModal() {
  return {
    type: CLOSE_TICKET_INFO_MODAL
  };
}

function openTicketWxModal() {
  return {
    type: OPEN_TICKET_WX_MODAL
  };
}

export function closeTicketWxModal() {
  return {
    type: CLOSE_TICKET_WX_MODAL
  };
}

function openTicketShopModal() {
  return {
    type: OPEN_TICKET_SHOP_MODAL
  };
}

export function closeTicketShopModal() {
  return {
    type: CLOSE_TICKET_SHOP_MODAL
  };
}

function fetchTicketDetailSuccess(ticketInfo) {
  return {
    type: FETCH_TICKET_DETAIL_SUCCESS,
    ticketInfo
  };
}

function fetchTicketKeySuccess(wxkey) {
  return {
    type: FETCH_TICKET_KEY_SUCCESS,
    wxkey
  };
}

function fetchTicketPaySuccess(totalpay) {
  return {
    type: FETCH_TICKET_PAY_SUCCESS,
    totalpay
  };
}

export function fetchTicketNeedSuccess(needpay) {
  return {
    type: FETCH_TICKET_NEED_SUCCESS,
    needpay
  };
}

function fetchTicketWxSuccess(ticketWx) {
  return {
    type: FETCH_TICKET_WX_SUCCESS,
    ticketWx
  };
}

function fetchTicketShopsSuccess(shopsInfo) {
  return {
    type: FETCH_TICKET_SHOPS_SUCCESS,
    shopsInfo
  };
}

export function handleOpenInfoModalAndFetchData(pubid) {
  return dispatch => {
    dispatch(openTicketInfoModal());
    ticketQueryApi
      .fetchTicketDetail(pubid)
      .then(data => dispatch(fetchTicketDetailSuccess(data)))
  };
}

export function handleOpenWxModalAndFetchData(pubid) {
  return dispatch => {
    dispatch(openTicketWxModal());
    dispatch(fetchTicketKeySuccess(pubid));
    ticketQueryApi
      .fetchTicketDetail(pubid)
      .then(data => dispatch(fetchTicketWxSuccess(data)));
    couponPublishApi.queryWxBalance().then(({code, msg, data}) => {
        if (parseInt(code) === 200) {
            let coin = parseInt(data.total_coin) / 100;
            dispatch(fetchTicketPaySuccess(coin));
        } else {
            throw new Error(msg);
        }
    });
  };
}

export function handleNeedPay(pubid,couponcount) {
  return dispatch => {
    ticketQueryApi
      .queryWechatCouponPrice(pubid,couponcount)
      .then(data => dispatch(fetchTicketNeedSuccess(data.price)));
  };
}


export function handleOpenShopModalAndFetchData(pubid,querytype,isretailer) {
  return dispatch => {
    dispatch(openTicketShopModal());
    ticketQueryApi
      .fetchTicketShops(pubid,querytype,isretailer)
      .then(data => dispatch(fetchTicketShopsSuccess(data)))
  };
}

export function handleTicketSub(pubid,couponcount) {
  return dispatch => {
    ticketQueryApi
      .exchangeWechatCoupon(pubid,couponcount)
      .then(data => {
        dispatch(ticketWxSub())
      });
  };
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_TICKET_INFO_MODAL:
      return {...state, ticketInfoModalVisible: true};
    case CLOSE_TICKET_INFO_MODAL:
      return {...state, ticketInfoModalVisible: false};
    case OPEN_TICKET_WX_MODAL:
      return {...state, WxticketModalVisible: true};
    case CLOSE_TICKET_WX_MODAL:
      return {...state, WxticketModalVisible: false};
    case OPEN_TICKET_SHOP_MODAL:
      return {...state, ticketShopModalVisible: true,};
    case CLOSE_TICKET_SHOP_MODAL:
      return {...state, ticketShopModalVisible: false};
    case FETCH_TICKET_DETAIL_SUCCESS:
      return {...state, ticketInfo: action.ticketInfo};
    case FETCH_TICKET_WX_SUCCESS:
      return {...state, ticketWx: action.ticketWx};
    case FETCH_TICKET_KEY_SUCCESS:
      return {...state, wxkey: action.wxkey};
    case FETCH_TICKET_PAY_SUCCESS:
      return {...state, totalpay: action.totalpay};
    case FETCH_TICKET_SHOPS_SUCCESS:
      return {...state, shopsInfo: action.shopsInfo};
    case FETCH_TICKET_NEED_SUCCESS:
      return {...state, needpay: action.needpay};
    case FETCH_TICKET_SUB_SUCCESS:
      return {...state, subWx: !state.subWx};
    default:
      return state;
  }
}
