import React, {PropTypes} from 'react';
import {Row, Col, DatePicker, Radio, Button,Form,Select} from 'antd';
import moment from 'moment';
import {TODAY, POINTDAY} from 'helpers/util';
const RangePicker = DatePicker.RangePicker;
const RadioGroup = Radio.Group;
const Option = Select.Option;

export default function DataSelect({activeList,onDateChange, onSubmit,onActiveChange,disabledDate}) {
  const FormItem = Form.Item;
  const options = activeList.map((item,index) =>
    <Option key={index} value={`${item.activeid},${item.starttime},${item.endtime},${item.name}`}>
      {item.name}
    </Option>);
    return (
        <div>
            <Col offset={1} span={2} style={{ lineHeight: '35px' }}>活动名称:</Col>
            <Col span={4}>
                <FormItem>
                        <Select size="small"
                         allowClear
                         placeholder="请选择活动名称"
                         style={{
                            width: '100%'
                        }} onChange={onActiveChange} filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                          {options}
                        </Select>
                </FormItem>
            </Col>
            <Col span={2} offset={1} style={{ lineHeight: '35px' }}>数据时间:</Col>
            <Col span={6}>
              <RangePicker style={{
                  width: '180px',
                  position: 'absolute',
                  top: '4px',
                  right: '60px',
              }} format="YYYYMMDD" onChange={onDateChange} disabledDate={disabledDate} ranges={{
                  Today: [
                      moment(), moment()
                  ],
                  'This Month': [moment(), moment().endOf('month')]
              }} size='small'  allowClear={false}/>
            </Col>
            <Col span={6} style={{
              marginLeft:'70px'
            }}>
                <FormItem>
                    <Button type="primary" size="small" onClick={onSubmit}>查询</Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button size="small">重置</Button>
                </FormItem>
            </Col>
        </div>
    )
}
