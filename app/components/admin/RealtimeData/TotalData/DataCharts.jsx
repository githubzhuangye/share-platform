import React, {Component, PropTypes} from 'react';
import {Row, Col, Tabs, Spin} from 'antd';
import * as styles from './styles.css';

import {realDataApi} from 'api';

import DataPVUV from '../Charts/DataPVUV';
import DataCoupon from '../Charts/DataCoupon';
import DataPeople from '../Charts/DataPeople';
import Datafunnel from '../Charts/Datafunnel';

const TabPane = Tabs.TabPane;

export default class DataCharts extends Component {

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
                <p className={styles.modelTitle}>数据走势图</p>
                <Spin spinning={this.props.loading}>
                    <div className={styles.modelWrap}>
                        <div className={styles.iconCharts}>
                            <span className={def} onClick={(ev,idx) => {this.timeChartsClick(ev,'time')}}>时</span>
                            <span className={act} onClick={(ev,idx) => {this.timeChartsClick(ev,'day')}}>日</span>
                        </div>
                        <Tabs defaultActiveKey="pvuv" onChange={:: this.callback} type='card'>
                            <TabPane tab="pv/uv" key="pvuv">
                                <DataPVUV dataSource={this.props.dataSource}/>
                            </TabPane>
                            <TabPane tab="领核券数" key="coupon">
                                <DataCoupon dataSource={this.state.couponData}/>
                            </TabPane>
                             <TabPane tab="领核券人数" key="user">
                                <DataPeople dataSource={this.state.userData}/>
                            </TabPane>
                        </Tabs>
                    </div>
                </Spin>

                <p className={styles.modelTitle}>核销转化率</p>

                <Spin spinning={this.props.loading}>
                    <div className={styles.modelWrap}>
                        <Datafunnel funnelData={this.props.funnelData}/>
                    </div>
                </Spin>

            </div>
        )
    }
}
