import React, {Component, PropTypes} from 'react';
import {Row, Col, Spin,Form} from 'antd';
import * as styles from './styles.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userDataActionCreators from 'redux/modules/userData';
import {DataPublicApi} from 'api';

@connect(
  ({userData}) => ({
    topData: userData.topData,
  }),
  dispatch => bindActionCreators(userDataActionCreators, dispatch)
)

@Form.create()
export default class DataSummary extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
  }
  state = {
    dataSource: {getusers: "--",useusers: "--",useavg: "--"},
  }
 async componentDidMount() {
   DataPublicApi.queryReportTopData()
       .then(dataSource => {
           if(dataSource.getusers == '') dataSource.getusers = '--';
           if(dataSource.useusers == '') dataSource.useusers = '--';
           if(dataSource.useavg == '') dataSource.useavg = '--';
           this.setState({dataSource,loading: false})
       })
 }
    render() {
      const { dataSource,loading } = this.state;
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
                    <p>{dataSource.getusers}</p>
                  </div>
                </li>
                <li></li>
                <li>
                  <div className={styles.dataSummary+" "+styles.dataSummary2}>
                    <p style={{width:'100px'}}>核券人数</p>
                    <p>{dataSource.useusers}</p>
                  </div>
                </li>
                <li></li>
                <li>
                  <div className={styles.dataSummary+" "+styles.dataSummary3}>
                    <p style={{width:'100px'}}>人均用券量</p>
                    <p>{dataSource.useavg}张</p>
                  </div>
                </li>
                <li></li>
              </ul>
            </Spin>
          </div>
        )
    }
}
