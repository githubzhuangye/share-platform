import React, {PropTypes, Component} from 'react';
import {
    Form,
    Row,
    Col,
    Select,
    DatePicker,
    Button
} from 'antd';
import { generateOptions, generateOptionsByTime } from 'helpers/util';
import * as styles from './styles.css';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
let firstVal = 0;

export default class ActivitySelection extends Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        activeList: PropTypes.array.isRequired,
        starttime: PropTypes.string.isRequired,
        endtime: PropTypes.string.isRequired
    }

    disabledDate(current) {
      const { starttime,endtime } = this.props;
      let _s = starttime.replace(/-/g,'/');
      let _e = endtime.replace(/-/g,'/');

      let st = new Date(_s);
      let et = new Date(_e);

      let start = st.getTime();
      let end = et.getTime();

      return current && current.valueOf() > end || current.valueOf() < start;
    }
    render() {
        const {
            form,
            activeList,
            activityFieldName = 'activeId',
            onListChange,
            onDateChange,
            starttime,
            endtime,
        } = this.props;
        const { getFieldDecorator } = form;
        const activityFieldDecorator = getFieldDecorator(activityFieldName, {
            initialValue: activeList.length > 0
                ? `${activeList[0].name}_${activeList[0].activeid}_${activeList[0].starttime.split(' ')[0]}_${activeList[0].endtime.split(' ')[0]}_${activeList[0].status}`
                : undefined,
            onChange: onListChange,
            rules: [
                {
                    required: true,
                    message: '请选择活动'
                }
            ]
        });

        const rangeConfig = {
            initialValue: activeList.length > 0
                ? [
                    moment(starttime, 'YYYYMMDD'),
                    moment(endtime, 'YYYYMMDD')
                ]
                : undefined,
            onChange: onDateChange,

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
                <Col offset={1} span={2} style={{
                    lineHeight: '20px'
                }}>活动名称:</Col>
                <Col span={4} style={{
                    marginTop: '-5px'
                }}>
                    <FormItem>
                        {activityFieldDecorator(
                            <Select size="large" size="small" placeholder="请选择活动名称" style={{
                                width: '100%'
                            }} allowClear={false}>
                                {generateOptionsByTime(activeList, 'activeid', 'starttime', 'endtime', 'status', 'name')}
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={2} offset={1} style={{
                    lineHeight: '20px'
                }}>数据时间:</Col>
                <Col span={6} style={{
                    marginTop: '-5px'
                }}>
                    <FormItem>
                        {getFieldDecorator('dateTime', rangeConfig)
                          (<RangePicker
                            disabledDate={:: this.disabledDate}
                            ranges={{
                            Today: [
                                moment(), moment()
                            ],

                            'This Month': [moment(), moment().endOf('month')]
                        }} size="small" allowClear={false}/>)}
                    </FormItem>
                </Col>
            </div>
        );
    }
}
