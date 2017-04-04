import React, {Component, PropTypes} from 'react';
import { Button,Spin } from 'antd';
import {cardable} from 'hoc';
import ActivityCategory from './ActivityCategory.jsx';
import ChartsCategory from './ChartsCategory.jsx';
import Columnar2 from './Columnar2.jsx';
import ChartsCategory2 from './ChartsCategory2.jsx';
import ChartsCategory3 from './ChartsCategory3.jsx';
import Columnar from './Columnar.jsx';
import Coupon from '../Charts/DataCoupon'
import { Cascader,DatePicker } from 'antd';
import  styles from './styles.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as CategoryDataActionCreators from 'redux/modules/CategoryData';
import * as userDataActionCreators from 'redux/modules/userData';
import {DataPublicApi} from 'api';

import PieGet from './PieGet';
import PieUse from './PieUse';

@cardable(['类目数据分析'])
@connect(
  ({CategoryData,userData}) => ({
    categoryUse: CategoryData.categoryUse,
    categoryGet: CategoryData.categoryGet,
    topData:userData.topData,
  }),
  dispatch => bindActionCreators({...CategoryDataActionCreators,...userDataActionCreators}, dispatch)
)

export default class CategoryData extends Component {
  static propTypes = {
    categoryUse: PropTypes.object.isRequired,
    categoryGet: PropTypes.object.isRequired,
    topData: PropTypes.object.isRequired,
  }

  state = {
    topData: {getcnt:'0',getusers:'0',usecnt:'0',useusers:'0',usepers:'0'}
  }
 async componentDidMount() {
   const { form } = this.props;
   const categoryUse = await this.props.handleCategoryUse();
   const categoryGet = await this.props.handleCategoryGet();
   const topData = await this.props.handleTopData();
   DataPublicApi.queryReportTopData()
       .then(topData => {
           this.setState({topData,loading: false})
       })
 }

    render() {
    const {  RangePicker } = DatePicker;
    const { activeList,categoryUse,categoryGet } = this.props;
    const { topData,loading } = this.state;
        return (
          <div className={styles.container}>
                <ActivityCategory dataSource={activeList}/>
                <div>
                  <div className={styles.body}>
                      <div className={styles.title}>数据概要</div>
                      {/*<p className={styles.center}>选择品牌、品类、单品</p>
                      <ul className={styles.float}>
                        <li>品牌名称：<Cascader placeholder="请选择品牌名称" size="small"></Cascader></li>
                        <li>品类名称：<Cascader placeholder="请选择品类名称" size="small"></Cascader></li>
                        <li>单品名称：<Cascader placeholder="请选择单品名称" size="small"></Cascader></li>
                        <li><Button type="primary" size="small">查询</Button></li>
                        <li><Button size="small">重置</Button></li>
                      </ul>*/}
                      <Spin spinning={loading}>
                        <ul className={styles.flex}>
                          <li>
                            <div>
                              <p>领券数量</p>
                              <p>{topData.getcnt}</p>
                            </div>
                          </li>
                          <li>
                            <div>
                              <p>领券人数</p>
                              <p>{topData.getusers}</p>
                            </div>
                          </li>
                          <li>
                            <div>
                              <p>核销数量</p>
                              <p>{topData.usecnt}</p>
                            </div>
                          </li>
                          <li>
                            <div>
                              <p>核券人数</p>
                              <p>{topData.useusers}</p>
                            </div>
                          </li>
                          <li>
                            <div>
                              <p>核销率</p>
                              <p>{topData.usepers}</p>
                            </div>
                          </li>
                        </ul>
                      </Spin>
                  </div>
                </div>
                <div className={styles.body}>
                  <div className={styles.title}>单品数据</div>
                    <Spin spinning={loading}>
                      <ul className={styles.float1}>
                        <li style={{height:'500px'}}>
                            <p>领券数据</p>
                            <PieGet dataSourceGet={categoryGet}/>
                        </li>
                        <li style={{height:'500px'}}>
                            <p>核券数据</p>
                            <PieUse dataSourceUse={categoryUse}/>
                        </li>
                      </ul>
                    </Spin>
                </div>
                {/*<div>
                  <div className={styles.body}>
                      <div className={styles.title}>品牌商数据</div>
                      <p className={styles.center}>品牌商数据</p>
                        <ul className={styles.minHeigh+" "+styles.flex}>
                          <li>
                            <div className={styles.tab}>
                              <span>领券量</span>
                              <span>核券量</span>
                              <ChartsCategory/>
                            </div>
                          </li>
                          <li>
                            <div className={styles.tab}>
                              <span>销售额</span>
                              <span>复购率</span>
                              <span>客单价</span>
                            </div>
                            <ul className={styles.leftSize+" "+styles.flex}>
                              <li><span>60%</span>平均覆盖率</li>
                              <li><span>3,000</span>平均客流量</li>
                            </ul>
                            <Columnar/>
                          </li>
                        </ul>
                      </div>
                      <div className={styles.body}>
                          <div className={styles.title}>品类数据分析</div>
                          <p className={styles.center}>品类数据分析</p>
                            <ul className={styles.minHeigh+" "+styles.flex}>
                              <li>
                                <div className={styles.tab}>
                                  <span>领券量</span>
                                  <span>核券量</span>
                                  <ChartsCategory2/>
                                </div>
                              </li>
                              <li>
                                <div className={styles.tab}>
                                  <span>销售额</span>
                                  <span>复购率</span>
                                  <span>客单价</span>
                                </div>
                                <ul className={styles.leftSize+" "+styles.flex}>
                                  <li><span>60%</span>平均覆盖率</li>
                                  <li><span>3,000</span>平均客流量</li>
                                </ul>
                                <Columnar2/>
                              </li>
                            </ul>
                          </div>
                          <div className={styles.body}>
                              <div className={styles.title}>单品数据分析</div>
                              <p className={styles.center}>单品数据分析</p>
                                <ul className={styles.minHeigh+" "+styles.flex}>
                                  <li>
                                    <div className={styles.tab}>
                                      <span>领券量</span>
                                      <span>核券量</span>
                                      <ChartsCategory3/>
                                    </div>
                                  </li>
                                  <li>
                                    <Coupon/>
                                  </li>
                                </ul>
                              </div>
                </div>*/}

          </div>
        )
    }
}
