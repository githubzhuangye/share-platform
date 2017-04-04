import React, { PropTypes, Component } from 'react';
import { Select, message, Spin } from 'antd';
import { generateOptions } from 'helpers/util';
import { ticketQueryApi } from 'api';

const Option = Select.Option;

const saasMarket = {
  saasList: [
    {name: 'saas1', id: 'saas1'},
    {name: 'saas2', id: 'saas2'},
  ],
  marketListMap: {
    saas1: [
      {name: 'market1', id: 'market1'},
      {name: 'market2', id: 'market2'},
    ],
    saas2: [
      {name: 'market3', id: 'market3'},
      {name: 'market4', id: 'market4'},
    ],
  },
};

function transformData(data) {
  const saasList = [];
  const marketListMap = {};
  data.forEach(saas => {
    saasList.push({name: saas.name, id: saas.id});
    marketListMap[saas.id] = saas.market;
  });

  return {saasList, marketListMap};
}

export default class SaasMarketSelect extends Component {
  static propTypes = {
    pubId: PropTypes.string.isRequired,
    onChange: PropTypes.func,
  }
  state = {
    selectedSaasId: undefined,
    selectedMarketId: undefined,
    loading: false,
    saasMarket: {
      saasList: [],
      marketListMap: [],
    },
  }
  componentDidMount() {
    this.setState({loading: true});

    ticketQueryApi.fetchMarkets(this.props.pubId)
      .then(transformData)
      .then(saasMarket => this.setState({saasMarket, loading: false}))
      .catch(err => {
        messge.error(err.message);
        this.setState({loading: false});
      });
  }
  handleSaasIdChange(value) {
    this.setState({selectedSaasId: value, selectedMarketId: undefined});

    this.props.onChange && this.props.onChange({saasid: value});
  }
  handleMarketIdChange(value) {
    this.setState({selectedMarketId: value});

    this.props.onChange && this.props.onChange({saasid: this.state.selectedSaasId, marketid: value});
  }
  render() {
    const { selectedSaasId, selectedMarketId, loading, saasMarket } = this.state;
    return (
      <Spin spinning={loading} style={{display: 'inline-block'}}>
        <Select 
          value={selectedSaasId} onChange={::this.handleSaasIdChange}
          style={{width: 150}} placeholder="请选择商户" allowClear>
          {generateOptions(saasMarket.saasList, 'id', 'name')}
        </Select>
        <Select 
          value={selectedMarketId} onChange={::this.handleMarketIdChange}
          style={{width: 150, margin: '0 8px'}} placeholder="请选择门店" allowClear
          disabled={!selectedSaasId}>
          {selectedSaasId ? generateOptions(saasMarket.marketListMap[selectedSaasId], 'id', 'name') : null}
        </Select>
      </Spin>
    );
  }
}