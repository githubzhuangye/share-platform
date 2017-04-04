import React, { PropTypes, Component } from 'react';
import { Row, Col } from 'antd';
import { visible } from 'hoc';
import CouponChart from '../Charts/CouponChart';
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

@query({fetchData: reportApi.fetchCouponTrend})
export default class CouponTrend extends Component {
  render() {
    const { dataSource, total, query = {} } = this.props;
    const showGet = !query.saasid; // 查询时，不带商户条件才会显示领取数量
    const exportParams = {...query, baseType: DIMENSIONS.TREND};
    return (
      <AnalysisContent
        extra={<Total total={total} showGet={showGet}/>}
        exportParams={exportParams}>
        <CouponChart
          showGet={showGet}
          dataSource={dataSource}/>
      </AnalysisContent>
    );
  }
}
