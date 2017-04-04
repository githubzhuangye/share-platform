import { updateArray } from 'helpers/util';
import { commonApi } from 'api';

const PREFIX = '@@MESSAGE_BOX/';
const OPEN_MODAL = PREFIX + 'OPEN_MODAL';
const CLOSE_MODAL = PREFIX + 'CLOSE_MODAL';
const FETCH_MESSAGE_SUCCESS = PREFIX + 'FETCH_MESSAGE_SUCCESS';
const SET_ACTIVE_TITLE_INDEX = PREFIX + 'SET_ACTIVE_TITLE_INDEX';
const SET_MESSAGE_READ = PREFIX + 'SET_MESSAGE_READ';
const SET_CONTENT = PREFIX + 'SET_CONTENT';
const SET_UNREAD = PREFIX + 'SET_UNREAD';

export function openModal() {
  return {
    type: OPEN_MODAL
  };
}

export function closeModal() {
  return {
    type: CLOSE_MODAL
  };
}

function fetchMessageSuccess(messageList) {
  return {
    type: FETCH_MESSAGE_SUCCESS,
    messageList
  };
}

function setActiveTitleIndex(activeTitleIndex) {
  return {
    type: SET_ACTIVE_TITLE_INDEX,
    activeTitleIndex
  };
}

function setMessageRead(index) {
  return {
    type: SET_MESSAGE_READ,
    index
  };
}

function setContent(content) {
  return {
    type: SET_CONTENT,
    content
  };
}

function setUnread(unread) {
  return {
    type: SET_UNREAD,
    unread
  };
}

export function handleFetchMessage() {
  return dispatch => {
    commonApi
      .fetchMessage()
      .then(({unread, messageList}) => {
        dispatch(setUnread(unread));
        dispatch(fetchMessageSuccess(messageList));
      });
  };
}

export function handleTitleClick(index) {
  return (dispatch, getState) => {
    const { messageList, unread } = getState().messageBox;
    const curMessage = messageList[index];
    if (!curMessage.isRead) {
      // TODO: api request
      dispatch(setMessageRead(index));
      dispatch(setUnread(unread - 1));
    }
    dispatch(setActiveTitleIndex(index));
    dispatch(setContent(curMessage.content));
  };
}

const initailState = {
  modalVisible: false,
  messageList: [],
  activeTitleIndex: -1,
  content: '',
  unread: 0
};

export default function reducer(state = initailState, action) {
  switch (action.type) {
    case OPEN_MODAL:
      return {...state, modalVisible: true};
    case CLOSE_MODAL:
      return {...state, modalVisible: false};
    case FETCH_MESSAGE_SUCCESS:
      return {...state, messageList: action.messageList};
    case SET_ACTIVE_TITLE_INDEX:
      return {...state, activeTitleIndex: action.activeTitleIndex};
    case SET_MESSAGE_READ:
      return {...state, messageList: updateArray(state.messageList, action.index, {isRead: true})};
    case SET_CONTENT:
      return {...state, content: action.content};
    case SET_UNREAD:
      return {...state, unread: action.unread};
    default:
      return state;
  }
}
