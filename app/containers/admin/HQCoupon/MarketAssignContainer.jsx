import React, { PropTypes, Component } from 'react';
import { message } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as selectMarketActionCreators from 'redux/modules/selectMarket';
import { hqCouponApi } from 'api';
import { diffMarkets } from 'helpers/util';

import { MarketAssign } from 'components/admin/HQCoupon';

// 提取门店信息的helper函数
/*
  用于将marketKeys中的城市的key提取出来
  markets : ['1:1', '1:2', '2:3']
  allMarketsInfo : [{key: '1:1', title: 'x'}, {key: '1:2', title: 'y'}, {key: '2:3', title: 'z'}]
  selectedRegion: ['1-shanxi', '2-taiyuan']
*/
function getCityMarketPair(markets, allMarketsInfo, selectedRegion) {
  const cityMarketMap = markets.reduce((result, market) => {
    const marketName = allMarketsInfo.find(i => i.key === market).title;
    const [ regionKey ] = market.split(':');
    if (result[regionKey]) {
      result[regionKey].push(marketName);
    } else {
      result[regionKey] = [marketName];
    }
    return result;
  }, {});
  const result = [];
  for (let key in cityMarketMap) {
    const cityName = selectedRegion.find(i => i.split('-')[0] === key).split('-')[1];
    result.push({cityName, marketNames: cityMarketMap[key]});
  }
  return result;
}

@connect(
  ({selectMarket, auth}, ownProps) => ({
    marketInfo: selectMarket.get('currentMarkets').toJS()[0],
    saasId: auth.saasId,
    mode: ownProps.mode,
    params: ownProps.params,
    couponInfo: ownProps.couponInfo,
    onMarketAssigned: ownProps.onMarketAssigned,
  }),
  dispatch => bindActionCreators(selectMarketActionCreators, dispatch)
)
export default class MarketAssignContainer extends Component {
  static propTypes = {
    mode: PropTypes.string.isRequired,
    saasId: PropTypes.string.isRequired,
    couponInfo: PropTypes.object.isRequired,
    marketInfo: PropTypes.object.isRequired,
    openModal: PropTypes.func.isRequired,
    setSaasId: PropTypes.func.isRequired,
    setAllRegion: PropTypes.func.isRequired,
    handleOpenModal: PropTypes.func.isRequired,
    resetMarkets: PropTypes.func.isRequired,
    onMarketAssigned: PropTypes.func,
  }
  static contextTypes = {
    history: PropTypes.object.isRequired,
  }
  state = {
    oldMarkets: [],
    loading: false,
  }
  async componentDidMount() {
    const { setSaasId, setAllRegion, params, saasId, mode,
      setSelectedRegion, setNextDataSource, setNextTargetKeys, replaceCurrentMarketsWithNext } = this.props;
    const pubId = params.id;
    setSaasId(saasId, 0);
    this.setState({loading: true});

    try {
      // 获取可投放的城市列表
      const provinceAndCity = await hqCouponApi.fetchProvinceAndCity(pubId, saasId);
      setAllRegion(provinceAndCity, 0);

      // 获取投放过的门店信息
      const {selectedCity, market, selectedMarket} = await hqCouponApi.fetchAssignedMarketInfo(pubId);
      setSelectedRegion(selectedCity.map(city => `${city.code}-${city.name}`), 0);
      setNextDataSource(market.map(item => ({key: `${item.citycode}:${item.id}`, title: item.marketname})), 0);
      setNextTargetKeys(selectedMarket.map(item => `${item.citycode}:${item.id}`), 0);

      this.setState({oldMarkets: selectedMarket.map(item => `${item.citycode}:${item.id}`)});
    } catch(e) {
      console.warn(e);
    }

    replaceCurrentMarketsWithNext();
    this.setState({loading: false});
  }
  handleCancel() {
    this.goBackAndClearMarkets();
  }
  handleOk() {
    const { couponInfo, marketInfo, saasId, onMarketAssigned } = this.props;
    const pubId = couponInfo.key;
    const codeAndId = marketInfo.targetKeys.join(',');
    let { addMarket, removeMarket } = diffMarkets(this.state.oldMarkets, marketInfo.targetKeys);

    if (addMarket.length === 0 && removeMarket.length === 0) {
      return message.warn('门店信息未修改过，无法分配门店');
    }

    // removeMarket需要移除citycode
    removeMarket = removeMarket.map(i => i.split(':')[1]);

    hqCouponApi
      .assignMarkets(pubId, saasId, addMarket.join(','), removeMarket.join(','))
      .then(() => {
        message.success('门店分配成功');
        setTimeout(() => {
          this.goBackAndClearMarkets();
          onMarketAssigned && setTimeout(() => onMarketAssigned(pubId), 500);
        }, 1500);
      })
      .catch(e => message.error(e.message));
  }
  goBackAndClearMarkets() {
    const { resetMarkets } = this.props;
    resetMarkets();
    this.context.history.goBack();
  }
  render() {
    const { marketInfo } = this.props;
    // TODO: this may be slow, we can put it when marketSelection is done rather then here.
    const cityMarketPair = getCityMarketPair(marketInfo.targetKeys, marketInfo.dataSource, marketInfo.selectedRegion);
    return (
      <MarketAssign {...this.props}
        loading={this.state.loading}
        cityMarketPair={cityMarketPair}
        onCancel={::this.handleCancel}
        onOk={::this.handleOk}
        onAssignBtnClick={this.props.openModal}/>
    );
  }
}
