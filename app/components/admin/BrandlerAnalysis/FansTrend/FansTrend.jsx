import React, { PropTypes, Component } from 'react';
import { Row, Col } from 'antd';
import query from '../query.hoc.js';
import { reportApi } from 'api';
import styles from '../common.css';
import { cardable } from 'hoc';

import LineChart from '../Charts/LineChart';
import AnalysisContent from '../AnalysisContent/AnalysisContent';

function Total({allUse, partialUse, notUse, notGet}) {
  return (
    <div className={styles.extraContainer}>
      <h3 className={styles.extraTitle}>累计</h3>
      <Row>
        <Col span={8}>全领全用：</Col>
        <Col span={16}>{allUse}</Col>
      </Row>
      <Row>
        <Col span={8}>全领部分用：</Col>
        <Col span={16}>{partialUse}</Col>
      </Row>
      <Row>
        <Col span={8}>全领不用：</Col>
        <Col span={16}>{notUse}</Col>
      </Row>
      <Row>
        <Col span={8}>沉睡用户：</Col>
        <Col span={16}>{notGet}</Col>
      </Row>
    </div>
  );
}

const getOption = ({allUse = [], partialUse = [], notUse = [], notGet = []} = {}) => ({
  title: {
    text: '粉丝趋势图',
  },
  tooltip: {
    trigger: 'axis',
  },
  color: ['#F26053', '#2CC550', '#FBA441', '#127EA7'],
  legend: {
    data:['全领全用', '全领部分用', '全领不用', '沉睡用户'],
  },
  xAxis: {
    type: 'category',
    data: ['9-10', '9-11', '9-12', '9-13'],
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    name: '全领全用',
    type: 'line',
    smooth: true,
    data: allUse,
  },{
    name: '全领部分用',
    type: 'line',
    smooth: true,
    data: partialUse,
  },{
    name: '全领不用',
    type: 'line',
    smooth: true,
    data: notUse,
  }, {
    name: '沉睡用户',
    type: 'line',
    smooth: true,
    data: notGet,
  }]
});

@query({fetchData: reportApi.fetchFans})
export default class FansTrend extends Component {
  render() {
    const { total, dataSource } = this.props;
    return (
      <AnalysisContent
        extra={<Total {...total}/>}
        hideExportBtn={true}>
        <LineChart
          option={getOption(dataSource)}/>
      </AnalysisContent>
    );
  }
}
