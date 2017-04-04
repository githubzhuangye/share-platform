import React from 'react';
import AsyncComponent from './AsyncComponent';
import scheduleLoad from 'helpers/loader';

const loader = (cb) => {
  require.ensure([], (require) => {
    cb(require('containers/admin/Admin/AdminContainer'));
  });
}

// scheduleLoad(loader);

export default (props) => <AsyncComponent {...props} loader={loader}/>
