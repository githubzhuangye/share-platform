import React, { PropTypes } from 'react';
import { MarketManage } from 'components/admin';
import { cardable } from 'hoc';

@cardable(['门店管理'])
class MarketManageContainer extends React.Component {
  render () {
    return (
      <MarketManage/>
    );
  }
}

export default MarketManageContainer;
