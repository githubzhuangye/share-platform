import React, { PropTypes, Component } from 'react';
import { Button, Radio, Select, Form, Input, Row, Col } from 'antd';
import { COUPON_STATUS, COUPON_TYPE, USER_TYPE, WX_TYPE } from 'config/constants';
import { extraStatus, generateOptions, flattenStatus } from 'helpers/util';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

const { VERIFING, NOT_START, ONGOING, OVER, OFF, ALL } = COUPON_STATUS;
const { SINGLE, BRAND, VOUCHER, FRESH } = COUPON_TYPE;
const { SINGLES } = WX_TYPE;
const { RETAILER } = USER_TYPE;

const marginStyle = {marginTop: '2px', marginBottom: '2px'};
const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 16},
  style: marginStyle
};
export const COUPON_MODE = {
  ORIGIN: {
    value: 1,
    text: '自发券',
  },
  HQ: {
    value: 2,
    text: '会抢券',
  },
  WX: {
    value: 3,
    text: '微信券',
  },
};
const { ORIGIN, HQ, WX } = COUPON_MODE;

@Form.create()
export default class TicketQueryForm extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    userType: PropTypes.number.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }

  state = {
    status: 1,
  }

  handleSubmit() {
    this.props.onSubmit(this.getFormData());
  }
  handleQueryTypeChange(e) {
    this.setState({status: e.target.value});

    this.props.selectCouponType(e.target.value);

    this.props.onSubmit({...this.getFormData(), query_type: e.target.value});
  }
  handleStatusChange(e) {
    this.props.onSubmit({...this.getFormData(), status: e.target.value});
  }
  getFormData() {
    return this.props.form.getFieldsValue();
  }
  render() {
    const { form, userType } = this.props;
    const {status} = this.state;
    const { getFieldDecorator } = form;
    return (
      <Form>
        <Row>
          <Col span={10}>
            <FormItem label="券模式:" {...formItemLayout}>
              {getFieldDecorator('query_type', {initialValue: ORIGIN.value,
                onChange: ::this.handleQueryTypeChange})(
                <RadioGroup size="large" size="small">
                  <Radio value={ORIGIN.value}>{ORIGIN.text}</Radio>
                  <Radio value={HQ.value}>{HQ.text}</Radio>
                  {userType !== 1 ?
                      <Radio value={WX.value}>{WX.text}</Radio> : null
                  }
                </RadioGroup>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem label="券名称:" {...formItemLayout}>
              {getFieldDecorator('coupon_name')(
                <Input placeholder="请输入券名称" size="small"/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="单品名称" {...formItemLayout}>
              {getFieldDecorator('goods_name')(
                <Input placeholder="请输入单品名称" size="small"/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="商品品牌" {...formItemLayout}>
              {getFieldDecorator('brand_name')(
                <Input placeholder="请输入商品品牌" size="small"/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem label="券类型" {...formItemLayout}>
              {getFieldDecorator('coupon_type')(
                <Select placeholder="请选择券类型" size="small" allowClear>
                  {status === 3 ?
                      generateOptions(flattenStatus(WX_TYPE), 'value', 'text') :
                      generateOptions(flattenStatus(COUPON_TYPE), 'value', 'text')
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={16}>
            <FormItem label="状态" labelCol={{span: 2}} wrapperCol={{span: 22}} style={marginStyle}>
              {getFieldDecorator('status', {initialValue: ALL.value,
                onChange: ::this.handleStatusChange})(
                <RadioGroup size="small">
                  {form.getFieldValue('query_type') == ORIGIN.value
                  ? <Radio value={VERIFING.value}>{VERIFING.text}</Radio>
                  : null}
                  <Radio value={NOT_START.value}>{NOT_START.text}</Radio>
                  <Radio value={ONGOING.value}>{ONGOING.text}</Radio>
                  <Radio value={OVER.value}>{OVER.text}</Radio>
                  <Radio value={ALL.value}>{ALL.text}</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
        </Row>
        <FormItem wrapperCol={{offset: 2}} style={marginStyle}>
          <Button type="primary" size="small" onClick={::this.handleSubmit}>查询</Button>
        </FormItem>
      </Form>
    );
  }
}
