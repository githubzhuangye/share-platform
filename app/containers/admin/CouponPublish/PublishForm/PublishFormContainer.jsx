import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { List } from 'immutable';
import { PublishForm } from 'components/admin/CouponPublish';
import * as couponTypeActionCreators from 'redux/modules/publishForm';
import * as selectMarketActionCreators from 'redux/modules/selectMarket';

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
  dispatch => bindActionCreators({...couponTypeActionCreators, ...selectMarketActionCreators}, dispatch)
)
export default class PublishFormContainer extends Component {
  static propTypes = {
    userType: PropTypes.number.isRequired,
    business: PropTypes.array.isRequired,
    couponType: PropTypes.number.isRequired,
    isSelectMode: PropTypes.number.isRequired,
    selectedMarketList: PropTypes.array.isRequired,
    setCouponType: PropTypes.func.isRequired,
    handleOpenModal: PropTypes.func.isRequired,
    handlePreSubmit: PropTypes.func.isRequired,
    handleIsMyVip: PropTypes.func.isRequired,
    resetMarkets: PropTypes.func.isRequired,
    isMyVip: PropTypes.bool.isRequired,
    partnerId: PropTypes.string.isRequired,
    params: PropTypes.object,
  }
  handleCouponTypeChange(value) {
    this.props.setCouponType(value);
  }
  handleMarketClick() {
    this.props.handleOpenModal();
  }
  handleSubmit(data) {
    this.props.handlePreSubmit(data);
  }
  handleMyVip(){
    this.props.handleIsMyVip();
  }
  handWxBalance(){
    this.props.handlefetchWxBalance();
  }

  componentWillMount(){
      this.handleMyVip();
      this.handWxBalance();
  }

  render() {
    const { userType, couponType, selectedMarketList, resetMarkets, business, isSelectMode, isMyVip, partnerId, handleMyVip, isWxMode } = this.props;
    return (
      <PublishForm {...this.props}
        userType={userType}
        handleMyVip={handleMyVip}
        business={business}
        couponType={couponType}
        isSelectMode={isSelectMode}
        isMyVip={isMyVip}
        isWxMode={isWxMode}
        partnerId={partnerId}
        selectedMarketList={List(selectedMarketList.reduce((result, item) => [...result, ...item.targetKeys], []))}
        onMarketClick={::this.handleMarketClick}
        onCouponTypeChange={::this.handleCouponTypeChange}
        onSubmit={::this.handleSubmit}
        resetMarkets={resetMarkets}/>
    );
  }
}
