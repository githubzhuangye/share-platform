import React, { PropTypes, Component } from 'react';
import { Q_MODE } from '../QModeSelection/QModeSelection';
import { USER_TYPE, COUPON_TYPE } from 'config/constants';

const { DING_XIANG, QIANG_DAN } = Q_MODE;
const { RETAILER } = USER_TYPE;
const { SINGLE, BRAND } = COUPON_TYPE;

export default Component => class extends Component {
  state = {
    isSelectMode: 0,    // 记录当前是否为会抢模式
  }
  handleHQModeChange() {
    this.setState({isSelectMode: 0});
  }
  render() {
    const props = {...this.props,
      isSelectMode: this.state.isSelectMode,
      onHQModeChange: ::this.handleHQModeChange,
    };
    return <Component {...props}/>;
  }
}
