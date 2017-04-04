import React, { PropTypes } from 'react';
import { Form, Input } from 'antd';
import { formItemLayout } from '../constants.js';
import { addRequiredDecorator } from 'helpers/util';

const FormItem = Form.Item;

CouponName.propTypes = {
  form: PropTypes.object.isRequired,
};

export default function CouponName({form,isSelectMode,isMyVip}) {
  const requiredFieldDecorators = addRequiredDecorator(['couponname'], form.getFieldDecorator);
  return (
    <FormItem label="券名称" {...formItemLayout} required style={isSelectMode === 2 && !isMyVip ? {display:'none'}: {display:'block'}}>
      {requiredFieldDecorators('couponname')(
        <Input placeholder="填写完券设置将自动生成该名称" style={{ width: 276 }}/>
      )}
    </FormItem>
  );
}
