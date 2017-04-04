import React, { PropTypes  ,Component} from 'react';
import { Form, Col, DatePicker, Input,Radio } from 'antd';
import {rebateDateFieldDecorator,rebateminfeeDecorator,rebatecountDecorator,rebatemaxcountDecorator } from '../PublishForm/validator.js';
import { DATE_INTERVAL,COUPON_TYPE } from 'config/constants';
import { disabledDate } from 'helpers/util';
import styles from './styles.css';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const RadioGroup = Radio.Group;
const {REBATECOUPON}=COUPON_TYPE;

export default class Rebate extends Component {
  state={
    value:"FIXED"
  }
  onChange(e) {
     const {form} = this.props;
    this.setState({
      value: e.target.value,
    });
  }
  render() {
  const {form,couponType} = this.props;
  const {value}=this.state;
   const radioStyle = {
      display: 'block',
    };
    return (
      <div>
           <FormItem label="返券时间段" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} required>
             <FormItem>
                {rebateDateFieldDecorator(form)(
                  <RangePicker  
                    format="YYYY-MM-DD HH:mm:ss" showTime   
                    disabledDate={disabledDate(DATE_INTERVAL.BEFORE, 1) }
                    style={{ width: 200, marginRight: '10px' }}/>
                     )}
              </FormItem>
           </FormItem>
            <FormItem label="返券条件" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} required>
              <div className={styles.rebateWrap}>
                  <FormItem style={{marginBottom:0}}>
                  <span>消费满</span>
                    {
                      rebateminfeeDecorator(form)(
                       <Input size="default" type="number" style={{ width: '64px', margin: '0 10px' }}/>
                      )
                    }
                  <span>元，可返回</span>
                  </FormItem>
                    <FormItem style={{marginBottom:0}}>
                      {
                        rebatecountDecorator(form)(
                        <Input size="default" type="number" style={{ width: '64px', margin: '0 10px' }}/>
                        )
                      }
                       <span>张券</span>
                  </FormItem>
                    <FormItem>
                     <span>最多返回</span>
                     {
                        rebatemaxcountDecorator(form)(
                        <Input size="default" type="number" style={{ width: '64px', margin: '0 10px' }}/>
                        )
                      }
                       <span>张</span>
                    </FormItem>
                 
              </div>
           </FormItem>
      </div>
    );
  }
}
