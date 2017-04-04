import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { message } from 'antd';
import { ConfirmModal } from 'components/admin/CouponPublish';
import * as publishFormActionCreators from 'redux/modules/publishForm';
import { COUPON_TYPE } from 'config/constants';
import { extractStatus, formatFreshRule } from 'helpers/util';

const { SINGLE, VOUCHER, FRESH } = COUPON_TYPE;

@connect(
  ({publishForm}) => ({
    visible: publishForm.get('confirmModalVisible'),
    submitData: publishForm.get('submitData').toJS()
  }),
  dispatch => bindActionCreators(publishFormActionCreators, dispatch)
)
export default class ConfirmModalContainer extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    submitData: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    closeConfirmModal: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired
  }
  handleOk() {
    const { handleSubmit, resetForm } = this.props;
    handleSubmit()
      .then(::message.success)
      .then(resetForm)
      .catch(error => message.error(error.message));
  }
  render() {
    const { visible, submitData, closeConfirmModal } = this.props;
    return (
      <ConfirmModal
        visible={visible}
        dataSource={transformSubmitData(submitData)}
        onOk={::this.handleOk}
        onCancel={closeConfirmModal}/>
    );
  }
}

function transformSubmitData(submitData) {
  if (Object.keys(submitData).length === 0) {
    return [];
  }
  const couponType = submitData.type;
  const mapper = {
    couponname: '券名称',
    type: '券种类',
    couponcount: '发放总量',
    date: '券使用有效期',
  };
  const formatData = {
    ...submitData,
    date: `${submitData.starttime} 到 ${submitData.endtime}`,
    type: extractStatus(COUPON_TYPE)(couponType),
  };
  if (couponType === SINGLE.value) {
    mapper.goodname = '商品名称';
    mapper.couponfee = '券面额';
    formatData.goodname = submitData.goodid.text.split(':')[1];
    formatData.couponfee = `${submitData.couponfee / 100}元`;
  } else if (couponType === VOUCHER.value) {
    mapper.couponfee = '券面额';
    formatData.couponfee = `${submitData.couponfee / 100}元`;
    mapper.minfee = '使用条件';
    formatData.minfee = submitData.minfee && submitData.minfee > 0 ? `消费满${submitData.minfee / 100}元使用` : '无限制';
  } else if (couponType === FRESH.value) {
    mapper.interval_discount = '使用规则';
    formatData.interval_discount = JSON.parse(submitData.interval_discount).map(formatFreshRule);
  }
  return Object.keys(mapper)
    .map(key => ({description: mapper[key], value: formatData[key]}));
}
