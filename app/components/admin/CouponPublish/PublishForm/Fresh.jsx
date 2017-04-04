import React, { PropTypes, Component } from 'react';
import { Form, Input, message } from 'antd';
import moment from 'moment';
import styles from './styles.css';
import { COUPON_TYPE } from 'config/constants';
import { formItemLayout } from '../constants.js';
import { couponCountFreshFieldProps, couponFreshRateFieldDecorator, couponFreshFeeFieldDecorator } from '../PublishForm/validator.js';
import { validateFields } from 'helpers/util';

import { CouponType, SearchableInput, Pic, CouponLimitation,
ValidateDate, Market, CouponName, FreshCtrl, SubmitAndReset } from 'components/admin/CouponPublish';
import { CouponTypeContainer, UserIdentityContainer } from "containers/admin/CouponPublish" //引入券类型筛选组件

const FormItem = Form.Item;
const { FRESH } = COUPON_TYPE;

FreshCount.propTypes = {
  form: PropTypes.object.isRequired,
};

function FreshCount({form}) {
  return (
    <FormItem label="预计发放总量" {...formItemLayout} required>
      {couponCountFreshFieldProps(form)(
        <Input type="number" style={{ width: 110 }}/>
      )}
    </FormItem>
  );
}

MinDiscount.propTypes = {
  form: PropTypes.object.isRequired,
};

function MinDiscount({form}) {
  return (
    <div>
      <FormItem label="最低折扣优惠" {...formItemLayout} required>
        {couponFreshRateFieldDecorator(form)(
          <Input type="number" style={{ width: 100, marginRight: 10 }}/>
        )}折
      </FormItem>
      <FormItem label="最低金额优惠" {...formItemLayout} required>
        {couponFreshFeeFieldDecorator(form)(
          <Input type="number" style={{ width: 100, marginRight: 10 }}/>
        )}元
      </FormItem>
    </div>
  );
}

export default class Fresh extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    userType: PropTypes.number.isRequired,
    onCouponTypeChange: PropTypes.func.isRequired,
    onMarketClick: PropTypes.func.isRequired,
    selectedMarketList: PropTypes.array.isRequired,
  }
  state = {
    interval_discount: [],
    freshValues: [{
      "active_start": null,
      "active_end": null,
      "discount": "",
      "discount_limit": "",
      "type": "2",
      "top": 0,
      "tip": ""
    }],
  }
  freshchange(values) {
    this.setState({ values });
    const {freshValues} = this.state;
    const interval_discount = [];
    values.map((value, index) => {
      const formatStr = 'HH:mm:ss';
      const temp = {};
      temp.active_start = moment(value.active_start).format(formatStr);
      temp.active_end = moment(value.active_end).format(formatStr);
      temp.type = value.type;
      if (parseInt(value.type) === 2) {
        temp.discount = (value.discount / 10).toFixed(2);
      } else if (parseInt(value.type) === 1) {
        temp.discount = value.discount * 100;
        temp.discount_limit = value.discount_limit * 100;
      };
      interval_discount.push(temp);
    });
    this.setState({ interval_discount });
  }
  formatFormData(formData) {
    const result = this.props.format(formData);
    // 生鲜券字段
    result['goodid'] = formData.goodid;
    result['couponfee'] = "";
    result['couponcount'] = formData.couponFreshcount; // 覆盖通用字段中的couponcount
    if (formData.FreshRate) {
      result['min_discount'] = (formData.FreshRate / 100).toFixed(2);
    }
    if (formData.FreshFee) {
      result['min_gold'] = parseInt(formData.FreshFee * 100);
    }
    if (this.state.interval_discount.length) {
      result['interval_discount'] = JSON.stringify(this.state.interval_discount);
      console.log(this.state.interval_discount);
    }

    return result;
  }
  handleSubmit() {
    const { selectedMarketList, form, submit } = this.props;
    if (!selectedMarketList.length) {
      message.error('请选择门店');
      validateFields(form)
        .catch(console.log);
      return;
    }

    validateFields(form)
      .then(::this.formatFormData)
      .then(submit)
      .catch(console.log)
  }
  handleReset() {
    this.props.reset();
    this.setState({
      interval_discount: [],
      freshValues: [{
        "active_start": null,
        "active_end": null,
        "discount": "",
        "discount_limit": "",
        "type": "2",
        "top": 0,
        "tip": ""
      }],
    });
  }
  render() {
    const { form, userType, onCouponTypeChange, onMarketClick, selectedMarketList } = this.props;
    return (
      <Form>
        <UserIdentityContainer isEdit={false}/>
        <CouponTypeContainer isEdit={false}/>
        <SearchableInput form={form} isFresh={true}/>
        <FreshCount form={form}/>
        <Pic form={form}/>
        <CouponLimitation form={form}/>
        <ValidateDate 
            form={form}
            couponType={FRESH.value}
        />
        <FreshCtrl form={form} value={this.state.freshValues} onChange={::this.freshchange}/>
        <MinDiscount form={form}/>
        <Market onMarketClick={onMarketClick} selectedMarketList={selectedMarketList}/>
        <CouponName form={form}/>
        <SubmitAndReset onSubmit={::this.handleSubmit} onReset={::this.handleReset}/>
      </Form>
    );
  }
}
