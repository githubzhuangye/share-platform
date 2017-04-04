import React, { PropTypes, Component } from 'react';
import { Form, Input, message } from 'antd';
import styles from './styles.css';
import { COUPON_TYPE } from 'config/constants';
import { formItemLayout } from '../constants.js';
import { minfeeFieldDecorator } from '../PublishForm/validator.js';
import { validateFields } from 'helpers/util';

import { UserIdentity, CouponType, SearchableInput, Budget, Pic, CouponLimitation,
ValidateDate, Market, MinFee, CouponName, CouponRule, SubmitAndReset, SaveEditAndBack } from 'components/admin/CouponPublish';

import { UserIdentityContainer, CouponTypeContainer } from "containers/admin/CouponPublish" //引入券类型筛选组件

const { VOUCHER } = COUPON_TYPE;

export default class Voucher extends Component {
  static propTypes = {
    isEdit: PropTypes.bool.isRequired,
    form: PropTypes.object.isRequired,
    userType: PropTypes.number.isRequired,
    selectedMarketList: PropTypes.array.isRequired,
    onCouponTypeChange: PropTypes.func.isRequired,
    onMarketClick: PropTypes.func.isRequired,
    saveEdit: PropTypes.func.isRequired,
    back: PropTypes.func.isRequired,
  }
  formatFormData(formData) {

    const { isSelectMode, format } = this.props;
    const result = format(formData);

    // 全场券字段
    result['budget'] = formData.budget * 100;
    result['expect'] = formData.rate;
    if (formData.minfee) {
      result['minfee'] = formData.minfee * 100;
    }

    if (isSelectMode === 2) {
      result['channel'] = 'ALIPAY';
      const couponRule = [];
      couponRule.push(formData['couponrule0']);
      formData.couponrule.map(i => couponRule.push(formData['couponrule'+i]));
      const subRule = couponRule.join('|');
      result['userule'] = subRule;
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
  render() {
    const { form, userType, onCouponTypeChange, onMarketClick, selectedMarketList, reset,
       isEdit, saveEdit, back, isSelectMode } = this.props;
    return (
      <Form>
        <UserIdentityContainer
          isEdit={isEdit}/>
        <CouponTypeContainer
          isEdit={isEdit}/>
        <Budget
          isEdit={isEdit}
          couponType={VOUCHER.value}
          form={form}/>
        <Pic form={form}/>
        <CouponLimitation
          isEdit={isEdit}
          form={form}/>
        <ValidateDate form={form}/>
        <Market onMarketClick={onMarketClick} selectedMarketList={selectedMarketList}/>
        <MinFee
          isEdit={isEdit}
          form={form}/>
        {isSelectMode === 2 || isSelectMode === 3 ? <CouponRule form={form} isMyVip={isMyVip} isSelectMode={isSelectMode}/> : null}
        <CouponName form={form}/>
        {isEdit
        ? <SaveEditAndBack onSaveEdit={saveEdit} onBack={back}/>
        : <SubmitAndReset onSubmit={::this.handleSubmit} onReset={reset}/>}
      </Form>
    );
  }
}
