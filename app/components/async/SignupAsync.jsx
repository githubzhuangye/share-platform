import React from 'react';
import AsyncComponent from './AsyncComponent.jsx';
import scheduleLoad from 'helpers/loader';

const loader = (cb) => {
  require.ensure([], require => {
    cb(require('containers/home/Signup/SignupContainer'));
  });
};

scheduleLoad(loader);

export default (props) => <AsyncComponent {...props} loader={loader}/>;
