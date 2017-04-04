import React, { PropTypes } from 'react';
import { BrowserRouter, HashRouter, Match, Redirect } from 'react-router';
import store from 'config/store';
import { handleAuth, AUTH_SUCCESS } from 'redux/modules/auth';
import { navigateTo } from 'helpers/util';

import { Home, FindPsw } from 'components/home';
import { SignupAsync, AdminAsync } from 'components/async';

export default function getRoutes(checkAuth) {
  return (
    <HashRouter>
      <div>
        <Match exactly pattern="/" component={Home}/>
        <Match pattern="/signup" component={SignupAsync}/>
        <Match pattern="/findpsd" component={FindPsw}/>
        <MatchWhenAuthorized pattern="/admin" component={AdminAsync}/>
      </div>
    </HashRouter>
  );
}

const MatchWhenAuthorized = ({ component: Component, ...rest }, { router }) => (
  <Match {...rest} render={props => (
    isAuthed(store, router, props) ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/',
        state: { from: props.location }
      }}/>
    )
  )}/>
);

MatchWhenAuthorized.contextTypes = {
  router: PropTypes.object.isRequired,
};

function isAuthed(store, router, props) {
  const username = store.getState().auth.username;
  if (!username) { // 用户未登录
    if (!window.env) { //如果是开发环境的话，就mock登陆
      store
      .dispatch(handleAuth({accountId: 'zhy', pwd: '666666'}))
      // .dispatch(handleAuth({accountId: 'dns', pwd: '666666'}))
      // .dispatch(handleAuth({accountId: 'kkkl', pwd: '666666'}))
      .then(({type}) => {
        if (type === AUTH_SUCCESS) {
          navigateTo(props.location.pathname, router);
        }
      });
    }
    return false;
  } else {
    return true;
  }
}
