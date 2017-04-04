import React, { Component, PropTypes } from 'react';
import { Form, Select, Button, Col, message } from 'antd';
import { List } from 'immutable';
import moment from 'moment';
import styles from './styles.css';
import { USER_TYPE, COUPON_TYPE } from 'config/constants';
import { ticketQueryApi, couponPublishApi } from 'api';
import store from 'config/store';
import { diffMarkets, navigateTo } from 'helpers/util';
import { setSaasId, handleSaasChange, setSelectedRegion, setNextDataSource, setNextTargetKeys,
replaceCurrentMarketsWithNext, resetMarkets, transformProviceAndCity } from 'redux/modules/selectMarket';

import { ConfirmModalContainer } from 'containers/admin/CouponPublish';
import Single from './Single';
import Voucher from './Voucher';
import Fresh from './Fresh';
import Brand from './Brand';
import Rebate from './Rebate';
import SingleRate from './SingleRate';
import VoucherRate from './VoucherRate';

const FormItem = Form.Item;
const { SINGLE, SINGLERATE, BRAND, VOUCHER, VOUCHERRATE,FRESH,REBATECOUPON } = COUPON_TYPE;
const { RETAILER } = USER_TYPE;

function formatFormData(formData) {
  const { date, couponpic, limit, predays,validate_type} = formData;
  const dateFormatStr = 'YYYY-MM-DD';
  const relative_time=validate_type==="RELATIVE"?formData.relative_time:"";
  const starttime = `${moment(date[0]).format(dateFormatStr)} 00:00:00`;
  const endtime = `${moment(date[1]).format(dateFormatStr)} 23:59:59`;

  // 通用发券字段
  const result = {
    starttime,
    endtime,
    couponname: formData.couponname,
    couponfee: parseInt(formData.couponfee * 100),
    couponcount: formData.couponcount,
    count: limit==undefined?"-1":limit,
    predays:predays?predays:0,//设置默认值
    validate_type:validate_type?validate_type:"FIXED", //设置默认值,
    relative_time
  };

  if (couponpic) {
    result['couponpic'] = couponpic;
  }
  return result;
}

