import React, {Component, PropTypes} from 'react';
import {Row, Col} from 'antd';
import * as styles from './styles.css';


export default class DataSummary extends Component {
    render() {
      const { dataSource } = this.props;
        return (
          <div>
              <div className={styles.modelTitle}>数据概要</div>
                <Row>
                  <Col span={4} offset={1} className={styles.topdata}>
                    <div>领劵人数</div>
                    <div>{dataSource?dataSource.getusers:'--'}</div>
                  </Col>
                  <Col span={4} offset={1} className={styles.topdata}>
                    <div>领劵数量</div>
                    <div>{dataSource?dataSource.getcnt:'--'}</div>
                  </Col>
                  <Col span={4} offset={1} className={styles.topdata}>
                    <div>核劵人数</div>
                    <div>{dataSource?dataSource.useusers:'--'}</div>
                  </Col>
                  <Col span={4} offset={1} className={styles.topdata}>
                    <div>核劵数量</div>
                    <div>{dataSource?dataSource.usecnt:'--'}</div>
                  </Col>
                  <Col span={4} offset={1} className={styles.topdata}>
                    <div>核销率</div>
                    <div>{dataSource?dataSource.usepers:'--'}</div>
                  </Col>
                  <Col span={4} offset={1} className={styles.topdata}>
                    <div>人均用劵量</div>
                    <div>{dataSource?dataSource.useavg:'--'}</div>
                  </Col>
                </Row>
          </div>
        )
    }
}
