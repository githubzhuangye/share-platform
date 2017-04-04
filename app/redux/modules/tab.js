import { fromJS } from 'immutable';

const PREFIX = '@@TAB/';
const SET_TAB = PREFIX + 'SET_TAB';

export function setTab(tabKey) {
  return {
    type: SET_TAB,
    tabKey,
  };
}

const initialState = fromJS({
  tabKey: 'home',
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_TAB:
      return state.set('tabKey', action.tabKey);
    default:
      return state;
  }
}