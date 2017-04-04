import React, { PropTypes, Component } from 'react';
import { Radio, DatePicker, Row, Col, Button } from 'antd';
import { DIMENSIONS } from 'config/constants';
import { reportApi } from 'api';
import { disabledDate, formatRangePickerDate } from 'helpers/util';
import { DATE_INTERVAL } from 'config/constants';
import { navigateTo } from 'helpers/util';

import PieChart from '../Charts/PieChart';
import CouponList from './CouponList';
import CouponTrend from '../CouponTrend/CouponTrend';
import CouponRealTime from '../CouponRealTime/CouponRealTime';
import AnalysisContent from '../AnalysisContent/AnalysisContent';

const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker;

function PieContent({dataSource, dimension, loading, exportParams, onItemClick}) {
  return (
    <AnalysisContent
      extra={<CouponList dataSource={dataSource} dimension={dimension}/>}
      exportParams={exportParams}>
      <PieChart
        dataSource={dataSource} dimension={dimension} loading={loading}
        onItemClick={onItemClick} showGet={dimension === DIMENSIONS.REGION}/>
    </AnalysisContent>
  );
}

export default class CouponAnalysis extends Component {
  static propTypes = {
    dimension: PropTypes.string.isRequired,
    onPieItemClick: PropTypes.func.isRequired,
    onDimensionChange: PropTypes.func.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    loading: false,
    dataSource: [],
    date: [],
  }
  componentDidMount() {
    this.fetchData({dimension: this.props.dimension});
  }
  componentWillReceiveProps({dimension}) {
    this.fetchData({dimension});
    // 每次状态改变重置date
    this.setState({date: undefined});
  }
  fetchData(query) {
    // 券况和实时分析的数据请求会在各自容器中，因此在这里忽略
    if (query.dimension === DIMENSIONS.TREND || query.dimension === DIMENSIONS.REAL_TIME) {
      return;
    }
    this.setState({loading: true});
    reportApi.queryByFirstDimension(query)
      .then(dataSource => this.setState({loading: false, dataSource}));
  }
  handleDateChange(value) {
    const formatDate = formatRangePickerDate(value);
    const { dimension } = this.props;
    if (formatDate) {
      this.fetchData({dimension: dimension, ...formatDate});
    } else {
      this.fetchData({dimension: dimension});
    }
    this.setState({date: value});
  }
  handlePieItemClick(value) {
    const info = this.state.dataSource
      .find(item => item.name === value);
    this.props.onPieItemClick(info);
  }
  getCouponTrendOrRealTime(dimension) {
    switch(dimension) {
      case DIMENSIONS.TREND: return <CouponTrend/>;
      case DIMENSIONS.REAL_TIME: return <CouponRealTime/>;
    }
  }
  render() {
    const { dimension, onPieItemClick, onDimensionChange } = this.props;
    const { loading, date, dataSource } = this.state;
    const exportParams = {baseType: dimension, ...formatRangePickerDate(date)};
    return (
      <div>
        <Row style={{marginBottom: '8px'}}>
          <Col span={16}>
            <RadioGroup value={dimension} onChange={e => onDimensionChange(e.target.value)}>
              <Radio value={DIMENSIONS.REGION}>按区域</Radio>
              <Radio value={DIMENSIONS.SAAS}>按商户</Radio>
              <Radio value={DIMENSIONS.MARKET}>按门店</Radio>
              <Radio value={DIMENSIONS.TREND}>按趋势</Radio>
              <Radio value={DIMENSIONS.REAL_TIME}>按时段</Radio>
            </RadioGroup>
          </Col>
        </Row>
        {dimension !== DIMENSIONS.TREND && dimension !== DIMENSIONS.REAL_TIME
        ? <Row>
            <Col span={6}>
              <RangePicker value={date}
                disabledDate={disabledDate(DATE_INTERVAL.AFTER)} onChange={::this.handleDateChange}/>
            </Col>
          </Row>
        : null
        }
        {dimension !== DIMENSIONS.TREND && dimension !== DIMENSIONS.REAL_TIME
        ? <PieContent dataSource={dataSource} dimension={dimension} loading={loading}
            exportParams={exportParams}
            onItemClick={::this.handlePieItemClick}/>
        : this.getCouponTrendOrRealTime(dimension)}
      </div>
    );
  }
}
