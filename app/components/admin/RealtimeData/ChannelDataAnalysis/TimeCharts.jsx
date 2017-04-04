import React, {Component, PropTypes} from 'react';
import {Row, Col, Tabs, Spin} from 'antd';
import * as styles from './styles.css';

import {realDataApi} from 'api';

import DataPVUV from '../Charts/DataPVUV';
import DataCoupon from '../Charts/DataCoupon';
import DataPeople from '../Charts/DataPeople';
import Datafunnel from '../Charts/Datafunnel';

import TabCharts from '../UserData/TabCharts';

const TabPane = Tabs.TabPane;

export default class TimeCharts extends Component {

    static propTypes = {
        dataSource: PropTypes.shape({day: PropTypes.array, pv: PropTypes.array, uv: PropTypes.array}).isRequired,
        chartsVal : PropTypes.object.isRequired,
    }
    static defaultProps = {
        dataSource: {day: [3], pv: [3], uv: [3]},
        chartsVal : {},
        funnelData : { uuse: '30' , uget: '40' , uv: '30' }
    }
    state = {
        type : 'pvuv',
        pvuvData: { day: [3], pv: [3], uv: [3]},
        couponData: { day: [3], cget: [3], cuse: [3]},
        userData: { day: [3], uget: [3], uuse: [3]},
        info : 'day',
        def : styles.defIcon,
        act : styles.actIcon
    }

    callback(key) {
        this.setState({type : key});
        const {chartsVal} = this.props;
        const {info} = this.state;
        chartsVal.type = key;
        chartsVal.dataformat = info;

        console.log(chartsVal);

        realDataApi.dataCurve(chartsVal)
            .then(data => {
              if (key == 'pvuv') {
                  this.setState({pvuvData: data.pvuvData})
              } else if (key == 'coupon') {
                  this.setState({couponData: data.couponData})
              } else if (key == 'user') {
                  this.setState({userData: data.userData})
              }
            })
            .catch(e => console.log(e));
    }

    timeChartsClick(ev,idx){
        if (idx == 'time') {
            this.setState({info : 'time',def : styles.actIcon,act : styles.defIcon});
        } else {
            this.setState({info : 'day', def : styles.defIcon,act : styles.actIcon});
        }

        const {type} = this.state;
        const {chartsVal} = this.props;
        chartsVal.dataformat = idx;

        console.log(chartsVal);

        realDataApi.dataCurve(chartsVal)
            .then(data => {
              if (type == 'pvuv') {
                  this.setState({pvuvData: data.pvuvData})
              } else if (type == 'coupon') {
                  this.setState({couponData: data.couponData})
              } else if (type == 'user') {
                  this.setState({userData: data.userData})
              }
            })
            .catch(e => console.log(e));
    }
    render() {

        const {type,def,act} = this.state;
        return (
            <div>
                <Spin spinning={this.props.loading}>
                  <Tabs defaultActiveKey="all" className={styles.pvuv}>
                    <TabPane tab="所有" key="all" className={styles.tab}>
                      <TabCharts/>
                    </TabPane>
                    <TabPane tab="会花" key="huihua" className={styles.tab}>
                      <TabCharts/>
                    </TabPane>
                    <TabPane tab="品牌商公众号" key="pinpai" className={styles.tab}>
                      <TabCharts/>
                    </TabPane>
                    <TabPane tab="零售商公众号" key="lingshou" className={styles.tab}>
                      <TabCharts/>
                    </TabPane>
                    <TabPane tab="线下物料" key="xianxia" className={styles.tab}>
                      <TabCharts/>
                    </TabPane>
                    <TabPane tab="支付宝卡包" key="zhifubao" className={styles.tab}>
                      <TabCharts/>
                    </TabPane>
                  </Tabs>

                </Spin>

            </div>
        )
    }
}
