import React, { PropTypes, Component } from 'react';
import { Row, Col, Radio, DatePicker, Button } from 'antd';
import { visible } from 'hoc';
import { DIMENSIONS } from 'config/constants';
import XBarChart from '../Charts/XBarChart.jsx';
import { reportApi } from 'api';
import { DATE_INTERVAL } from 'config/constants';
import { disabledDate, formatRangePickerDate } from 'helpers/util';
import AnalysisContent from '../AnalysisContent/AnalysisContent.jsx';
import CouponList from './CouponList.jsx';

const { REGION, SAAS, MARKET } = DIMENSIONS;
const RangePicker = DatePicker.RangePicker;
const RadioGroup = Radio.Group;

function findSecondDimension(firstDimension, allDimensions) {
  // return Object.keys(allDimensions)
  //   .map(key => allDimensions[key])
  //   .filter(value => value !== firstDimension)[0];
  return MARKET;
}

export default class CouponDetail extends Component {
  static propTypes = {
    firstDimension: PropTypes.string.isRequired,
    firstDimensionInfo: PropTypes.object.isRequired,
    onBackBtnClick: PropTypes.func.isRequired,
  }
  state = {
    loading: false,
    secondDimension: findSecondDimension(this.props.firstDimension, DIMENSIONS),
    dataSource: {},
    date: [],
  }
  componentDidMount() {
    const { firstDimension, firstDimensionInfo } = this.props;
    const secondDimension = findSecondDimension(firstDimension, DIMENSIONS);
    this.fetchData({secondDimension, firstDimension, firstDimensionId: firstDimensionInfo.id});
  }
  componentWillReceiveProps(nextProps) {
    const { firstDimension, firstDimensionInfo } = nextProps;
    const secondDimension = findSecondDimension(firstDimension, DIMENSIONS);
    this.setState({secondDimension, date: undefined});
    this.fetchData({secondDimension, firstDimension, firstDimensionId: firstDimensionInfo.id});
  }
  handleSecondDimensionChange(secondDimension) {
    const { firstDimension, firstDimensionInfo } = this.props;
    this.setState({secondDimension, date: undefined});
    this.fetchData({secondDimension, firstDimension, firstDimensionId: firstDimensionInfo.id});
  }
  handleDateChange(value) {
    const { firstDimension, firstDimensionInfo } = this.props;
    const { secondDimension } = this.state;
    const formatDate = formatRangePickerDate(value);
    this.setState({date: value});
    this.fetchData({secondDimension, firstDimension, firstDimensionId: firstDimensionInfo.id, ...formatDate});
  }
  fetchData(query) {
    this.setState({loading: true});
    reportApi.queryBySecondDimension(query)
      .then(dataSource => this.setState({loading: false, dataSource}));
  }
  getFirstDimensionQuery(firstDimension, firstDimensionInfo) {
    switch (firstDimension) {
      case DIMENSIONS.SAAS: return {saasid: firstDimensionInfo.id};
      case DIMENSIONS.REGION: return {areaid: firstDimensionInfo.id};
      case DIMENSIONS.MARKET: return {marketid: firstDimensionInfo.id};
    }
  }
  render() {
    const { firstDimension, firstDimensionInfo, onBackBtnClick } = this.props;
    const { secondDimension, loading, dataSource, date } = this.state;
    const couponListDataSource = dataSource.name ? dataSource.name.map((item, index) => ({name: item, use: dataSource.use[index]})).reverse() : [];
    const exportParams = {baseType: firstDimension, secondType: secondDimension, ...this.getFirstDimensionQuery(firstDimension, firstDimensionInfo),
      ...formatRangePickerDate(date)};
    return (
      <div>
        <Row>
          <Col span={3}>
            <Button size="small" type="primary" onClick={onBackBtnClick} style={{marginTop: '-4px'}}>返回上一层</Button>
          </Col>
          <Col span={8}>
            <RadioGroup value={secondDimension} onChange={e => this.handleSecondDimensionChange(e.target.value)}>
              { firstDimension !== REGION && <Radio value={REGION}>按区域</Radio> }
              { firstDimension !== SAAS && <Radio value={SAAS}>按商户</Radio>}
              { firstDimension !== MARKET && <Radio value={MARKET}>按门店</Radio> }
            </RadioGroup>
          </Col>
          <Col offset={6} span={6}>
            <RangePicker
              value={date}
              onChange={::this.handleDateChange}
              disabledDate={disabledDate(DATE_INTERVAL.AFTER)}/>
          </Col>
        </Row>
        <h3>{firstDimensionInfo.name}</h3>
        <AnalysisContent
          extra={<CouponList dataSource={couponListDataSource}/>}
          exportParams={exportParams}>
          <XBarChart
            showGet={secondDimension === DIMENSIONS.REGION}
            dataSource={dataSource}
            loading={loading}/>
        </AnalysisContent>
      </div>
    );
  }
}
