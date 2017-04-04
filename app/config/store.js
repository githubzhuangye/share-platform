import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import * as reducers from 'redux/modules';

export const RESET = '@@ALL/RESET';

function addResetToReducers(reducers) {
  return Object
    .keys(reducers)
    .reduce((result, name) => {
      const originReducer = reducers[name];
      const newReducer = function(state, action) {
        if (action.type === RESET) {
          return originReducer(undefined, action);
        } else {
          return originReducer(state, action);
        }
      };
      result[name] = newReducer;
      return result;
    }, {});
}

const resetableReducers = addResetToReducers(reducers);
export default createStore(combineReducers(resetableReducers), compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));
