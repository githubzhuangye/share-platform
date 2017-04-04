import React, { PropTypes, Component } from 'react';
import { Card, Button, Icon } from 'antd';
import * as styles from './style.css';
import { breadcrumbTitle } from 'helpers/util';
import { NAV } from 'config/constants';

import { MarketTableContainer, MarketQueryFormContainer } from 'containers/admin/MarketManage';

const { MANAGE } = NAV;

export default class MarketManage extends Component {
  render() {
    return (
      <div>
        <div className={styles.queryForm}>
          <MarketQueryFormContainer/>
        </div>
        <MarketTableContainer/>
      </div>
    );
  }
}
