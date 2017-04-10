import React, {Component, PropTypes} from 'react';
import  styles from './styles.css';
import {cardable} from 'hoc';
import { Cascader,DatePicker,Spin,Icon } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userDataActionCreators from 'redux/modules/userData';

import UserChartUse from '../UserData/UserChartUse';
import UserChartGet from '../UserData/UserChartGet';
import TimeCharts from '../UserData/TimeCharts';
import TimeInterval from '../UserData/TimeInterval';
import TableInterval from '../UserData/TableInterval';
import DataCoupon from '../Charts/DataCoupon';
import TableCoupon from '../Charts/TableCoupon';
import { DataSelectContainer } from 'containers/admin';
import DataSummary from './DataSummary';
import NuclearChart from './NuclearChart';
import ReceiveChart from './ReceiveChart';
import { userDataApi } from 'api';
@cardable(['用户数据分析'])

@connect(
  ({userData}) => ({
    userDataUse:userData.userDataUse,
    userDataGet:userData.userDataGet,
    loading: userData.loading,
  }),
  dispatch => bindActionCreators(userDataActionCreators,dispatch)
)

export default class UserData extends Component {
    static propTypes = {
      userDataUse: PropTypes.object.isRequired,
      userDataGet: PropTypes.object.isRequired,
      loading: PropTypes.bool.isRequired,
    }

    render() {
        const {  RangePicker } = DatePicker;
        const { userDataUse,userDataGet,loading } = this.props;
        return (
            <div className={styles.container}>
                  <DataSelectContainer/>
                  <DataSummary/>
                  <Spin spinning={loading}>
                  <div>
                    <div className={styles.body}>
                      <div className={styles.title}>领核券汇总</div>
                    </div>
                    <ul className={styles.body}>
                      <li className={styles.summarySummary}>
                        <div>
                          <p className={styles.pData}>领券数据</p>
                          <ul>
                            <li>总领核量:<span>{userDataGet.coupon}</span></li>
                            <li>总领券人数:<span>{userDataGet.user}</span></li>
                            <li>人均领券:<span>{userDataGet.avg}</span></li>
                          </ul>
                          <ReceiveChart/>
                        </div>
                      </li>
                      <li className={styles.summarySummary}>
                        <div>
                          <p className={styles.pData}>核券数据</p>
                          <ul>
                            <li>总领核量:<span>{userDataUse.coupon}</span></li>
                            <li>总领券人数:<span>{userDataUse.user}</span></li>
                            <li>人均领券:<span>{userDataUse.avg}</span></li>
                          </ul>
                          <NuclearChart/>
                        </div>
                      </li>
                    </ul>
                    <ul className={styles.body}>
                      <li className={styles.summarySummary}>
                        <div>
                          <p className={styles.pData}>领券数据</p>
                          <ul>
                            <li>总领核量:<span>{userDataGet.coupon}</span></li>
                            <li>总领券人数:<span>{userDataGet.user}</span></li>
                            <li>人均领券:<span>{userDataGet.avg}</span></li>
                          </ul>
                           <UserChartGet/>
                        </div>
                      </li>
                      <li className={styles.summarySummary}>
                        <div>
                          <p className={styles.pData}>核券数据</p>
                          <ul>
                            <li>总领核量:<span>{userDataUse.coupon}</span></li>
                            <li>总领券人数:<span>{userDataUse.user}</span></li>
                            <li>人均领券:<span>{userDataUse.avg}</span></li>
                          </ul>
                          <UserChartUse/>
                        </div>
                      </li>
                    </ul>
                  </div>
                </Spin>
                  {/*<div>
                    <div className={styles.body}>
                        <div className={styles.title}>核劵时间间隔</div>
                    </div>
                    <div className={styles.body}>
                      <p className={styles.pData+" "+styles.pdata}>用完券花费时间</p>
                      <div className={styles.TableInterval}>
                        <TimeInterval loading={false}/>
                      </div>
                      <div className={styles.TableInterval}>
                        <TableInterval loading={false}/>
                      </div>
                    </div>
                  </div>
                  <div className={styles.interval}>
                    <div className={styles.body}>
                        <div className={styles.title}>用户敏感度分析</div>
                    </div>
                    <div className={styles.body}>
                      <p className={styles.pData}>优惠力度与领核券人数的关系</p>
                      <DataCoupon dataSource={this.props.dataSource} loading={false}/>
                    </div>
                    <div className={styles.body}>
                      <TableCoupon loading={false}/>
                    </div>
                  </div>*/}
            </div>
        )
    }
}
