import React from 'react';
import { Modal } from 'antd';
import { fromJS } from 'immutable';
import moment from 'moment';
import { ticketQueryApi, userManageApi } from 'api';

const PREFIX = '@@COUPON_ASSIGNMENT/';
const OPEN_ASSIGN_MODAL = PREFIX + 'OPEN_ASSIGN_MODAL';
const CLOSE_ASSIGN_MODAL = PREFIX + 'CLOSE_ASSIGN_MODAL';
const SET_COUPON_ID = PREFIX + 'SET_COUPON_ID';
const SET_COUPON_COUNT = PREFIX + 'SET_COUPON_COUNT';
const SET_COUPON_INFO = PREFIX + 'SET_COUPON_INFO';
const SET_COUPON_PHONE = PREFIX + 'SET_COUPON_PHONE';
const ADD_COUPON = PREFIX + 'ADD_COUPON';
const REMOVE_COUPON = PREFIX + 'REMOVE_COUPON';
const RESET_ASSIGN = PREFIX + 'RESET_ASSIGN';
const SET_COUPON_PHONE_ERROR = PREFIX + 'SET_COUPON_PHONE_ERROR';
const SET_COUPON_ITEM_ERROR = PREFIX + 'SET_COUPON_ITEM_ERROR';

export function openAssignModal() {
  return {
    type: OPEN_ASSIGN_MODAL,
  };
}

function closeAssignModal() {
  return {
    type: CLOSE_ASSIGN_MODAL,
  };
}

function setCouponId(couponId, index) {
  return {
    type: SET_COUPON_ID,
    couponId,
    index,
  };
}

export function setCouponCount(couponCount, index) {
  return {
    type: SET_COUPON_COUNT,
    couponCount,
    index,
  };
}

export function setCouponPhone(couponPhone) {
  return {
    type: SET_COUPON_PHONE,
    couponPhone,
  };
}

export function setCouponInfo(couponInfo, index) {
  return {
    type: SET_COUPON_INFO,
    couponInfo,
    index,
  };
}

export function addCoupon() {
  return {
    type: ADD_COUPON,
  };
}

export function removeCoupon(index) {
  return {
    type: REMOVE_COUPON,
    index,
  };
}

function setCouponPhoneError(error) {
  return {
    type: SET_COUPON_PHONE_ERROR,
    error,
  };
}

function setCouponItemError(error, index) {
  return {
    type: SET_COUPON_ITEM_ERROR,
    error,
    index,
  };
}

function resetAssign() {
  return {
    type: RESET_ASSIGN,
  };
}

// 关闭modal并清空数据
export function handleCloseAssignModal() {
  return dispatch => {
    dispatch(closeAssignModal());
    dispatch(resetAssign());
  };
}

// 发送数据给后台，并关闭modal
export function handleConfirm() {
  return (dispatch, getState) => {
    const couponAssignment = getState().couponAssignment;

    // validate
    const phone = couponAssignment.get('phone');
    let coupons = couponAssignment.get('coupons');
    let phoneError, couponErrors = [];
    if (phone.length === 0) {
      phoneError = '用户id不能为空';
    }
    coupons.forEach((coupon, index) => {
      if (!coupon.get('info')) {
        couponErrors[index] = '券过期或者不存在，请从下拉列表中选择券';
      }
      if (coupon.get('count') <= 0) {
        couponErrors[index] = couponErrors[index] ? couponErrors[index] + '， 券数量有误' : '券数量有误';
      }
    });

    // 如果验证有误，就提前退出
    if (phoneError || couponErrors.length > 0) {
      dispatch(setCouponPhoneError(phoneError || ''));
      couponErrors.forEach((error, index) => dispatch(setCouponItemError(error, index)));
      return;
    }

    // 通过验证，向后台发送数据，并关闭对话框，然后展示添加成功的数据
    coupons = coupons
      .map(item => ({pubid: item.get('id').split(':')[0], count: item.get('count')}))
      .toArray();
    const formData = {coupons: JSON.stringify(coupons), openid: couponAssignment.get('phone')};
    const findCoupon = couponId => couponAssignment
      .get('coupons')
      .find(coupon => coupon.get('id').split(':')[0] === couponId);
    userManageApi.couponAssign(formData)
      .then(data => data.map(item => ({
        count: item.count,
        originCount: findCoupon(item.pubid).get('count'),
        name: findCoupon(item.pubid).getIn(['info', 'name']),
      })))
      .then(data => {
        dispatch(handleCloseAssignModal());
        return data;
      })
      .then(data => {
        Modal.success({
          title: '成功添加的券如下：',
          width: '600px',
          content: (
            <div>
              {data.map((i, index) => <p key={index}>{i.name}：指定发送数量{i.originCount}张, 实际发送数量{i.count}张</p>)}
            </div>
          )
        });
      });
  };
}

// couponId改变时，请求该couponId对应的信息
export function handleCouponIdChange(couponId, index, isSelect) {
  return dispatch => {
    dispatch(setCouponId(couponId, index));

    // 如果值改变不是由于被选中，就清空之前的couponInfo
    if (!isSelect) {
      dispatch(setCouponInfo(null, index));
      return;
    }

    // 从下拉框中选中了某个值
    if (couponId) {
      const pubid = couponId.split(':')[0];
      ticketQueryApi.fetchTicketDetail(pubid)
        .then(data => ({
          name: data.couponname,
          price: data.couponfee / 100,
          date: `${moment(data.starttime).format('YYYY-MM-DD')}至${moment(data.endtime).format('YYYY-MM-DD')}`,
        }))
        .then(data => dispatch(setCouponInfo(data, index)));
    }

  };
}

const couponItem = {
  id: undefined,
  count: 1,
  info: null,
  error: null,
};

const initialState = fromJS({
  modalVisible: false,
  phone: '',
  phoneError: '',
  coupons: [couponItem],
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_ASSIGN_MODAL:
      return state.set('modalVisible', true);
    case CLOSE_ASSIGN_MODAL:
      return state.set('modalVisible', false);
    case SET_COUPON_ID:
      return state
        .setIn(['coupons', action.index, 'id'], action.couponId)
        .setIn(['coupons', action.index, 'error'], '');
    case SET_COUPON_COUNT:
      return state
        .setIn(['coupons', action.index, 'count'], action.couponCount)
        .setIn(['coupons', action.index, 'error'], '');
    case SET_COUPON_INFO:
      return state.setIn(['coupons', action.index, 'info'], fromJS(action.couponInfo));
    case SET_COUPON_ITEM_ERROR:
      return state.setIn(['coupons', action.index, 'error'], action.error);
    case SET_COUPON_PHONE:
      return state
        .set('phone', action.couponPhone)
        .set('phoneError', '');
    case SET_COUPON_PHONE_ERROR:
      return state.set('phoneError', action.error);
    case ADD_COUPON:
      return state.update('coupons', coupons => coupons.insert(coupons.size, fromJS(couponItem)));
    case REMOVE_COUPON:
      return state.update('coupons', coupons => coupons.remove(action.index));
    case RESET_ASSIGN:
      return fromJS(initialState);
    default:
      return state;
  }
}
