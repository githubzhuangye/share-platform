import React, { PropTypes, Component } from 'react';
import query from '../query.hoc.js';
import { reportApi } from 'api';
import styles from '../common.css';
import { DIMENSIONS } from 'config/constants';
import { cardable } from 'hoc';

import { StatusIcon } from 'components/admin';
import AnalysisContent from '../AnalysisContent/AnalysisContent';
import PieChart from '../Charts/PieChart';

function Total({total = [], showGet}) {
  return (
    <div className={styles.extraContainer}>
      <h3 className={styles.extraTitle}>单品排行</h3>
      <ul>
        {total.map((item, index) => (
          <li key={index} className={styles.NOItem}>
            <div><StatusIcon color="red"/>NO.{index + 1} {item.name}</div>
            <div>
              <span className={styles.useItem}>总核券数：{item.use}</span>
              {showGet && <span>总领券数：{item.get}</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

@query({fetchData: reportApi.fetchGood})
export default class GoodTrend extends Component {
  render() {
    const { total, dataSource, query = {} } = this.props;
    const showGet = !query.saasid;
    const exportParams = {...query, baseType: DIMENSIONS.GOOD};
    return (
      <AnalysisContent
        extra={<Total total={total} showGet={showGet}/>}
        exportParams={exportParams}>
        <PieChart
          radioStyle={{position: 'absolute', left: '40%', top: '-8px'}}
          showGet={showGet}
          title="单品分布图"
          dataSource={dataSource}/>
      </AnalysisContent>
    );
  }
}
