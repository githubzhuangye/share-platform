import React, {PropTypes, Component} from 'react';
import { Form, Row, Col, Select, DatePicker, Button} from 'antd';
import {generateOptions, generateOptionsByTime} from 'helpers/util';
import * as styles from './styles.css';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as realDataActionCreators from 'redux/modules/realData';
import { DataPublicApi } from 'api';
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
let firstVal = 0;


@connect(
  ({realData}) => ({
    activityList: realData.activityList,
  }),
  dispatch => bindActionCreators(realDataActionCreators, dispatch)
)
@Form.create()
export default class ActivityUse extends Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        activeFieldName: PropTypes.string
    }
    state = {
        loading: false,
        hideEle: 'none',
        chartsVal : {},
        starttime: '',
        endtime: '',
    }

    componentDidMount() {
      firstVal = 0;
      const activityList = this.props.handleFetchActivityList();
    }

    handleSelectChange(v){
      let starttime = v.split('_')[1];
      let endtime = v.split('_')[2];
      let status = v.split('_')[3];
      this.setState({starttime: starttime,endtime: endtime});
    }

    disabledDate(current) {
      const {starttime,endtime} = this.state;

      let _s = starttime.replace('-','/');
      let _e = endtime.replace('-','/');

      let _st = new Date(_s);
      let _et = new Date(_e);

      let start = _st.getTime();
      let end = _et.getTime();
      return current && current.valueOf() > end || current.valueOf() < start;
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
                // 'type'       : 'pvuv',
                'dataformat' : 'day'
            };

            this.setState({loading: true,chartsVal: dataChartsVal});

            DataPublicApi.CategoryData(values)
                .then(CategoryData => {
                    this.setState({CategoryData})
                    console.log(this.state.CategoryData);
                 })
                    .catch(e => console.log(e));
            form.resetFields(['dateTime']);

        });
    };
    componentWillReceiveProps(nextProps) {
      ++firstVal;
      if (firstVal === 1) {
          this.setState({starttime: nextProps.activityList[0].starttime,endtime: nextProps.activityList[0].endtime});
      }
    }
    render() {
        const { form, activityList, activityFieldName = 'activeId' } = this.props;
        const {getFieldDecorator} = form;
        const activityFieldDecorator = getFieldDecorator(activityFieldName, {
            initialValue: activityList.length > 0 ? `${activityList[0].activeid}_${activityList[0].starttime.split(' ')[0]}_${activityList[0].endtime.split(' ')[0]}_${activityList[0].status}` : undefined,
            onChange: ::this.handleSelectChange,
            rules: [
                {
                    required: true,
                    message: '请选择活动'
                }
            ]
        });

        const rangeConfig = {
            initialValue: activityList.length > 0 ? [moment(this.state.starttime, 'YYYYMMDD'), moment(this.state.endtime, 'YYYYMMDD')] : undefined,
            rules: [
                {
                    type: 'array',
                    required: true,
                    message: '请选择时间'
                }
            ]
        }

        return (
            <div>
                <Col offset={1} span={2} style={{ lineHeight: '20px' }}>活动名称:</Col>
                <Col span={4} style={{ marginTop: '-5px' }}>
                    <FormItem>
                        {activityFieldDecorator(
                            <Select size="large" size="small" placeholder="请选择活动名称" style={{
                                width: '100%'
                            }} allowClear>

                                {generateOptionsByTime(activityList, 'activeid', 'starttime', 'endtime', 'status', 'name')}
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={2} offset={1} style={{ lineHeight: '20px' }}>数据时间:</Col>
                <Col span={6} style={{ marginTop: '-5px' }}>
                    <FormItem>
                        {getFieldDecorator('dateTime', rangeConfig)(<RangePicker disabledDate={:: this.disabledDate} ranges={{
                            Today: [
                                moment(), moment()
                            ],
                            'This Month': [moment(), moment().endOf('month')]
                        }} size="small" allowClear={false}/>)}
                    </FormItem>
                </Col>
                <Col span={6} style={{
                    marginTop: '-5px',marginLeft:'70px'
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
            </div>
        );
    }
}
