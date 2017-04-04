import React, { PropTypes, Component } from 'react';
import { Modal, Form, Input, Select, Row, Col, Button, message } from 'antd';
import { addRequiredDecorator, generateOptions, validateFields, checkProductCode } from 'helpers/util';
import { FORM_MODE, IMAGE_TYPE } from 'config/constants';
import * as styles from './styles.css';

import { CardUpload } from 'components';

const { NEW, EDIT } = FORM_MODE;
const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: {span: 8},
  wrapperCol: {span: 16}
};

@Form.create()
export default class ProductUpsertForm extends Component {
  static propTypes = {
    mode: PropTypes.number.isRequired,
    form: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired,
    brandlist: PropTypes.array.isRequired,
    categoryList: PropTypes.array.isRequired,
    dictlist: PropTypes.array.isRequired,
    onUpsertFormClose: PropTypes.func.isRequired,
    onUpsertFormSubmit: PropTypes.func.isRequired,
    onUpdateProduct: PropTypes.func.isRequired
  }
  state = {
    isBrandAdding: false
  }
  requiredFields = ['goodname']
  handleOk() {
    const { mode, onUpdateProduct, onUpsertFormSubmit, form } = this.props;
    const { brandlist, dictlist, categoryList } = form;
    validateFields(form)
      .then(data => {
        let values = {...data};
        delete values.newBrand;
        if (this.state.isBrandAdding) {
          delete values.brandid;
          values = {...values, brandname: data.newBrand};
        }
        if (mode === NEW.value) {
          onUpsertFormSubmit(values)
            .then(() => {
              this.setState({isBrandAdding: false});
              message.success('商品添加成功!');
              this.clearForm();
            })
            .catch(error => message.error(error.message));
        } else if (mode === EDIT.value) {
          onUpdateProduct(values)
          .then(() => {
            this.setState({isBrandAdding: false});
            message.success('商品信息修改成功!');
            this.clearForm();
          })
          .catch(error => message.error(error.message));
        }
      })
      .catch(::console.log);
  }
  handleFormClose() {
    this.clearForm();
    this.props.onUpsertFormClose();
  }
  clearForm() {
    this._upload.clear();
    this.props.form.resetFields();
  }
  handleBrandChange(value) {
    if (value === 'new') {
      this.setState({...this.state, isBrandAdding: true});
    } else {
      this.setState({...this.state, isBrandAdding: false});
    }
  }
  render () {
    const { visible, onUpsertFormClose, form , brandlist, dictlist, categoryList, mode } = this.props;
    const { getFieldDecorator, getFieldsValue } = form;
    const requiredFieldDecorators = addRequiredDecorator(this.requiredFields, getFieldDecorator);
    const productCodeFieldDecorator = getFieldDecorator('goodid', {
      validate: [{
        rules: [
          { required: true, message: '请填写该项' },
          { validator: (_, value, callback) => !value || checkProductCode(value) ? callback() : callback('69码格式有误,只支持数字') },
        ],
        trigger: 'onBlur'
      }]
    });
    const addingBrand = (
      <Row>
        <Col span={12}>
          <FormItem label="品牌名称" {...formItemLayout}>
            {getFieldDecorator('newBrand')(
              <Input placeholder="请输入品牌名称"/>
            )}
          </FormItem>
        </Col>
      </Row>
    );
    return (
      <Modal
        title={mode === NEW.value ? '添加商品' : '修改商品'}
        visible={visible}
        onOk={::this.handleOk}
        onCancel={::this.handleFormClose}>
        <Form>
          <Row>
            <Col span={12}>
              <FormItem label="商品名称" {...formItemLayout}>
                {requiredFieldDecorators('goodname')(
                  <Input placeholder="请输入商品名称"/>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="单品条码" {...formItemLayout}>
                {productCodeFieldDecorator(
                  <Input placeholder="请输入商品条码" disabled={mode === EDIT.value}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="品牌" {...formItemLayout}>
                {getFieldDecorator('brandid', {onChange: ::this.handleBrandChange})(
                  <Select placeholder="请选择单品品牌" allowClear>
                    {generateOptions(brandlist, 'id', 'brandname')}
                    <Option value="new">新建品牌</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="品类" {...formItemLayout}>
                {getFieldDecorator('category_id')(
                  <Select placeholder="请输入单品品类">
                    {generateOptions(categoryList, 'catid', 'catname')}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          {this.state.isBrandAdding ? addingBrand : null}
          <Row>
            <Col span={10}>
              <FormItem label="单品图片" {...{labelCol: {span: 10}, wrapperCol: {span: 14}}}>
                {getFieldDecorator('pic', {rules: [{required: true, message: '请选择文件'}]})(
                  <CardUpload
                    type={IMAGE_TYPE.PRODUCT.value}
                    ref={upload => this._upload = upload}/>
                )}
              </FormItem>
            </Col>
            <Col span={14}>
              <div className={styles.adviceGroup}>
                <p className={styles.advice}>建议：图片重点内容居中，最多能上传1张。格式: bmp, png, jpeg, jpg, gif</p>
                <p className={styles.warn}>注意：图片尺寸不能超过800*600，大小不得超过300k，否则会导致文件上传失败</p>
              </div>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}