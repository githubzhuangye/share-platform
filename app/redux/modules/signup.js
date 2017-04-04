import { USER_TYPE } from 'config/constants';
import { signupApi } from 'api';
import { message } from 'antd';

const PREFIX = '@@SIGNUP/';
const NEXT_STEP = PREFIX + 'NEXT_STEP';
const PRE_STEP = PREFIX + 'PRE_STEP';
const ADD_FORM_DATA = PREFIX + 'ADD_FORM_DATA';
const SET_USER_TYPE = PREFIX + 'SET_USER_TYPE';
const RESET_STATE = PREFIX + 'RESET_STATE';

export function nextStep() {
  return {
    type: NEXT_STEP
  };
}

export function preStep() {
  return {
    type: PRE_STEP
  };
}

export function addFormData(data) {
  return {
    type: ADD_FORM_DATA,
    data
  };
}

export function setUserType(userType) {
  return {
    type: SET_USER_TYPE,
    userType
  };
}

export function addFormDataAndGoNext(data) {
  return dispatch => {
    dispatch(addFormData(data));
    dispatch(nextStep())
  }
}

export function submitData() {
  return (dispatch, getState) => {
    const { formData, userType } = getState().signup;
    signupApi.submit({...formData, userType})
      .then(data => {
        if (+data.result === 200) {
          dispatch(nextStep());
        } else {
          message.error(data.msg);
        }
      })
      .catch(err => message.error(err.message));
  }
}

export function resetState() {
  return {
    type: RESET_STATE
  };
}

const initialState = {
  step: 0,
  userType: -1,
  formData: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case NEXT_STEP:
      return {...state, step: state.step + 1};
    case PRE_STEP:
      return {...state, step: state.step - 1};
    case ADD_FORM_DATA:
      return {...state, formData: {...state.formData, ...action.data}};
    case SET_USER_TYPE:
      return {...state, userType: action.userType};
    case RESET_STATE:
      return {...initialState};
    default:
      return state;
  }
}
