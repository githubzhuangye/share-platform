import { updateArray } from 'helpers/util';
import { commonApi } from 'api';

const PREFIX = '@@HOMEMESG_BOX/';
const FETCH_HOMEMESG_SUCCESS = PREFIX + 'FETCH_HOMEMESG_SUCCESS';
const SET_HOMECONTENT = PREFIX + 'SET_HOMECONTENT';

function fetchMessageSuccess(messageList) {
  return {
    type: FETCH_HOMEMESG_SUCCESS,
    messageList
  };
}

function setContent(content) {
  return {
    type: SET_HOMECONTENT,
    content
  };
}

export function handleFetchHomeMesg() {
  return dispatch => {
    commonApi
      .fetchHomeMessage()
      .then(({messageList}) => {
        dispatch(fetchMessageSuccess(messageList));
      });
  };
}

const initailState = {
  messageList: [],
  content: ''
};

export default function reducer(state = initailState, action) {
  switch (action.type) {
    case FETCH_HOMEMESG_SUCCESS:
      return {...state, messageList: action.messageList};
    case SET_HOMECONTENT:
      return {...state, content: action.content};
    default:
      return state;
  }
}
