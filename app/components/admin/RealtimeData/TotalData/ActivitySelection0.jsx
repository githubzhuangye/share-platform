import React, {PropTypes, Component} from 'react';
import { Form, Row, Col, Select, DatePicker, Button} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as realDataActionCreators from 'redux/modules/realData';
import {realDataApi} from 'api';
import EventEmitter from 'helpers/event';
import {generateOptions, validateFields} from 'helpers/util';
import * as styles from './styles.css';
import moment from 'moment';
import PvUvData from '../TotalData/PvUvData';
import DataCharts from '../TotalData/DataCharts';

const LOADED_ACTIVITY_LIST = 'LOADE_ACTIVITY_LIST';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

@connect(({realData}) => ({activityList: realData.activityList}), dispatch => bindActionCreators(realDataActionCreators, dispatch))
@Form.create()
export default class ActivitySelection extends Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        activityList: PropTypes.array.isRequired,
        handleFetchActivityList: PropTypes.func.isRequired,
        activityFieldName: PropTypes.string
    }

    isEmptyObject(obj) { //判断是否为一个空对象
        for (var key in obj) {
            return false
        };
        return true
    };

    state = {
        loading: false,
        dataSource: {
          pv: "0", pvp: "0", uv: "0", uvp: "0", cget: "0", cgetp: "0", uget: "0", ugetp: '0', cuse: '0', cusep: '0', uuse: '0', uusep: '0'},
        hideEle: 'none',
        pvuvData: { day: [3], pv: [3], uv: [3] },
        chartsVal : {},
        dataFunnel : { uuse: '30' , uget: '40' , uv: '30' }
    }

    async componentDidMount() {
        const activityList = await this.props.handleFetchActivityList();
        // 每次列表加载后，如果活动列表不为空，主动触发一次报表查询
          console.error(activityList)
        if (activityList.length) {
            EventEmitter.emit(LOADED_ACTIVITY_LIST);
        }
    }
    handleActivityChange(value) {
        // TODO: 清除活动下拉框时，提示问题
        const {form} = this.props;
        if (!value) { // 清除选项时，不进行新的门店拉取
            form.resetFields();
            return;
        }
    }
    onChangeSelect(dates, dateStrings) {
        const {form} = this.props;
    }

    handleSearch(e) {
        e.preventDefault();
        const {form} = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            // Should format date value before submit.
            const rangeTimeValue = fieldsValue['dateTime'];
            const activeIdValue = fieldsValue['activeId'];
            const values = {
                'activeId' : activeIdValue,
                'starttime': rangeTimeValue[0].format('YYYY-MM-DD'),
                'endtime'  : rangeTimeValue[1].format('YYYY-MM-DD')
            };

            const dataChartsVal = {
                'activeId'   : activeIdValue,
                'starttime'  : rangeTimeValue[0].format('YYYY-MM-DD'),
                'endtime'    : rangeTimeValue[1].format('YYYY-MM-DD'),
                'type'       : 'pvuv',
                'dataformat' : 'day'
            };

            this.setState({loading: true,chartsVal: dataChartsVal});
            realDataApi.dataOverview(values)
                .then(dataSource => {
                    if(typeof(dataSource.pvp) !=="undefined"){
                        this.setState({hideEle: 'block'});
                    }
                    this.setState({dataSource,loading: false})
                })
                .catch(e => console.log(e));

            realDataApi.dataFunnel(values)
                .then(dataFunnel => {
                    this.setState({dataFunnel})
                    console.log(this.state.dataFunnel);
                })
                .catch(e => console.log(e));

            realDataApi.dataCurve(dataChartsVal)
                .then(data => {
                    this.setState({pvuvData: data.pvuvData})
                })
                .catch(e => console.log(e));
        });

    }
    render() {
        const {
            form,
            activityList,
            activityFieldName = 'activeId'
        } = this.props;
        const {getFieldDecorator} = form;
        const dataProps = {...this.state.dataSource};
        const chartsProps = {...this.state.pvuvData};
        const { loading, hideEle, chartsVal, dataFunnel } = this.state;

        const activityFieldDecorator = getFieldDecorator(activityFieldName, {
            initialValue: activityList.length > 0
                ? activityList[0].activeId
                : undefined,
            onChange: :: this.handleActivityChange,
            rules: [
                {
                    required: true,
                    message: '请选择活动'
                }
            ]
        });
        const rangeConfig = {
            onChange: :: this.onChangeSelect,
            rules: [
                {
                    type: 'array',
                    required: true,
                    message: '请选择时间'
                }
            ]
        };
        return (
            <div>
                <div className={styles.dateSelecter}>
                    <Form>
                        <Row>
                            <Col offset={1} span={2} style={{
                                lineHeight: '20px'
                            }}>
                                活动名称:
                            </Col>
                            <Col span={4} style={{
                                marginTop: '-5px'
                            }}>
                                <FormItem>
                                    {activityFieldDecorator(
                                        <Select size="large" size="small" placeholder="请选择活动名称" style={{
                                            width: '100%'
                                        }} allowClear>
                                            {generateOptions(activityList, 'activeId', 'name')}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={2} offset={1} style={{
                                lineHeight: '20px'
                            }}>
                                数据时间:
                            </Col>
                            <Col span={6} style={{
                                marginTop: '-5px'
                            }}>
                                <FormItem>
                                    {getFieldDecorator('dateTime', rangeConfig)(<RangePicker ranges={{
                                        Today: [
                                            moment(), moment()
                                        ],
                                        'This Month': [moment(), moment().endOf('month')]
                                    }} size="small"/>)}
                                </FormItem>
                            </Col>
                            <Col span={6} style={{
                                marginTop: '-5px'
                            }}>
                                <FormItem>
                                    <Button type="primary" size="small" onClick={:: this.handleSearch}>查询</Button>
                                    &nbsp;&nbsp;&nbsp;
                                    <Button size="small">重置</Button>
                                    <span style={{
                                        display: 'none'
                                    }} className={styles.downLoadBtn}>下载报表</span>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>

                <PvUvData loading={loading} {...dataProps} hideEle={hideEle} />

                <DataCharts loading={loading} dataSource={chartsProps} funnelData={dataFunnel} chartsVal={chartsVal} />

            </div>
        );
    }
}
