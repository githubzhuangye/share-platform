import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as publishFormActionCreators from 'redux/modules/publishForm';
import {handleClearMarket} from 'redux/modules/selectMarket';
import { filterHQBusiness } from 'helpers/util';

import { UserIdentity } from 'components/admin/CouponPublish';

@connect(
  ({auth, publishForm, selectMarket}, ownProps) => ({
    userType: auth.userType,
    business: auth.business,
    couponType: publishForm.get('couponType'),
    isSelectMode: publishForm.get('isSelectMode'),
    isWxMode: publishForm.get('isWxMode'),
    isMyVip: publishForm.get('isMyVip'),
    partnerId: publishForm.get('partnerId'),
    balance: publishForm.get('balance'),
    selectedMarketList: selectMarket.get('currentMarkets').toJS(),
    ...ownProps,
  }),
  dispatch => bindActionCreators({...publishFormActionCreators,handleClearMarket}, dispatch)
)

export default class UserIdentityContainer extends Component {
  static propTypes = {
    isEdit: PropTypes.bool.isRequired,
    userType: PropTypes.number.isRequired,
    couponType: PropTypes.number.isRequired,
    isSelectMode: PropTypes.number.isRequired,
    isMyVip: PropTypes.bool.isRequired,
    partnerId: PropTypes.string.isRequired,
    business: PropTypes.array.isRequired,
    switchMode1: PropTypes.func.isRequired,
    switchMode2: PropTypes.func.isRequired,
    switchMode3: PropTypes.func.isRequired,
    handleClearMarket: PropTypes.func.isRequired,
    handleIsMyVip: PropTypes.func.isRequired,
    setCouponType: PropTypes.func.isRequired,
  }
  handleModeChange(e) {
    const Val = e.target.value;
    const { business, switchMode1, switchMode2, switchMode3, switchMode4, setCouponType, isMyVip, handleIsMyVip,handleClearMarket } = this.props;
    if (Val === 0) {
        switchMode1();
    } else if (Val === 1) {
        switchMode2();
    } else if (Val === 2) {
        switchMode3();
        // handleIsMyVip();
    } else if (Val === 3) {
        switchMode4();
        // handleIsMyVip();
    }
    setCouponType(+business[0].type);
    handleClearMarket();
  }

  handleMxModeChange(e){
    const Val = e.target.value;
    const {switchModeWx1,switchModeWx2,setCouponType,business, handleClearMarket,handlefetchWxBalance} = this.props;
    if (Val === 0) {
        switchModeWx1();
    } else {
        switchModeWx2();
    }
    setCouponType(+business[0].type);
    handleClearMarket();
  }

  render() {

    return (
      <UserIdentity
        {...this.props}
        hQBusiness={filterHQBusiness(this.props.business)}
        onModeChange={::this.handleModeChange}
        onWxModeChange={::this.handleMxModeChange}
        />
    );
  }
}
