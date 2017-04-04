import React, { PropTypes } from 'react';
import {  Form, Input } from 'antd';
import {rateCountFieldDecorator,couponCountFreshFieldProps } from '../PublishForm/validator.js';
import { formItemLayout } from '../constants.js';
const FormItem = Form.Item;
RateCount.propTypes = {
  form: PropTypes.object.isRequired,
  couponType: PropTypes.number.isRequired,
}

export default function RateCount({form,couponType}) {
  return (
     <div>
      <FormItem label="券面额" {...formItemLayout} required>
         {rateCountFieldDecorator(form,couponType)(
             <Input type="number" style={{ width: 64,marginRight:10 }}/>
          )}折
      </FormItem>
      <FormItem label="预计发放总量" {...formItemLayout} required>
        {couponCountFreshFieldProps(form)(
          <Input type="number" style={{ width: 110 }}/>
        )}
      </FormItem>
    </div>
  );
}
