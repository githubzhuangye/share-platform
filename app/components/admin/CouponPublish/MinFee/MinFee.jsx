import React, { PropTypes } from 'react';
import { Form, Input } from 'antd';
import { minfeeFieldDecorator,maxfeeFieldDecorator } from '../PublishForm/validator';
import { COUPON_TYPE } from 'config/constants';
import { formItemLayout } from '../constants';
import styles from "./styles.css"

const FormItem = Form.Item;
const { VOUCHERRATE } = COUPON_TYPE;

MinFee.propTypes = {
  isEdit: PropTypes.bool.isRequired,
  form: PropTypes.object.isRequired,
  couponType:PropTypes.number.isRequired,
};

export default function MinFee({form,couponType , isEdit}) {
  return (
    <div className={styles.minfeeWrap}>
        <FormItem label="使用条件：">
          <span>消费满</span>
          {minfeeFieldDecorator(form)(
            <Input type="number" style={{ width: 64, margin: '0 10px' }} disabled={isEdit}/>
          )}
          <span>元可用</span>
        </FormItem>
        {couponType===VOUCHERRATE.value?
          <FormItem>
            <span>,最高优惠</span>
            {maxfeeFieldDecorator(form)(
              <Input type="number" style={{ width: 64, margin: '0 10px' }} disabled={isEdit}/>
            )}
            <span>元</span>
          </FormItem>:null
        }
      
    </div>
  );
}
