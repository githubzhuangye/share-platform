import React, { Component, PropTypes } from 'react';
import { Form, Row, Col, Select, DatePicker, Icon, Spin, Button } from 'antd';
import moment from 'moment';
import { disabledDate, generateOptions, formatRangePickerDate, navigateTo } from 'helpers/util';
import { DATE_INTERVAL } from 'config/constants';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 16},
};

function formatQuery(rawQuery) {
  const query = {};
  if (rawQuery.selectedAreaId) {
    query.areaid = rawQuery.selectedAreaId;
  }
  if (rawQuery.selectedSaasId) {
    query.saasid = rawQuery.selectedSaasId;
  }
  if (rawQuery.selectedMarketId) {
    query.marketid = rawQuery.selectedMarketId;
  }
  const formatDate = formatRangePickerDate(rawQuery.selectedDate);
  if (formatDate) {
    query.start = formatDate.start;
    query.end = formatDate.end;
  }
  return query;
}

export default class QueryHeader extends Component {
  static propTypes = {
    areaList: PropTypes.array.isRequired,
    saasList: PropTypes.array.isRequired,
    marketList: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    fetchData: PropTypes.func.isRequired,
    fetchMarket: PropTypes.func.isRequired,
    hasBackBtn: PropTypes.bool.isRequired,
    onDataFetched: PropTypes.func,
    onQueryChange: PropTypes.func,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    selectedAreaId: undefined,
    selectedSaasId: undefined,
    selectedMarketId: undefined,
    selectedDate: undefined,
    initialFetch: true,
  }
  componentDidMount() {
    this.fetch();
    this.setState({initialFetch: false});
  }
  handleAreaIdSelect(value) {
    this.setState({selectedAreaId: value}, ::this.fetch);
  }
  handleAreaIdChange(value) {
    // 清除areaId事件
    if (!value) {
      this.setState({selectedAreaId: undefined}, ::this.fetch);
    }
  }
  handleSaasIdSelect(value) {
    // 选中saas后，发送请求得到对应的门店列表
    const { selectedAreaId } = this.state;
    this.props.fetchMarket({areaid: selectedAreaId, saasid: value});

    this.setState({selectedSaasId: value, selectedMarketId: undefined}, ::this.fetch);
  }
  handleSaasIdChange(value) {
    // 清除saasId事件
    if (!value) {
      this.setState({selectedSaasId: undefined, selectedMarketId: undefined}, ::this.fetch);
    }
  }
  handleMarketIdSelect(value) {
    this.setState({selectedMarketId: value}, ::this.fetch);
  }
  handleMarketIdChange(value) {
    // 清除marketId事件
    if (!value) {
      this.setState({selectedMarketId: undefined}, ::this.fetch);
    }
  }
  handleDateChange(value) {
    this.setState({selectedDate: value}, ::this.fetch);
  }
  fetch() {
    const { initialFetch, ...query } = this.state;
    const { hideMarket, fetchData, onDataFetched, onQueryChange } = this.props;
    // 组件挂载后发起的第一次请求，不带任何参数
    if (initialFetch) {
      fetchData({}).then(onDataFetched);
      onQueryChange && onQueryChange({});
      return;
    }

    const formatData = formatQuery(query);
    fetchData(formatData).then(onDataFetched);
    onQueryChange && onQueryChange(formatData);
  }
  handleBackBtnClick() {
    navigateTo('/admin/analysis/dashboard', this.context.router);
  }
  render() {
    const { selectedAreaId, selectedSaasId, selectedMarketId, selectedDate } = this.state;
    const { areaList, saasList, marketList, loading, hasBackBtn } = this.props;
    return (
      <Spin spinning={loading}>
        {hasBackBtn
        ? <Row>
            <Col span={4}>
              <Button size="small" type="primary" onClick={::this.handleBackBtnClick} style={{marginBottom: '8px'}}>返回上一层</Button>
            </Col>
          </Row>
        : null}
        <Row>
          <Col span={6}>
            <FormItem {...formItemLayout}>
              <Select placeholder="请选择区域名称" style={{width: '200px'}} allowClear
                value={selectedAreaId} onChange={::this.handleAreaIdChange}
                onSelect={::this.handleAreaIdSelect}>
                {generateOptions(areaList, 'areaid', 'areaname')}
              </Select>
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem {...formItemLayout}>
              <Select placeholder="请选择商户名称" style={{width: '200px'}} allowClear
                value={selectedSaasId} onChange={::this.handleSaasIdChange}
                onSelect={::this.handleSaasIdSelect}>
                {generateOptions(saasList, 'saasid', 'saasname')}
              </Select>
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem {...formItemLayout}>
              <Select placeholder={selectedSaasId ? "请选择门店名称" : "请先选择商户名称"} style={{width: '200px'}} allowClear
                value={selectedMarketId} onChange={::this.handleMarketIdChange}
                onSelect={::this.handleMarketIdSelect}
                disabled={!selectedSaasId}>
                {generateOptions(marketList, 'marketid', 'marketname')}
              </Select>
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem {...formItemLayout}>
              <RangePicker disabledDate={disabledDate(DATE_INTERVAL.AFTER)}
                value={selectedDate}
                onChange={::this.handleDateChange}/>
            </FormItem>
          </Col>
        </Row>
      </Spin>
    );
  }
}
