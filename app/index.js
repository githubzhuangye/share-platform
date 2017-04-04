import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { message } from 'antd';
import 'sharedStyles/global.css'; // css global config

import getRoutes from 'config/routes';
import store from 'config/store.js';
import 'helpers/timeout';         // 监听用户的行为，长时间未操作会使用户退出

// antd global config
message.config({
  top: 240,
});

render(
  <Provider store={store}>
    {getRoutes()}
  </Provider>,
  document.getElementById('root')
);
