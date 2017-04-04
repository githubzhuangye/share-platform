import React, { PropTypes } from 'react';
import { Modal, Select, Input, InputNumber, Row, Col, Button, Icon } from 'antd';
import { userManageApi } from 'api';

import { FuzzySearchInput } from 'components/admin';

const Option = Select.Option;

const ErrorMessage = ({error}) => (
  <Row style={{marginTop: '4px'}}>
    <Col offset={7}>
      <div style={{color: '#f55f4e'}}>{error}</div>
    </Col>
  </Row>
);

const AssignmentItem = ({couponId, couponCount, onCouponIdChange, onCouponCountChange,
  onRemoveBtnClick, showRemoveBtn, couponInfo, couponError}) => (
    <div>
      <Row style={{marginTop: '8px'}}>
        <Col offset={1} span={6} style={{marginTop: '4px'}}><strong>请选择要发的券：</strong></Col>
        <Col span={12}>
          <FuzzySearchInput
            placeholder="请输入券名称"
            value={couponId}
            onChange={onCouponIdChange}
            fetchData={userManageApi.matchCouponList}
            formatValue={value => value.split(':').length === 2 ? value.split(':')[1] : value}/>
        </Col>
        <Col span={3}>
          <InputNumber style={{width: '55px'}} max={200}
            value={couponCount} onChange={onCouponCountChange}/>
          <span style={{marginLeft: '5px'}}>张</span>
        </Col>
        {showRemoveBtn
        ? <Col style={{marginTop: '5px'}}>
            <a style={{marginLeft: '10px'}}onClick={onRemoveBtnClick}>删除</a>
          </Col>
        : null}
      </Row>
      {couponInfo
      ? <div style={{marginTop: '4px'}}>
          <Row>
            <Col offset={7}>{couponInfo.name}</Col>
          </Row>
          <Row>
            <Col offset={7}>
              <span>面额：{couponInfo.price}元</span>
              <span style={{marginLeft: '16px'}}>券有效期：{couponInfo.date}</span>
            </Col>
          </Row>
        </div>
      : null}
      {couponError && <ErrorMessage error={couponError}/>}
    </div>
);

export default function CouponAssignment({phone, phoneError, coupons, setCouponCount, setCouponPhone,
  addCoupon, removeCoupon, handleCouponIdChange, handleCloseAssignModal, handleConfirm}) {
  return (
    <Modal
      visible={true}
      width="620px"
      title="指定发券"
      onCancel={handleCloseAssignModal}
      onOk={handleConfirm}>
      <div style={{height: '250px', overflow: 'auto'}}>
        <Row>
          <Col offset={1} span={6} style={{marginTop: '4px'}}><strong>请输入要发送的对象：</strong></Col>
          <Col span={6}>
            <Input style={{width: '180px'}} placeholder="请输入用户id"
              value={phone} onChange={e => setCouponPhone(e.target.value)}/>
          </Col>
        </Row>
        {phoneError && <ErrorMessage error={phoneError}/>}
        {coupons.map((coupon, index) => (
          <AssignmentItem
            key={index}
            couponId={coupon.id}
            couponCount={coupon.count}
            couponInfo={coupon.info}
            couponError={coupon.error}
            showRemoveBtn={coupons.length > 1}
            onCouponIdChange={(couponId, isSelect) => handleCouponIdChange(couponId, index, isSelect)}
            onCouponCountChange={couponCount => setCouponCount(couponCount, index)}
            onRemoveBtnClick={() => removeCoupon(index)}/>
        ))}
        <Row  style={{marginTop: '8px'}}>
          <Col offset={1}>
            <a onClick={addCoupon}>新增券码</a>
          </Col>
        </Row>
      </div>
    </Modal>
  );
}
CouponAssignment.propTypes = {
  phone: PropTypes.string.isRequired,
  phoneError: PropTypes.string.isRequired,
  coupons: PropTypes.array.isRequired,
  setCouponCount: PropTypes.func.isRequired,
  setCouponPhone: PropTypes.func.isRequired,
  handleCouponIdChange: PropTypes.func.isRequired,
  handleCloseAssignModal: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
};
