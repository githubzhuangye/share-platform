import React, { PropTypes, Component } from 'react';
import { Form, message } from 'antd';
import styles from './styles.css';
import { COUPON_TYPE } from 'config/constants';
import { validateFields,getStrLeng } from 'helpers/util';
import hqable from './hqable.hoc';

import { CouponType, QModeSelection, SearchableInput, Budget, Pic, CouponLimitation,
ValidateDate, Market, CouponName, CouponRule, SubmitAndReset, SaveEditAndBack, CouponWechatType } from 'components/admin/CouponPublish';
import { CouponTypeContainer, UserIdentityContainer } from "containers/admin/CouponPublish" //引入券类型筛选组件

const FormItem = Form.Item;
const { SINGLE } = COUPON_TYPE;

export default class Single extends Component {
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
    const { isSelectMode, isWxMode, format, form } = this.props;
    const result = format(formData);

    // 单品券字段
    result['goodid'] = formData.goodid;
    result['budget'] = formData.budget * 100;
    result['expect'] = formData.rate;

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

    if (isSelectMode === 3) {

      if (isWxMode === 0) {
          result['wechat_coupon_type'] = 'COMMON';
      } else {
          result['wechat_coupon_type'] = 'FRIEND';
      }
      result['couponpic'] = formData.couponpic;
      result['wechat_color'] = formData.wechat_color;
      result['wechat_code_type'] = formData.wechat_code_type;
      result['wechat_can_share'] = formData.wechat_can_share;
      result['wechat_can_give_friend'] = formData.wechat_can_give_friend;
      result['channel'] = 'WECHAT';
      const couponRule = [];
      couponRule.push(formData['couponrule0']);
      formData.couponrule.map(i => couponRule.push(formData['couponrule'+i]));
      const subRule = couponRule.join('|');
      result['userule'] = subRule;
    }

    const NAME = getStrLeng(formData.couponname);

    if (isSelectMode === 3 && NAME > 27) {
      message.error('优惠券名称过长');
      validateFields(form)
        .catch(console.log);
        return;
    }

    if (isSelectMode === 3 && formData.couponpic == '') {
      message.error('请选择上传图片');
      validateFields(form)
        .catch(console.log);
        return;
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
       isEdit, saveEdit, back, isSelectMode, isMyVip, onHQModeChange, isWxMode } = this.props;

    return (

      <Form>
        <UserIdentityContainer isEdit={isEdit}/>

          <p style={isSelectMode === 2 && !isMyVip ? {display:'block',marginLeft: '47px'}: {display:'none'}}>您好!您的帐号还未订购米雅会员营销，请<a href="https://auth.alipay.com/login/ant_sso_index.htm?goto=http%3A%2F%2Fapp.alipay.com%2Fcommodity%2FsearchCommodity.htm%3FsearchKey%3Dtitle%26searchVal%3D%2B%25C3%25D7%25D1%25C5%25BB%25E1%25D4%25B1%25D3%25AA%25CF%25FA" target="_blank">前去订购</a></p>

          <CouponTypeContainer isEdit={isEdit}/>

          {isSelectMode === 1 && <QModeSelection form={form}/>}

          <SearchableInput isEdit={isEdit} form={form} isSelectMode={isSelectMode} isMyVip={isMyVip}/>

          <Budget isEdit={isEdit} couponType={SINGLE.value} form={form} isSelectMode={isSelectMode} isMyVip={isMyVip}/>

          <Pic form={form} isSelectMode={isSelectMode} isMyVip={isMyVip}/>

          <CouponLimitation isEdit={isEdit} form={form} isSelectMode={isSelectMode} isMyVip={isMyVip}/>

          <ValidateDate form={form} isSelectMode={isSelectMode} isMyVip={isMyVip}/>

          {isSelectMode !== 1 && <Market onMarketClick={onMarketClick} selectedMarketList={selectedMarketList} isSelectMode={isSelectMode} isMyVip={isMyVip}/>}

          {isSelectMode === 2 || isSelectMode === 3 ? <CouponRule form={form} isMyVip={isMyVip} isSelectMode={isSelectMode}/> : null}

          {isSelectMode === 3 ? <CouponWechatType form={form}/> : null}

          <CouponName form={form} isSelectMode={isSelectMode} isMyVip={isMyVip}/>

          {isEdit ? <SaveEditAndBack onSaveEdit={saveEdit} onBack={back} isSelectMode={isSelectMode} isMyVip={isMyVip}/> : <SubmitAndReset onSubmit={::this.handleSubmit} onReset={reset} isSelectMode={isSelectMode} isMyVip={isMyVip}/>}

      </Form>

    );
  }

}
