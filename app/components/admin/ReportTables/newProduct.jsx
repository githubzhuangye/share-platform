import React, { PropTypes, Component } from 'react';
import { Form, Select, Row, Col, DatePicker } from 'antd';

import { cardable } from 'hoc';
import { FORM_ITEM_LAYOUT, host } from 'config/constants';

@cardable(['新商品'])

export default class newProduct extends Component {
  render() {
    return (
      <div>
        <p>新商品</p>
      </div>
    );
  }
}
