import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { message } from 'antd';
import * as marketManageActionCreators from 'redux/modules/marketManage';
import * as commonActionCreators from 'redux/modules/common';
import { FORM_MODE } from 'config/constants';
import { cardable } from 'hoc';
import EventEmitter, { MARKET_MODAL_CLOSE, GEO, GEO_SUCCESS } from 'helpers/event';
import { validateFields } from 'helpers/util';
import { getPoint, getFullAddress } from 'components/admin/MarketManage/AddressSelection/AddressSelection';

import { MarketUpsertForm } from 'components/admin/MarketManage';

function getBreadMenus(props) {
  const menus = [{name: '门店管理', url: '/admin/manage/market'}];
  if (props.pattern === '/admin/manage/market/edit/:id') {
    menus.push('修改门店');
  } else {
    menus.push('添加门店');
  }
  return menus;
}

@cardable(getBreadMenus)
@connect(
  ({marketManage, auth, common}, ownProps) => ({
    saaslist: auth.saaslist,
    region: marketManage.region,
    provinceAndCity: common.get('provinceAndCity').toArray(),
    ...ownProps,
  }),
  dispatch => bindActionCreators({...marketManageActionCreators, ...commonActionCreators}, dispatch)
)
export default class MarketUpsertFormContainer extends React.Component {
  static propTypes = {
    region: PropTypes.array.isRequired,
    saaslist: PropTypes.array.isRequired,
    provinceAndCity: PropTypes.array.isRequired,
    handleFetchProvinceAndCity: PropTypes.func.isRequired,
    getEditedMarektFormData: PropTypes.func.isRequired,
    handleAddMarket: PropTypes.func.isRequired,
    handleEditMarket: PropTypes.func.isRequired,
  }
  static contextTypes = {
    history: PropTypes.object.isRequired,
  }
  async componentDidMount() {
    const { handleFetchProvinceAndCity, pattern, params, getEditedMarektFormData } = this.props; 
    await handleFetchProvinceAndCity();

    if (pattern === '/admin/manage/market/edit/:id') { // 编辑模式
      const formData = getEditedMarektFormData(params.id);
      this._form.setFieldsValue(formData);
    }
  }
  async handleBtnClick() {
    const { handleAddMarket, handleEditMarket, pattern, region } = this.props;
    const mode = pattern === '/admin/manage/market/edit/:id' ? 'edit' : 'new';
    const form = this._form;

    try {
      const formData = await validateFields(form);
      const { fullAddress, cityCode } = getFullAddress(region, formData.address);
      const { longitude, latitude } = await getPoint(fullAddress);

      formData.longitude = longitude;
      formData.latitude = latitude;
      formData.citycode = cityCode;

      if (mode === 'new') {
        await handleAddMarket(formData);
        message.success('门店添加成功!', 0.5);
      } else {
        await handleEditMarket(formData);
        message.success('门店修改成功!', 0.5);
      }

      setTimeout(() => {
        form.resetFields();
        this.context.history.goBack();
      }, 500);
      
    } catch(e) {
      if (e.message) {
        message.error(e.message);
      } else {
        console.log(e);
      }
    }
  }
  render () {
    const { saaslist, provinceAndCity, pattern } = this.props;
    return (
      <MarketUpsertForm
        ref={form => this._form = form}
        mode={pattern === '/admin/manage/market/edit/:id' ? 'edit' : 'new'}
        saaslist={saaslist}
        loading={provinceAndCity.length === 0}
        onBtnClick={::this.handleBtnClick}/>
    );
  }
}
