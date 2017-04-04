import React, { PropTypes  ,Component} from 'react';
import { Form, Col, DatePicker, Input,Radio } from 'antd';
import { dateFieldDecorator, preDaysFieldDecorator,relativeTimeFieldDecorator } from '../PublishForm/validator.js';
import { DATE_INTERVAL,COUPON_TYPE } from 'config/constants';
import { disabledDate } from 'helpers/util';
import styles from './styles.css';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const RadioGroup = Radio.Group;
const {REBATECOUPON,FRESH}=COUPON_TYPE;

export default class ValidateDate extends Component {
  state={
    value:this.props.form.getFieldsValue().validate_type?this.props.form.getFieldsValue().validate_type:"FIXED"
  }
  onChange(e) {
     const {form} = this.props;
    this.setState({
      value: e.target.value,
    });
    this.props.form.setFieldsValue({relative_time: 0});
  }
  render() {
  const {form,couponType, isSelectMode, isMyVip} = this.props;
  const {value}=this.state;
   const radioStyle = {
      display: 'block',
    };
    return (
      <div style={isSelectMode === 2 && !isMyVip ? {display:'none'}: {display:'block'}}>
           <FormItem label="活动有效期" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} required>
             <FormItem  style={{display:"inline-block"}}>
                {dateFieldDecorator(form)(
                  <RangePicker
                    disabledDate={disabledDate(DATE_INTERVAL.BEFORE, 1) }
                    style={{ width: 200, marginRight: '10px' }}/>
                     )}
              </FormItem>
              {
                REBATECOUPON.value===couponType?null:
                 <FormItem style={{display:"inline-block"}}>
                <span>提前</span>
                {preDaysFieldDecorator(form)(
                  <Input size="default" type="number" style={{ width: '64px', margin: '0 10px' }}/>
                )}
                <span>天领取</span>
              </FormItem>
              }
      </FormItem>
      {
        REBATECOUPON.value===couponType||FRESH.value===couponType?null:
         <FormItem label="券使用有效期" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} required>
      {
          form.getFieldDecorator("validate_type",{initialValue: value})(
              <RadioGroup  onChange={::this.onChange}>
                <Radio style={radioStyle} key="FIXED"  value={"FIXED"}>同活动有效期
                </Radio>
                <Radio style={radioStyle} key="RELATIVE" value={"RELATIVE"}>
                    <FormItem style={{display:"inline-block"}}>
                      <span>券领取</span>
                      {
                        relativeTimeFieldDecorator(form,value)(
                        <Input size="default" type="number"style={{ width: '64px', margin: '0 10px' }}/>
                      )
                      }
                      <span>天内有效</span>
                    </FormItem>
                </Radio>
                </RadioGroup>
          )
      }
      </FormItem>
      }
      </div>
    );
  }
}
