import React, { PropTypes, Component } from 'react';
import { message } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as tabActionCreators from 'redux/modules/tab';
import { USER_TYPE } from 'config/constants';

import { Main } from 'components/admin';

@connect(
  ({auth, tab, menu}) => ({
    userType: auth.userType,
    nav: menu.nav,
    tabKey: tab.get('tabKey'),
  }),
  dispatch => bindActionCreators(tabActionCreators, dispatch),
)
export default class MainContainer extends Component {
  static propTypes = {
    userType: PropTypes.number.isRequired,
    tabKey: PropTypes.string.isRequired,
    nav: PropTypes.array.isRequired,
    setTab: PropTypes.func.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  componentDidMount() {
    // 对antd class的一些样式覆盖
    const style = document.createElement('style');
    style.innerHTML = `
      .ant-tabs-bar {
        margin-bottom: 0;
      }
    `;
    document.getElementsByTagName('head')[0].appendChild(style);
  }
  handleTabChange(tabKey) {
    const { userType, setTab } = this.props;
    setTab(tabKey);
    this.changeUrl(tabKey, userType);
  }
  changeUrl(tabKey, userType) {
    const { router } = this.context;
    switch (tabKey) {
      case 'home': router.replaceWith('/admin'); break;
      case 'coupon': router.replaceWith('/admin/coupon/publish'); break;
      case 'manage': router.replaceWith('/admin/manage/product'); break;
      case 'live': router.replaceWith('/admin/live/realData'); break;
      case 'analysis': {
        if (userType === USER_TYPE.RETAILER.value) {
          router.replaceWith('/admin/analysis/productUsed');
        } else {
          router.replaceWith('/admin/analysis/dashboard');
        }
        break;
      }
      default: message.error('has error in router');
    }
  }
  render() {
    return (
      <Main {...this.props}
        onTabChange={::this.handleTabChange}/>
    );
  }
}
