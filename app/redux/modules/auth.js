import {authApi} from 'api';
import {setBrandlerNav, setRetailerNav} from './menu';
import {USER_TYPE} from 'config/constants';
import {runTimer as runTimoutTimer} from 'helpers/timeout';
import {setCouponType} from 'redux/modules/publishForm';

const PREFIX = '@@AUTH/';
export const AUTH_SUCCESS = PREFIX + 'AUTH_SUCCESS';
const AUTH_FAIL = PREFIX + 'AUTH_FAIL';
const CLEAR_ERROR = PREFIX + 'CLEAR_ERROR';
const FETCH_SAAS_LIST_SUCCESS = PREFIX + 'FETCH_SAAS_LIST_SUCCESS';
const LOGOUT_SUCCESS = PREFIX + 'LOGOUT_SUCCESS';
const SET_USERNAME = PREFIX + 'SET_USERNAME';
const SET_SAAS_LOGO = PREFIX + 'SET_SAAS_LOGO';

export function setUsername(username) {
    return {type: SET_USERNAME, username};
}

export function setSaasLogo(saasLogo) {
    return {type: SET_SAAS_LOGO, saasLogo};
}

function authSuccess(username, userType, accountId, saasLogo, saasId, business) {
    return {
        type: AUTH_SUCCESS,
        username,
        accountId,
        userType,
        saasLogo,
        saasId,
        business
    };
}

function authFail(error) {
    return {type: AUTH_FAIL, error};
}

export function clearError() {
    return {type: CLEAR_ERROR};
}

function fetchSaaslistSuccess(saaslist) {
    return {type: FETCH_SAAS_LIST_SUCCESS, saaslist};
}

function logoutSuccess() {
    return {type: LOGOUT_SUCCESS};
}

export function handleAuth(data) {
    return dispatch => {
        return authApi.auth(data).then(({
            username,
            type,
            accountId,
            saasLogo,
            saasId,
            business
        }) => {
            dispatch(authSuccess(username, type, accountId, saasLogo, saasId, business));
            if (business.length) {
                dispatch(setCouponType(parseInt(business[0].type)));
            }
            return type;
        }).then(type => {
            if (+ type === USER_TYPE.BRANDLER.value) {
                dispatch(setBrandlerNav());
            } else if (+ type === USER_TYPE.RETAILER.value) {
                dispatch(setRetailerNav());
            }
            runTimoutTimer(); // 用户登陆后开启自动退出定时器
            return {type: AUTH_SUCCESS};
        }).catch(error => dispatch(authFail(error.message)));
    };
}

export function handleFetchSaaslist() {
    return dispatch => {
        authApi.fetchSaaslist().then(saaslist => dispatch(fetchSaaslistSuccess(saaslist)));
    };
}

export function handleLogout() {
    return dispatch => {
        return authApi.logout().then(() => dispatch(logoutSuccess()))
    };
}

const initialState = {
    error: '',
    username: '',
    accountId: '',
    userType: -1,
    saasLogo: '',
    saasId: '',
    saaslist: [],
    business: [] //券类型business
};

export default function reducer(state = initialState, action) {
    state = state || {
        error: '',
        username: '',
        accountId: '',
        userType: -1,
        saasLogo: '',
        saaslist: [],
        business: []
    }; // react-router@4 problem, i don't know why this happen
    switch (action.type) {
        case AUTH_SUCCESS:
            return {
                ...state,
                username: action.username,
                userType: parseInt(action.userType),
                accountId: action.accountId,
                saasLogo: action.saasLogo,
                saasId: action.saasId,
                business: action.business
            };
        case AUTH_FAIL:
            return {
                ...state,
                error: action.error
            };
        case CLEAR_ERROR:
            return {
                ...state,
                error: ''
            };
        case FETCH_SAAS_LIST_SUCCESS:
            return {
                ...state,
                saaslist: action.saaslist
            };
        case LOGOUT_SUCCESS:
            return {
                ...initialState
            };
        case SET_USERNAME:
            return {
                ...state,
                username: action.username
            };
        case SET_SAAS_LOGO:
            return {
                ...state,
                saasLogo: action.saasLogo
            };
        default:
            return state;
    }
}
