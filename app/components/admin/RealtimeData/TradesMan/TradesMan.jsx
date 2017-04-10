import React, {Component, PropTypes} from 'react';

import {cardable} from 'hoc';
import ActivityTrades from './ActivityTrades.jsx';
import ProportionUseChild from './ProportionUseChild.jsx';
import ProportionUsePerants from './ProportionUsePerants.jsx';
//import ProportionCharts2 from './ProportionCharts2';
import Columnar from './Columnar';
import { Cascader,DatePicker,Spin } from 'antd';
import styles from './styles.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as TradesManActionCreators from 'redux/modules/TradesMan';
import * as userDataActionCreators from 'redux/modules/userData';
import { DataPublicApi } from 'api';

@cardable(['零售商&门店数据分析'])
@connect(
  ({TradesMan,userData}) => ({
    activeList: TradesMan.activeList,
    tradesChild: TradesMan.tradesChild,
    tradesParent: TradesMan.tradesParent,
  }),
  dispatch => bindActionCreators({...TradesManActionCreators,...userDataActionCreators}, dispatch)
)


export default class TradesMan extends Component {
  static propTypes = {
    activeList: PropTypes.array.isRequired,
    tradesChild: PropTypes.object.isRequired,
    tradesParent: PropTypes.object.isRequired,
  }
  state = {
    topData: {getcnt:'0',getusers:'0',usecnt:'0',useusers:'0',usepers:'0'}
  }
  async componentDidMount() {
    const activeList = await this.props.handleActiveList();
    const tradesChild = await this.props.handleTradesChild();
    const tradesParent = await this.props.handleTradesParent();

    DataPublicApi.queryReportTopData()
        .then(topData => {
            this.setState({topData,loading: false})
        })
  }
    render() {
    const {  RangePicker } = DatePicker;
    const { activeList,tradesChild,tradesParent,dataSource } = this.props;
    const { loading,topData } = this.state;
        return (
            <div className={styles.container}>
                  <ActivityTrades dataSource={activeList}/>
                    <div className={styles.body}>
                        <div className={styles.title}>数据概要</div>
                    </div>
                    <Spin spinning={loading}>
                    <div className={styles.center+" "+styles.body}>
                      {/*<p>选择零售商和门店</p>
                      <div className={styles.header_data}>
                          <Cascader placeholder="请选择零售商和门店"></Cascader>
                      </div>*/}
                      <ul className={styles.body+" "+styles.flex+" "+styles.li} style={{marginTop:'20px'}}>
                        <li>
                          <div className={styles.dataSummary}>
                            <p>领券数量</p>
                            <p>{topData.getcnt}</p>
                          </div>
                        </li>
                        <li>
                          <div className={styles.dataSummary}>
                            <p>领券人数</p>
                            <p>{topData.getusers}</p>
                          </div>
                        </li>
                        <li>
                          <div className={styles.dataSummary}>
                            <p>核销数量</p>
                            <p>{topData.usecnt}</p>
                          </div>
                        </li>
                        <li>
                          <div className={styles.dataSummary}>
                            <p>核券人数</p>
                            <p>{topData.useusers}</p>
                          </div>
                        </li>
                        <li>
                          <div className={styles.dataSummary}>
                            <p>核销率</p>
                            <p>{topData.usepers}</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </Spin>
                  <Spin spinning={loading}>
                    <div className={styles.body+" "+styles.bodyT}>
                        <div className={styles.title}>门店标签数据</div>
                        <ul className={styles.flex}>
                          <li>
                            <p className={styles.leftSize}>核券标签</p>
                            <ProportionUsePerants dataSource={tradesParent}/>
                          </li>
                          <li>
                            <div style={{marginTop:'70px'}}></div>
                            <ProportionUseChild dataSource={tradesChild}/>
                          </li>
                        </ul>
                    </div>
                  </Spin>
                    {/*<div className={styles.body+" "+styles.bodyT}>
                        <div className={styles.title}>领核券汇总</div>
                        <p className={styles.leftSize}>领券各零售商及门店占比情况</p>
                        <ul className={styles.flex}>
                          <li><ProportionCharts/></li>
                          <li style={{marginTop:'70px'}}><ProportionCharts2/></li>
                        </ul>
                        <p className={styles.leftSize}>核券各零售商及门店占比情况</p>
                        <ul className={styles.flex}>
                          <li><ProportionCharts/></li>
                          <li style={{marginTop:'70px'}}><ProportionCharts2/></li>
                        </ul>
                    </div>
                    <div className={styles.body+" "+styles.bodyT}>
                        <div className={styles.title}>门店标签数据</div>
                        <ul className={styles.flex}>
                          <li>
                            <p className={styles.leftSize}>领券标签</p>
                            <ProportionCharts/>
                          </li>
                          <li>
                            <p className={styles.leftSize}>核券标签</p>
                            <ProportionCharts/>
                          </li>
                        </ul>
                    </div>
                    <div className={styles.body+" "+styles.bodyT} style={{height:'500px'}}>
                        <div className={styles.title}>门店覆盖率</div>
                        <ul className={styles.flex}>
                          <li>
                            <p className={styles.leftSize}>门店客流覆盖率</p>
                            <ul className={styles.flex}>
                              <li><span>60%</span>平均覆盖率</li>
                              <li><span>3,000</span>平均客流量</li>
                            </ul>
                            <Columnar/>
                          </li>
                          <li>
                            <p className={styles.leftSize}>交易笔数渗透率</p>
                            <ul className={styles.flex}>
                              <li><span>60%</span>平均覆盖率</li>
                              <li><span>3,000</span>平均客流量</li>
                            </ul>
                            <Columnar/>
                          </li>
                        </ul>
                    </div>*/}
            </div>
        )
    }
}
