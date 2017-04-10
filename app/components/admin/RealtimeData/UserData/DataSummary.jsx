import React, {Component, PropTypes} from 'react';
import {Row, Col, Spin,Form} from 'antd';
import * as styles from './styles.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userDataActionCreators from 'redux/modules/userData';

@connect(
  ({userData}) => ({
    topData:userData.topData,
    loading:userData.loading,
  }),
  dispatch => bindActionCreators(userDataActionCreators, dispatch)
)

@Form.create()
export default class DataSummary extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
  }

    render() {
      const { topData,loading } = this.props;
        return (
          <div>
            <div className={styles.body}>
                <div className={styles.title}>数据概要</div>
            </div>
            <Spin spinning={loading}>
              <ul className={styles.body+" "+styles.flex+" "+styles.li}>
                <li></li>
                <li>
                  <div className={styles.dataSummary+" "+styles.dataSummary1}>
                    <p style={{width:'100px'}}>领券人数</p>
                    <p>{topData.getusers}</p>
                  </div>
                </li>
                <li></li>
                <li>
                  <div className={styles.dataSummary+" "+styles.dataSummary2}>
                    <p style={{width:'100px'}}>核券人数</p>
                    <p>{topData.useusers}</p>
                  </div>
                </li>
                <li></li>
                <li>
                  <div className={styles.dataSummary+" "+styles.dataSummary3}>
                    <p style={{width:'100px'}}>人均用券量</p>
                    <p>{topData.useavg}张</p>
                  </div>
                </li>
                <li></li>
              </ul>
            </Spin>
          </div>
        )
    }
}
