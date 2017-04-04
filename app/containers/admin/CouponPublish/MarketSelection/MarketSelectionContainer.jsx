import React, { PropTypes } from 'react';
import { List, Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MarketSelection } from 'components/admin/CouponPublish';
import * as commonActionCreators from 'redux/modules/common';
import * as selectMarketActionCreators from 'redux/modules/selectMarket';

@connect(
  ({common, selectMarket, auth}) => ({
    saasList: common.get('saasList').toArray(),
    provinceAndCity: common.get('provinceAndCity').toArray(),
    visible: selectMarket.get('modalVisible'),
    nextMarkets: selectMarket.get('nextMarkets').toJS(),
    userType: auth.userType
  }),
  dispatch => bindActionCreators({...commonActionCreators, ...selectMarketActionCreators}, dispatch)
)
class MarketSelectionContainer extends React.Component {
  static propTypes = {
    provinceAndCity: PropTypes.array.isRequired,
    saasList: PropTypes.array.isRequired,
    nextMarkets: PropTypes.array.isRequired,
    visible: PropTypes.bool.isRequired,
    userType: PropTypes.number.isRequired,
    handleFetchSaasList: PropTypes.func.isRequired,
    handleSaasChange: PropTypes.func.isRequired,
    handleRegionChange: PropTypes.func.isRequired,
    setNextTargetKeys: PropTypes.func.isRequired,
    handleConfirmModal: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    addSaas: PropTypes.func.isRequired,
    removeSaas: PropTypes.func.isRequired,
    handleFetchProvinceAndCity: PropTypes.func.isRequired,
  }
  componentDidMount() {
    const { handleFetchSaasList, handleFetchProvinceAndCity } = this.props;
    handleFetchSaasList();
    handleFetchProvinceAndCity();
  }
  handleCancel() {
    this.props.closeModal();
  }
  handleOk() {
    this.props.handleConfirmModal();
  }
  render () {
    const { visible, saasList, provinceAndCity, userType, nextMarkets, handleRegionChange, handleSaasChange,
      addSaas, removeSaas, setNextTargetKeys, isSelectMode, isMyVip } = this.props;
    return (
      <MarketSelection
        provinceAndCity={provinceAndCity}
        visible={visible}
        saasList={saasList}
        userType={userType}
        isSelectMode={isSelectMode}
        isMyVip={isMyVip}
        nextMarkets={nextMarkets}
        onRegionChange={handleRegionChange}
        onSaasIdChange={handleSaasChange}
        onMarketChange={setNextTargetKeys}
        onAddSaasBtnClick={addSaas}
        onRemoveSaasBtnClick={removeSaas}
        onCancel={::this.handleCancel}
        onOk={::this.handleOk}/>
    );
  }
}

export default MarketSelectionContainer;
