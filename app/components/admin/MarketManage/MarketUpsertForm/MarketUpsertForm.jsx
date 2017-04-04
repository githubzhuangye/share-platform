import React, { PropTypes } from 'react';
import { Modal, Form, Input, Select, Cascader, Row, Col, message, Spin, Button } from 'antd';
import { generateOptions, addRequiredDecorator, checkPhone, validateFields } from 'helpers/util';
import { FORM_MODE, FORM_ITEM_LAYOUT } from 'config/constants';
import { AddressSelectionContainer } from 'containers/admin/MarketManage';
import EventEmitter, { MARKET_MODAL_CLOSE, GEO, GEO_SUCCESS } from 'helpers/event';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 16}
};

@Form.create()
export default class MarketUpsertForm extends React.Component {
  static propTypes = {
    mode: PropTypes.string.isRequired,
    form: PropTypes.object.isRequired,
    saaslist: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    onBtnClick: PropTypes.func.isRequired,
  }
  requiredFields = ['id', 'name', 'linkman']
  render () {
    const { mode, form, saaslist, loading, onBtnClick } = this.props;
    const { getFieldDecorator } = form;
    const requiredFieldDecorators = addRequiredDecorator(this.requiredFields, getFieldDecorator);
    const phoneFieldDecorator = getFieldDecorator('phone', {
      validate: [{
        rules: [
          { required: true, message: '请填写该选项' },
          { validator: (_, value, callback) => !value || checkPhone(value) ? callback() : callback('手机号码格式有误') },
        ],
        trigger: 'onBlur'
      }]
    });
    return (
      <Spin spinning={loading}>
        <Form>
          <Row>
            <Col span={12}>
              <FormItem label="门店名称" {...formItemLayout} required>
                {requiredFieldDecorators('name')(
                  <Input placeholder="请输入门店名称"/>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="门店编号" {...formItemLayout} required>
                {requiredFieldDecorators('id')(
                  <Input placeholder="请输入门店编号" disabled={mode === 'edit'}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="联系人" {...formItemLayout} required>
                {requiredFieldDecorators('linkman')(
                  <Input placeholder="请输入联系人"/>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="联系人号码" {...formItemLayout} required>
                {phoneFieldDecorator(
                  <Input placeholder="如果是固定电话，请用以下格式输入:区号-号码"/>
                )}
              </FormItem>
            </Col>
          </Row>
          <AddressSelectionContainer form={form} mode={mode}/>
          <Row>
            <Col span={12} offset={3}>
              <Button type="primary" onClick={onBtnClick}>
                {mode === 'new' ? '添加' : '修改'}
              </Button>
            </Col>
          </Row>
        </Form>
      </Spin>
    );
  }
}
