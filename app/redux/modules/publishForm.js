import {fromJS, Map} from 'immutable';
import {COUPON_TYPE} from 'config/constants';
import {couponPublishApi} from 'api';
import {handleFetchTicketQuery} from 'redux/modules/ticketQuery';

const {SINGLE, VOUCHER} = COUPON_TYPE;

const PREFIX = '@@PUBLISH_FORM/';
const SET_COUPON_TYPE = PREFIX + 'SET_COUPON_TYPE';
const SUBMIT_SUCCESS = PREFIX + 'SUBMIT_SUCCESS';
const SUBMIT_FAIL = PREFIX + 'SUBMIT_FAIL';
const OPEN_CONFIRM_MODAL = PREFIX + 'OPEN_CONFIRM_MODAL';
const CLOSE_CONFIRM_MODAL = PREFIX + 'CLOSE_CONFIRM_MODAL';
const SET_SUBMIT_DATA = PREFIX + 'SET_SUBMIT_DATA';
const RESET_FORM = PREFIX + 'RESET_FORM';
const SWITCH_TY_MODE = PREFIX + 'SWITCH_TY_MODE';
const SWITCH_HQ_MODE = PREFIX + 'SWITCH_HQ_MODE';
const SWITCH_KB_MODE = PREFIX + 'SWITCH_KB_MODE';
const SWITCH_WX_MODE = PREFIX + 'SWITCH_WX_MODE';
const SWITCH_WX_CUSTOM_MODE = PREFIX + 'SWITCH_WX_CUSTOM_MODE';
const SWITCH_WX_FRIEND_MODE = PREFIX + 'SWITCH_WX_FRIEND_MODE';
const IS_MY_VIP = PREFIX + 'IS_MY_VIP';
const FETCH_WX_BALANCE = PREFIX + 'FETCH_WX_BALANCE';

export function setCouponType(couponType) {
    return {type: SET_COUPON_TYPE, couponType};
}

function submitSuccess({url, qrcode}) {
    return {type: SUBMIT_SUCCESS, url, qrcode};
}

function submitFail(error) {
    return {type: SUBMIT_FAIL, error};
}

function openConfirmModal() {
    return {type: OPEN_CONFIRM_MODAL};
}

export function closeConfirmModal() {
    return {type: CLOSE_CONFIRM_MODAL};
}

function setSubmitData(submitData) {
    return {type: SET_SUBMIT_DATA, submitData};
}

export function switchMode1() {
    return {type: SWITCH_TY_MODE};
}

export function switchMode2() {
    return {type: SWITCH_HQ_MODE};
}

export function switchMode3() {
    return {type: SWITCH_KB_MODE};
}

export function switchMode4() {
    return {type: SWITCH_WX_MODE};
}

export function switchModeWx1() {
    return {type: SWITCH_WX_CUSTOM_MODE};
}

export function switchModeWx2() {
    return {type: SWITCH_WX_FRIEND_MODE};
}



function isMyVipSwitch(partnerid) {
    return {type: IS_MY_VIP,partnerid};
}

function fetchWxBalance(balance) {
   return {type: FETCH_WX_BALANCE,balance};
}

export function handlefetchWxBalance() {
    return (dispatch, getState) => {
        return couponPublishApi.queryWxBalance().then(({code, msg, data}) => {
            if (parseInt(code) === 200) {
                let coin = parseInt(data.total_coin) / 100;
                dispatch(fetchWxBalance(coin));
            } else {
                throw new Error(msg);
            }
        });
    };
}


export function handleIsMyVip() {
    return (dispatch, getState) => {
        return couponPublishApi.queryIsSubscribe().then(({code, msg, data}) => {
            if (parseInt(code) === 200) {
              if (parseInt(data.isSubscribe) === 0) {
                  // dispatch(isMyVipSwitch("2088421470247531"));
                  let isMyVip = getState().publishForm.get('isMyVip');
              } else if (parseInt(data.isSubscribe) === 1) {
                  dispatch(isMyVipSwitch(data.partner_id));
              }
            } else {
                throw new Error(msg);
            }
        });
    };
}

export function handlePreSubmit(data) {
    return (dispatch, getState) => {
        const {selectMarket, publishForm} = getState();
        // TODO: need to refactor
        const currentMarkets = selectMarket.get('currentMarkets').toJS();
        const market = currentMarkets.reduce((result, item) => [
            ...result,
            ...item.targetKeys
        ], []).map(item => item.split(':')[1]).join(',');
        const saas = currentMarkets.reduce((result, item) => [
            ...result,
            item.saasId
        ], []).join(',');

        const type = publishForm.get('couponType');
        const submitData = {
            ...data,
            market,
            saas,
            type
        };
        dispatch(setSubmitData(submitData));
        dispatch(openConfirmModal());
    };
}

export function handleSubmit() {
    return (dispatch, getState) => {
        let submitData = getState().publishForm.get('submitData');
        if (submitData.get('goodid')) {
            submitData = submitData.update('goodid', obj => obj.value);
        }
        submitData = submitData.toJS();
        dispatch(closeConfirmModal());
        return couponPublishApi.createCoupon(submitData).then(({code, msg, data}) => {
            if (parseInt(code) === 200) {
                dispatch(submitSuccess(data));
                dispatch(handleFetchTicketQuery()); // 添加成功后，重新拉取券列表
                return msg;
            } else {
                submitFail(msg);
                throw new Error(msg);
            }
        });
    };
}

const initialState = fromJS({
    couponType: -1,
    url: '',
    qrCode: null,
    confirmModalVisible: false,
    submitData: {},
    isSelectMode: 0,
    isWxMode: 0,
    isMyVip: false,
    partnerId: '',
    balance: '--',
});

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_COUPON_TYPE:
            return state.set('couponType', action.couponType);
        case SUBMIT_SUCCESS:
            return state.set('url', action.url).set('qrcode', action.qrcode);
        case SUBMIT_FAIL:
            return state.set('error', action.error);
        case OPEN_CONFIRM_MODAL:
            return state.set('confirmModalVisible', true);
        case CLOSE_CONFIRM_MODAL:
            return state.set('confirmModalVisible', false);
        case SET_SUBMIT_DATA:
            return state.set('submitData', Map(action.submitData));
        case SWITCH_TY_MODE:
            return state.set('isSelectMode', 0);
        case SWITCH_HQ_MODE:
            return state.set('isSelectMode', 1);
        case SWITCH_KB_MODE:
            return state.set('isSelectMode', 2);
        case SWITCH_WX_MODE:
            return state.set('isSelectMode', 3);
        case SWITCH_WX_CUSTOM_MODE:
            return state.set('isWxMode', 0);
        case SWITCH_WX_FRIEND_MODE:
            return state.set('isWxMode', 1);
        case IS_MY_VIP:
            return state.set('isMyVip', true).set('partnerId',action.partnerid);
        case FETCH_WX_BALANCE:
            return state.set('balance',action.balance)
        default:
            return state;
    }
}
