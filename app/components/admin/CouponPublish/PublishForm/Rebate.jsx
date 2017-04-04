import React, { PropTypes, Component } from 'react';
import { Form, Input, message } from 'antd';
import styles from './styles.css';
import moment from 'moment';
import { COUPON_TYPE } from 'config/constants';
import { formItemLayout } from '../constants.js';
import { minfeeFieldDecorator } from '../PublishForm/validator.js';
import { validateFields } from 'helpers/util';

import { CouponType, SearchableInput, Budget, Pic, CouponLimitation,
ValidateDate, Market, MinFee, CouponName, SubmitAndReset, SaveEditAndBack,Rebate } from 'components/admin/CouponPublish';


import { CouponTypeContainer, UserIdentityContainer} from "containers/admin/CouponPublish" //引入券类型筛选组件

const { REBATECOUPON } = COUPON_TYPE;

export default class RebateCoupon extends Component {
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
    const result = this.props.format(formData);
    const {rebateDate,rebatecount,rebatemaxcount,rebateminfee} = formData;
    // 全场券字段
    result['budget'] = formData.budget * 100;
    result['expect'] = formData.rate;
    if (formData.minfee) {
      result['minfee'] = formData.minfee * 100;
    }
   //当为返券的时候，设置发券时间段 消费条件门槛
      const rebateDateFormatStr = 'YYYY-MM-DD HH:mm:ss';
      const rebatestart=`${moment(rebateDate[0]).format(rebateDateFormatStr)}`;
      const rebateend=`${moment(rebateDate[1]).format(rebateDateFormatStr)}`;
      result['rebatestart'] = rebatestart;
      result['rebateend'] = rebateend;
      result['rebatecount'] = rebatecount;
      result['rebatemaxcount'] = rebatemaxcount;
      result['rebateminfee'] = rebateminfee*100;
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
       isEdit, saveEdit, back } = this.props;
    return (
      <Form>
        <UserIdentityContainer
          isEdit={isEdit}
          userType={userType}
          couponType={REBATECOUPON.value}/>
        <CouponTypeContainer
          isEdit={isEdit}
          userType={userType}
          couponType={REBATECOUPON.value}
          onCouponTypeChange={onCouponTypeChange}/>
        <Budget
          isEdit={isEdit}
          couponType={REBATECOUPON.value}
          form={form}/>
        <Pic form={form}/>
        <ValidateDate 
            form={form}
            couponType={REBATECOUPON.value}/>
         <Rebate
          form={form}/>
        <Market onMarketClick={onMarketClick} selectedMarketList={selectedMarketList}/>
        <CouponName form={form}/>
        {isEdit
        ? <SaveEditAndBack onSaveEdit={saveEdit} onBack={back}/>
        : <SubmitAndReset onSubmit={::this.handleSubmit} onReset={reset}/>}
      </Form>
    );
  }
}
