import React, { PropTypes, Component } from 'react';
import { Row, Col } from 'antd';
import { visible } from 'hoc';
import LineChart from '../Charts/LineChart';
import { reportApi } from 'api';
import AnalysisContent from '../AnalysisContent/AnalysisContent.jsx';
import styles from '../common.css';
import query from '../query.hoc.js';
import { DIMENSIONS } from 'config/constants';

function Total({total = {}, showGet}) {
  return (
    <div className={styles.extraContainer}>
      <h3 className={styles.extraTitle}>累计</h3>
      <Row>
        <Col span={6}>核销总数：</Col>
        <Col span={18}>{total.use}</Col>
      </Row>
      {showGet
      ? <Row>
          <Col span={6}>领券总数：</Col>
          <Col span={18}>{total.get}</Col>
        </Row>
      : null
      }
      {showGet
      ? <Row>
          <Col span={6}>渗透率：</Col>
          <Col span={18}>{total.pp}</Col>
        </Row>
      : null}
    </div>
  );
}

const getOption = (dataSource = {}) => ({
  title: {
    text: '按时段分布图',
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data:['领券数', '核券数'],
  },
  color: ['#007DA9', '#f55f4e'],
  xAxis: {
    type: 'category',
    data: dataSource.hour || [],
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    name: '领券数',
    type: 'line',
    smooth: true,
    data: dataSource.get || [],
  },{
    name: '核券数',
    type: 'line',
    smooth: true,
    data: dataSource.use || [],
  }]
});

@query({fetchData: reportApi.fetchCouponRealTime})
export default class CouponRealTime extends Component {
  render() {
    const { dataSource, total, query = {} } = this.props;
    const showGet = !query.saasid; // 查询时，不带商户条件才会显示领取数量
    const exportParams = {...query, baseType: DIMENSIONS.REAL_TIME};
    return (
      <AnalysisContent
        extra={<Total total={total} showGet={showGet}/>}
        exportParams={exportParams}>
        <LineChart
          option={getOption(dataSource)}/>
      </AnalysisContent>
    );
  }
}
