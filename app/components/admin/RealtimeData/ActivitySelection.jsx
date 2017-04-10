import React, {PropTypes, Component} from 'react';
import { Form, Row, Col, Select, DatePicker, Button} from 'antd';
import {generateOptions, generateOptionsByTime} from 'helpers/util';
import * as styles from './styles.css';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
let firstVal = 0;
export default class ActivitySelection extends Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        activityList: PropTypes.array.isRequired,
        activityFieldName: PropTypes.string
    }

    state = {
        loading: false,
        dataSource: {
          pv: "0", pvp: "0", uv: "0", uvp: "0", cget: "0", cgetp: "0", uget: "0", ugetp: '0', cuse: '0', cusep: '0', uuse: '0', uusep: '0'},
        hideEle: 'none',
        pvuvData: { day: [3], pv: [3], uv: [3] },
        chartsVal : {},
        dataFunnel : { uuse: '0' , uget: '0' , uv: '0' },
        starttime: '',
        endtime: '',
    }

    handleSelectChange(v){
      let starttime = v.split('_')[1];
      let endtime = v.split('_')[2];
      let status = v.split('_')[3];
      this.setState({starttime: starttime,endtime: endtime});
      console.info(starttime)
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

    componentDidMount(){
      firstVal = 0;
    }

    componentWillReceiveProps(nextProps) {
      ++firstVal;
      if (firstVal === 1) {
          if (nextProps.activityList[0]) {
            this.setState({starttime: nextProps.activityList[0].starttime,endtime: nextProps.activityList[0].endtime});
            return;
          }
      }
    }

    render() {
        const { form, activityList, activityFieldName = 'activeId' } = this.props;
        const {getFieldDecorator} = form;
        const { loading, hideEle, chartsVal, dataFunnel } = this.state;
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
        };
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
            </div>
        );
    }
}