@Form.create()
export default class PublishForm extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    business: PropTypes.array.isRequired,
    userType: PropTypes.number.isRequired,
    couponType: PropTypes.number.isRequired,
    isSelectMode: PropTypes.number.isRequired,
    isMyVip: PropTypes.bool.isRequired,
    partnerId: PropTypes.string.isRequired,
    selectedMarketList: PropTypes.instanceOf(List),
    onCouponTypeChange: PropTypes.func.isRequired,
    onMarketClick: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    resetMarkets: PropTypes.func.isRequired,
    params: PropTypes.object,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    isEdit: false,          // 券的编辑模式
    oldSelectedMarkets: [],
  }
  componentDidMount() {
    const { business, onCouponTypeChange, params } = this.props;
    this.handleReset();
    if (params && params.id) { // 进入券的编辑模式
      this.setState({isEdit: true});
      // TODO: refactor
      const allRegionPromies = [];
      ticketQueryApi.fetchMarkets(params.id)
        .then(saasList => {
          if (saasList.length === 0) return;
          saasList.forEach((item, index) => {
            store.dispatch(setSaasId(item.id, index));
            allRegionPromies.push(store.dispatch(handleSaasChange(item.id, index, isSelectMode, partnerId)));
            store.dispatch(setSelectedRegion(item.selectedCity.map(city => `${city.id}-${city.name}`), index));
            store.dispatch(setNextDataSource(item.market.map(item => ({key: item.id, title: item.name})), index));
            store.dispatch(setNextTargetKeys(item.selectedMarket.map(item => item.id), index));
          });
          Promise.all(allRegionPromies)
            .then(() => store.dispatch(replaceCurrentMarketsWithNext()));
          this.setState({oldSelectedMarkets: saasList.reduce((result, item) => [...result, ...item.selectedMarket.map(item => item.id)], [])});
        });
      ticketQueryApi.fetchTicketDetail(params.id)
        .then(data => {
          this.props.onCouponTypeChange(+data.type);
          this.props.form.setFieldsValue({...data,
            goodid: {text: data.goodname, value: data.goodid},
            budget: data.budget / 100,
            couponfee: data.couponfee / 100,
            rate: data.expect,
            date: [moment(data.starttime), moment(data.endtime)],
            minfee: data.minfee / 100,
            relative_time:data.relative_time?data.relative_time:"",
            validate_type:data.validate_type,
            predays:data.predays
          });
      });
    } else {
      this.setState({isEdit: false});
      if (business.length) {
        onCouponTypeChange(+business[0].type);
      }
    }
  }
  handleCouponTypeChange(e) {
    this.props.onCouponTypeChange(e.target.value);
    this.handleReset();
  }
  handleReset() {
    const { resetMarkets } = this.props;
    this.resetFormData();
    resetMarkets();
  }
  resetFormData() {
    const { getFieldsValue, setFieldsValue, resetFields } = this.props.form;
    const fields = getFieldsValue();
    const { goodid, ...otherFields } = fields;
    setFieldsValue({ goodid: {} });
    resetFields(Object.keys(otherFields));
  }
  // 编辑界面保存和返回功能
  saveEdit() {
    const rawFormData = formatFormData(this.props.form.getFieldsValue());
    const { addMarket, removeMarket } = diffMarkets(this.state.oldSelectedMarkets, this.props.selectedMarketList.toArray());
    const editFormData = {
      pubid: this.props.params.id,
      starttime: rawFormData.starttime,
      endtime: rawFormData.endtime,
      predays: rawFormData.predays,
      couponname: rawFormData.couponname,
    };
    if (rawFormData.couponpic) {
      editFormData['couponpic'] = rawFormData.couponpic;
    }
    if (addMarket.length) {
      editFormData['addMarket'] = addMarket.join(',');
    }
    if (removeMarket.length) {
      editFormData['removeMarket'] = removeMarket.join(',');
    }
    couponPublishApi.editCoupon(editFormData)
      .then(() => message.success('券修改成功'))
      .then(() => setTimeout(() => {
        navigateTo('/admin/coupon/query', this.context.router);
      }, 1500))
      .catch(error => message.error(error.message));
  }
  back() {
    navigateTo('/admin/coupon/query', this.context.router);
  }
  inject(Component) { // 向Single/Voucher等组件注入特定的props
    const { form, userType, selectedMarketList, onMarketClick, onSubmit, isSelectMode, isMyVip, partnerId, isWxMode } = this.props;
    const { isEdit } = this.state;
    return (
      <Component
        form={form}
        userType={userType}
        isEdit={isEdit}
        isSelectMode={isSelectMode}
        isMyVip={isMyVip}
        isWxMode={isWxMode}
        partnerId={partnerId}
        selectedMarketList={selectedMarketList.toArray()}
        onMarketClick={onMarketClick}
        onCouponTypeChange={::this.handleCouponTypeChange}
        reset={::this.handleReset}
        format={formatFormData}
        submit={onSubmit}
        saveEdit={::this.saveEdit}
        back={::this.back}/>
    );
  }
  getFormContent() {
    const { form, userType, couponType, selectedMarketList, onMarketClick, isSelectMode } = this.props;
    const { isEdit } = this.state;
    let content;

    if (couponType === SINGLE.value) {
      content = this.inject(Single);
    } else if (couponType === BRAND.value) {
      content = this.inject(Brand);
    } else if (couponType === VOUCHER.value) {
      content = this.inject(Voucher);
    } else if (couponType === FRESH.value) {
      content = this.inject(Fresh);
    } else if (couponType === REBATECOUPON.value) {
      content = this.inject(Rebate);
    } else if (couponType === SINGLERATE.value) {
      content = this.inject(SingleRate);
    } else if (couponType === VOUCHERRATE.value) {
      content = this.inject(VoucherRate);
    } else {
      content = "您还没有可以发送的券类型，请联系管理员开通";
    }
    return content;
  }
  render() {
    const formContent = this.getFormContent();
    return (
      <div className={styles.settingCoupon}>
        <div className={styles.juiCutLabel}>
          <div className={styles.juiMessageBar}>优惠券设置</div>
        </div>
        {formContent}
      </div>
    );
  }
}
