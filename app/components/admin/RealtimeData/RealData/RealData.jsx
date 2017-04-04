import React, {Component, PropTypes} from 'react';
import echarts from 'echarts';
import moment from "moment";
import {Form, Spin, Select, Row, Col} from 'antd';
import * as styles from './styles.css';
import {realData} from 'api/realData';
import {cardable} from 'hoc';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as realDataActionCreators from 'redux/modules/realData';
import {generateOptions} from 'helpers/util';
import {SubAndRestBtns} from 'components/admin/RealtimeData';
const FormItem = Form.Item;
const Option = Select.Option;

@cardable(['实时直播'])

@connect(({realData}) => ({activityList: realData.activityList}), dispatch => bindActionCreators(realDataActionCreators, dispatch))
@Form.create()
export default class RealData extends Component {
    state = {
        dataSource: {}
    }
    isEmptyObject(obj) { //判断是否为一个空对象

        for (var key in obj) {
            return false
        };
        return true
    };
    async componentDidMount() {

        const activityList = await this.props.handleFetchActivityList();

        var gethourcountArr = []; //用户领券数组
        var usehourcountArr = []; //用户核销数组
        var timeArr = []; //时间刻度
        // realData(activityList[0].name).then(res => {
        realData('2-3月女王季奖券').then(res => {
            if (this.isEmptyObject(res.data)) {
                this.setState({
                    dataSource: {
                        "data": "nodata"
                    }
                })
            } else {
                this.setState({
                    dataSource: res.data
                }, function() {
                    const {dataSource} = this.state;
                    for (var i in dataSource.getbyhour) {
                        gethourcountArr.push(dataSource.getbyhour[i].gethourcount);
                        timeArr.push(dataSource.getbyhour[i].hour);
                    }
                    for (var i in dataSource.usebyhour) {
                        usehourcountArr.push(dataSource.usebyhour[i].usehourcount)
                    }
                })

                const myChart = echarts.init(this._dom);
                const option = {
                    title: {
                        text: '实时核销领券曲线图',
                        textStyle: {
                            fontSize: 14,
                            fontWeight: 'normal',
                            color: '#333' // 主标题文字颜色
                        }
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['实时领券数', '实时核销数']
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            restore: {
                                show: true
                            },
                            saveAsImage: {
                                show: true
                            }
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: timeArr
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}千'
                        }
                    },
                    series: [
                        {
                            name: '实时领券数',
                            type: 'line',
                            data: gethourcountArr,
                            markPoint: {
                                data: [
                                    {
                                        type: 'max',
                                        name: '最大值'
                                    }, {
                                        type: 'min',
                                        name: '最小值'
                                    }
                                ]
                            },
                            markLine: {
                                data: [
                                    {
                                        type: 'average',
                                        name: '平均值'
                                    }
                                ]
                            }
                        }, {
                            name: '实时核销数',
                            type: 'line',
                            data: usehourcountArr,
                            markPoint: {
                                data: [
                                    {
                                        type: 'max',
                                        name: '最大值'
                                    }, {
                                        type: 'min',
                                        name: '最小值'
                                    }
                                ]
                            },
                            markLine: {
                                data: [
                                    {
                                        type: 'average',
                                        name: '平均值'
                                    }
                                ]
                            }
                        }
                    ]
                };
                myChart.setOption(option);
            }
        })
    }

    handleSelectChange(v) {
        realData(v).then(res => {
            if (this.isEmptyObject(res.data)) {
                this.setState({
                    dataSource: {
                        "data": "nodata"
                    }
                })
            } else {
                this.setState({dataSource: res.data})
            }
        })
    }

    render() {

        const {
            activityList,
            form,
            activityFieldName = 'activeId'
        } = this.props;
        const {dataSource} = this.state;
        const {getFieldDecorator} = form;
        const activityFieldDecorator = getFieldDecorator(activityFieldName, {
            initialValue: activityList.length > 0
                ? activityList[0].name
                : undefined,
            onChange: :: this.handleSelectChange,
            rules: [
                {
                    required: true,
                    message: '请选择活动'
                }
            ]
        });

        if (this.isEmptyObject(dataSource)) { //是空对象
            return (
                <div className={styles.container}>
                    <Row>
                        <Col offset={7} span={2} style={{
                            lineHeight: '20px',
                            fontSize: '12px'
                        }}>活动名称:</Col>
                        <Col span={5} style={{
                            marginTop: '-2px',
                            marginRight: '20px',
                            marginBottom: '20px'
                        }}>
                            <Form>
                                {activityFieldDecorator(
                                    <Select size="large" size="small" placeholder="请选择活动名称" style={{
                                        width: '100%'
                                    }} allowClear>

                                        {generateOptions(activityList, 'name', 'name')}
                                    </Select>
                                )}
                            </Form>
                        </Col>
                    </Row>

                    <div className={styles.loading}>
                        <Spin/>
                    </div>
                </div>
            )
        } else {
            if (dataSource.data == "nodata") {
                return (
                    <div className={styles.container}>
                        <Row>
                            <Col offset={7} span={2} style={{
                                lineHeight: '20px',
                                fontSize: '12px'
                            }}>活动名称:</Col>
                            <Col span={5} style={{
                                marginTop: '-2px',
                                marginRight: '20px',
                                marginBottom: '20px'
                            }}>
                                <Form>
                                    {activityFieldDecorator(
                                        <Select size="large" size="small" placeholder="请选择活动名称" style={{
                                            width: '100%'
                                        }} allowClear>

                                            {generateOptions(activityList, 'name', 'name')}
                                        </Select>
                                    )}
                                </Form>
                            </Col>
                        </Row>

                        <div className={styles.loading}>
                            暂无数据
                        </div>
                    </div>
                )
            } else {
                return (
                    <div className={styles.container}>

                        <Row>
                            <Col offset={7} span={2} style={{
                                lineHeight: '20px',
                                fontSize: '12px'
                            }}>活动名称:</Col>
                            <Col span={5} style={{
                                marginTop: '-2px',
                                marginRight: '20px',
                                marginBottom: '20px'
                            }}>
                                <Form>
                                    {activityFieldDecorator(
                                        <Select size="large" size="small" placeholder="请选择活动名称" style={{
                                            width: '100%'
                                        }} allowClear>

                                            {generateOptions(activityList, 'name', 'name')}
                                        </Select>
                                    )}
                                </Form>
                            </Col>
                        </Row>

                        <div className={styles.content}>
                            <div className={styles.logo}>米雅数据看板</div>
                            <div className={styles.updateTime}>
                                数据截至：{moment().format('YYYY-MM-DD H:mm:ss')}
                            </div>
                            <div className={`${styles.topRange} ${styles.rangeLeft}`}>
                                <div className={styles.rangeTitle}>
                                    TOP渠道/核券数(占比)
                                </div>
                                <ul>
                                    {dataSource.useCoupTotalCountByChannelTop5.map((value, index) => <li>
                                        <span>
                                            <em>{index + 1}</em>
                                            {value.channel}</span>
                                        <span>{value.count}</span>
                                    </li>)}
                                </ul>
                                <div className={`${styles.rangeTitle} ${styles.rangeTitleTop}`}>
                                    TOP单品/核券占比
                                </div>
                                <ul>
                                    {dataSource.useCoupTotalCountByGoodsTop5.map((value, index) => <li>
                                        <span>
                                            <em>{index + 1}</em>
                                            {value.goods}</span>
                                        <span>{value.count}</span>
                                    </li>)}
                                </ul>
                            </div>
                            <div className={styles.totalStatistic}>
                                <div className={styles.title}>今日核券数</div>
                                <div className={styles.count}>
                                    {dataSource.CoupleTotal.usecoupon}
                                </div>
                                <div className={styles.detail}>
                                    <p>
                                        <span>{dataSource.CoupleTotal.getcoupon}</span>
                                        <span>今日领券数
                                        </span>
                                    </p>
                                    <p>
                                        <span>{dataSource.couponMemberTotal.usecoupon}</span>
                                        <span>今日核券用户</span>
                                    </p>
                                    <p>
                                        <span>{dataSource.couponMemberTotal.getcoupon}</span>
                                        <span>今日领券用户</span>
                                    </p>
                                </div>
                                <div>
                                    <div ref={dom => this._dom = dom} className={styles.echartsContainer}></div>
                                </div>
                            </div>
                            <div className={`${styles.topRange} ${styles.topRight}`}>
                                <div className={styles.rangeTitle}>
                                    TOP城市/核券占比
                                </div>
                                <ul>
                                    {dataSource.useCoupTotalCountByCityTop5.map((value, index) => <li>
                                        <span>
                                            <em>{index + 1}</em>
                                            {value.cityname}</span>
                                        <span>{value.count}</span>
                                    </li>)}
                                </ul>
                                <div className={`${styles.rangeTitle} ${styles.rangeTitleTop}`}>
                                    TOP门店/核券占比
                                </div>
                                <ul>
                                    {dataSource.useCoupTotalCountBySaasAndMarketTop5.map((value, index) => <li>
                                        <span>
                                            <em>{index + 1}</em>
                                            {value.saasandmarket}</span>
                                        <span>{value.count}</span>
                                    </li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                )
            }
        }
    }
}
