import React, { PropTypes, Component } from 'react';
import { Form, message,Input  } from 'antd';
import styles from './styles.css';
import { COUPON_TYPE } from 'config/constants';
import { formItemLayout } from '../constants.js';
import { couponCountFreshFieldProps } from '../PublishForm/validator.js';
import { validateFields } from 'helpers/util';
import hqable from './hqable.hoc';

import { CouponType, QModeSelection, SearchableInput, Budget, Pic, CouponLimitation,
ValidateDate, Market, CouponName, CouponRule, SubmitAndReset, SaveEditAndBack,Rate } from 'components/admin/CouponPublish';
import { CouponTypeContainer, UserIdentityContainer } from "containers/admin/CouponPublish" //引入券类型筛选组件

const { SINGLERATE } = COUPON_TYPE;


export default class SingleRate extends Component {
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

    console.log(result);

    // 单品折扣券字段
    result['goodid'] = formData.goodid;
    result['couponcount']=formData.couponFreshcount;//发行数量
    result['couponfee']=(formData.RateCount/10).toFixed(2);//券面额

    // 如果是会抢模式，多一个hq_type字段
    if (isSelectMode === 1) {
      result['hq_type'] = formData.hqType;
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
    const { selectedMarketList, form, submit, isSelectMode } = this.props;
    if (isSelectMode !== 1 && !selectedMarketList.length) {
      message.error('请选择门店');
      validateFields(form)
        .catch(console.log);
        return;
    }

    validateFields(form)
      .then(::this.formatFormData)
      .then(submit)
      .catch(console.log);
  }
  render() {
    const { form, userType, onCouponTypeChange, onMarketClick, selectedMarketList, reset,
       isEdit, saveEdit, back, isSelectMode, onHQModeChange } = this.props;
    return (
      <Form>
        <UserIdentityContainer
          isEdit={isEdit}/>
        <CouponTypeContainer
          isEdit={isEdit}/>
        {isSelectMode === 1 && <QModeSelection form={form}/>}
        <SearchableInput
          isEdit={isEdit}
          form={form} />
        <Rate
            form={form}
            couponType={SINGLERATE.value}
        />
        <Pic form={form}/>
        <CouponLimitation
          isEdit={isEdit}
          form={form}/>
        <ValidateDate form={form}/>
        {isSelectMode !== 1 && <Market onMarketClick={onMarketClick} selectedMarketList={selectedMarketList}/>}
        {isSelectMode === 2 || isSelectMode === 3 ? <CouponRule form={form} isMyVip={isMyVip} isSelectMode={isSelectMode}/> : null}
        <CouponName form={form}/>
        {isEdit
        ? <SaveEditAndBack onSaveEdit={saveEdit} onBack={back}/>
        : <SubmitAndReset onSubmit={::this.handleSubmit} onReset={reset}/>}
      </Form>
    );
  }

}
