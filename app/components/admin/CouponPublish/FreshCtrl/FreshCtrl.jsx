import React, { PropTypes, Component }  from 'react';
import { Input, Form, Select, TimePicker, Button } from 'antd';
import moment from 'moment';
import styles from './styles.css';
import * as validators from '../PublishForm/validator.js';

const FormItem = Form.Item;
const Option = Select.Option;

function parseTimeToNumber(str) {
  let arr = str.split(':').map(Number)
  return arr[2] + arr[1] * 60 + arr[0] * 60 * 60
}

function compareTime(t1, t2) {
  return parseTimeToNumber(t1) < parseTimeToNumber(t2)
}

export default class FreshCtrl extends Component {
  state = {
    values: this.props.value,
    errors: []
  }

  remove(index) {
    const {values} = this.state;
    values.splice(index, 1);
    this.setState({
      values: values
    });
    this.props.onChange(values)
  }

  add() {
    const {values} = this.state;
    values.push({
      "active_start": null,
      "active_end": null,
      "discount": "",
      "discount_limit": "",
      "type": "2",
      "top": 0,
      "tip": ""
    })
    this.setState({ values: values });
    this.props.onChange(values);
  }
  startChange(index, date) {
    var {values} = this.state;
    var end = values[index].active_end;
    values[index].active_start = date;
    if (end) {
      end < date ? values[index].tip = "开始时间不能大于结束时间！" : values[index].tip = ""
    }
    this.setState({
      values: values
    });
    this.props.onChange(values);
    this.validate(1);
  }

  endChange(index, date) {
    var {values} = this.state;
    var start = values[index].active_start;
    values[index].active_end = date;
    if (start) {
      start > date ? values[index].tip = "开始时间不能大于结束时间！" : values[index].tip = ""
    }
    this.setState({
      values: values
    });
    this.props.onChange(values);
    this.validate();
  }

  selectChange(index, value) {
    const { values } = this.state;
    values[index].type = value;
    values[index].top = value == 2 ? 0 : 10;
    this.setState({
      values: values
    });
    this.props.onChange(values);
  }

  discountChange(index, value) {
    const { values } = this.state;
    values[index].discount = value;
    this.setState({
      values: values
    });
    this.props.onChange(values);
    this.validate(1);
  }

  limitChange(index, value) {
    const { values } = this.state;
    values[index].discount_limit = value;
    this.setState({
      values: values
    });
    this.props.onChange(values);
    this.validate(1);
  }


  componentWillReceiveProps (nextProps){
    this.setState({
      values:nextProps.value,
    });
  }
  validate(tag) {
    const {values} = this.state
    let errors = values.map((period, index) => {
      //TODO 如果有任何一个字段为空，都是空
      if (!period.active_start || !period.active_end || (period.type === '1' && (!period.discount || !period.discount_limit) || (period.type === '2' && !period.discount))) {
        return '请完善区间优惠'
      }
      //TODO 起始时间不能小于结束时间
      if (period.active_start > period.active_end) {
        return '起始时间不能大于结束时间'
      }
      //TODO 如果是折扣模式，必须是1-10,小数点一位
      if (period.type === '2') {
        if (period.discount.split('.').length > 1 && period.discount.split('.')[2].length > 1) {
          return '折扣小数点后不能超过一位'
        }
        let discount = Number(period.discount)
        if (discount > 10 || discount < 0) {
          return '折扣数应在0到10之间'
        }
      }
      //TODO 如果是满减x-y>0
      if (period.type === '1') {
        if (Number(period.discount_limit) < Number(period.discount)) {
          return '折扣金额不能超过消费额'
        }
      }
    })
    if(tag==1){
      this.setState({ errors });
    }else{
      this.setState({ errors:[] });
    }

    return errors
  }

  render() {
    const { values, errors } = this.state;
    const { form } = this.props;
    const { getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    };

    const formItems = values.map((value, index) => {
      return (
        <Form.Item {...formItemLayout}
          label={`区间优惠${index + 1}：`}
          required
          help={errors.length > index && errors[index]}
          validateStatus={errors.length > index && errors[index] ? 'error' : 'success'}
          key={index}>
          <TimePicker size="large" placeholder="起始时间" value={value.active_start} onChange={date => this.startChange(index, date)}/>~
          <TimePicker size="large" placeholder="结束时间" value={value.active_end} onChange={date => this.endChange(index, date)}/>
            {
              parseInt(value.type) == 2 ?
              <span><Input type="number" style={{ width: 60, marginRight: 5, marginLeft: 5 }} value={value.discount} onChange={(e) => this.discountChange(index, e.target.value) } />折</span> :
                <span> 满<Input type="number" style={{ width: 60, marginRight: 5, marginLeft: 5 }}  value={value.discount_limit} onChange={(e) => this.limitChange(index, e.target.value) } />元减<Input type="number" value={value.discount} onChange={(e) => this.discountChange(index, e.target.value) } style={{ width: 60, marginRight: 5, marginLeft: 5 }} />元</span>
              }
              <Select style={{ width: 85, marginLeft: 5, marginTop: value.top }} defaultValue={value.type} onChange={(value) =>:: this.selectChange(index, value) }>
                <Option key="1" value="1" >金额优惠</Option>
                <Option key="2" value="2">折扣优惠</Option>
              </Select>
              {index==0 ? void(0):<a href="javascript:void (0);" style={value.top==10?{marginLeft:5,marginTop:value.top,display: "inline-block",
                verticalAlign: "middle"}:{marginLeft:5,marginTop:value.top}}  onClick={()=>this.remove(index)}>删除</a>}
              </Form.Item>
            );
          });
          return (
            <div>
              {formItems}
              <Form.Item wrapperCol={{ span: 19, offset: 5}} style={{marginBottom: 10,marginTop: -18}}>
                <a href="javascript:void (0);" style={{marginLeft:5,marginTop:top}} onClick={::this.add} >新增区间优惠</a>
              </Form.Item>
            </div >
          );
        }
      };
