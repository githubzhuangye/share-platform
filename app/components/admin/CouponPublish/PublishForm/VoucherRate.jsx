import React, { PropTypes, Component } from 'react';
import { Form, Input, message } from 'antd';
import styles from './styles.css';
import { COUPON_TYPE } from 'config/constants';
import { formItemLayout } from '../constants.js';
import { minfeeFieldDecorator,couponCountFreshFieldProps } from '../PublishForm/validator.js';
import { validateFields } from 'helpers/util';

import { UserIdentity, CouponType, SearchableInput, Budget, Pic, CouponLimitation,
ValidateDate, Market, MinFee, CouponName, CouponRule, SubmitAndReset, SaveEditAndBack,Rate } from 'components/admin/CouponPublish';

import { UserIdentityContainer, CouponTypeContainer } from "containers/admin/CouponPublish" //引入券类型筛选组件


const { VOUCHERRATE } = COUPON_TYPE;




export default class VoucherRate extends Component {
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

    // 全场折扣券字段
    result['couponcount']=formData.couponFreshcount;//发行数量
    result['couponfee']=(formData.RateCount/10).toFixed(2);//券面额
    if (formData.minfee) {
      result['minfee'] = formData.minfee * 100;
    }
    if (formData.maxfee) {
      result['maxfee'] = formData.maxfee * 100;
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
        <Rate
            form={form}
            couponType={VOUCHERRATE.value}
        />
        <Pic form={form}/>
        <CouponLimitation
          isEdit={isEdit}
          form={form}/>
        <ValidateDate form={form}/>
        <Market onMarketClick={onMarketClick} selectedMarketList={selectedMarketList}/>
        <MinFee
          isEdit={isEdit}
          form={form}
          couponType={VOUCHERRATE.value}
          />
        {isSelectMode === 2 || isSelectMode === 3 ? <CouponRule form={form} isMyVip={isMyVip} isSelectMode={isSelectMode}/> : null}
        <CouponName form={form}/>
        {isEdit
        ? <SaveEditAndBack onSaveEdit={saveEdit} onBack={back}/>
        : <SubmitAndReset onSubmit={::this.handleSubmit} onReset={reset}/>}
      </Form>
    );
  }
}
