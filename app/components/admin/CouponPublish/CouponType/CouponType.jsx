import React, { PropTypes } from 'react';
import { Form, Radio } from 'antd';
import { USER_TYPE, COUPON_TYPE } from 'config/constants';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { SINGLE, BRAND, VOUCHER, FRESH,REBATECOUPON } = COUPON_TYPE;
const { BRANDLER, RETAILER } = USER_TYPE;

CouponType.propTypes = {
  isEdit: PropTypes.bool.isRequired,
  isMyVip: PropTypes.bool.isRequired,
  isSelectMode: PropTypes.number.isRequired,
  business: PropTypes.array.isRequired,
  couponType: PropTypes.number.isRequired,
  onCouponTypeChange: PropTypes.func.isRequired,
};

CouponType.defaultProps = {
  isEdit: false,
};

export default function CouponType({isEdit, couponType, onCouponTypeChange, business, isSelectMode, isMyVip}) {
  return (
    <FormItem label="券种类" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} required style={isSelectMode === 2 && !isMyVip ? {display:'none'}: {display:'block'}}>
      <RadioGroup value={couponType} onChange={e => onCouponTypeChange(e.target.value)} disabled={isEdit}>
        {
          business.map((value,index)=>
            <Radio value={parseInt(value.type)} key={parseInt(value.type)}>{value.name}</Radio>
          )
        }
      </RadioGroup>
    </FormItem>
  );
}
