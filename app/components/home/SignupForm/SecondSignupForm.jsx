import React, { Component, PropTypes } from 'react';
import { Button, Form, Input, Checkbox, Select, Icon, Upload, Col, message } from 'antd';
import { addRequiredDecorator, checkPhone } from 'helpers/util';
import { IMAGE_TYPE } from 'config/constants';
import { CardUpload } from 'components';

const { USER_INFO, LOGO } = IMAGE_TYPE;
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};
const offsetItemLayout = {
  wrapperCol: { span: 16, offset: 6 }
};

export default class SecondSignupForm extends Component {
  static propsType = {
    form: PropTypes.object.isRequired,
    addFormData: PropTypes.func.isRequired,
    submitData: PropTypes.func.isRequired,
    preStep: PropTypes.func.isRequired
  }
  fields = ['saasName', 'respName', 'respPhone', 'address', 'clientInfo',
    'brand', 'others', 'saaslogo']
  validateFields = ['saasName', 'respName', 'respPhone', 'address', 'saaslogo'];
  hanldeSubmit(e) {
    e.preventDefault();
    const { form, addFormData, submitData } = this.props;
    form.validateFields(this.validateFields, (errors, values) => {
      const license = this._license.getUrls();
      if (!license) {
        return message.error('请上传资质图片!');
      }
      const fieldsValue = form.getFieldsValue(this.fields);
      const formData = Object.keys(fieldsValue).reduce((result, key) => {
        if (fieldsValue[key]) {
          result[key] = fieldsValue[key];
        } else {
          result[key] = '';
        }
        return result;
      }, {});
      if (!errors) {
        addFormData({...formData, license});
        submitData();
      }
    });
  }
  render() {
    const { form, preStep } = this.props;
    const { getFieldDecorator } = form;
    const requiredFields = ['saasName', 'respName', 'address', 'saaslogo'];
    const requiredFieldDecorators = addRequiredDecorator(requiredFields, getFieldDecorator);
    const phoneFieldPropDecorator = getFieldDecorator('respPhone', {
      validate: [{
        rules: [
          { required: true, message: '请输入该选项' },
          { validator: (_, value, callback) => !value || checkPhone(value) ? callback() : callback('手机号码格式有误') },
        ],
        trigger: 'onBlur'
      }]
    });
    return (
      <Form horizontal onSubmit={::this.hanldeSubmit}>
        <FormItem label="商户名称" {...formItemLayout}>
          {requiredFieldDecorators('saasName')(
            <Input/>
          )}
        </FormItem>
        <FormItem label="负责人姓名" {...formItemLayout}>
          {requiredFieldDecorators('respName')(
            <Input/>
          )}
        </FormItem>
        <FormItem label="负责人电话" {...formItemLayout}>
          {phoneFieldPropDecorator(
            <Input placeholder="如果是固定电话，请用以下格式输入:区号-号码"/>
          )}
        </FormItem>
        <FormItem label="详细地址" {...formItemLayout}>
          {requiredFieldDecorators('address')(
            <Input/>
          )}
        </FormItem>
        <FormItem label="商户logo" {...formItemLayout}
          help="最多能上传1张。建议：图片重点内容居中，大小不超过5m，格式: bmp, png, jpeg, jpg, gif；">
          {requiredFieldDecorators('saaslogo')(
            <CardUpload
              type={LOGO.value}/>
          )}
        </FormItem>
        <FormItem label="资质信息" {...formItemLayout} required
          help="可以上传多张。建议：图片重点内容居中，大小不超过5m，格式: bmp, png, jpeg, jpg, gif；">
          <CardUpload
            type={USER_INFO.value}
            multiple={true}
            ref={license => this._license = license}/>
        </FormItem>
        <FormItem label="客户概况" {...formItemLayout}>
          {getFieldDecorator('clientInfo')(
            <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }}/>
          )}
        </FormItem>
        <FormItem label="经营品牌" {...formItemLayout}>
          {getFieldDecorator('brand')(
            <Input/>
          )}
        </FormItem>
        <FormItem label="其他" {...formItemLayout}>
          {getFieldDecorator('others')(
            <Input/>
          )}
        </FormItem>
        <FormItem {...offsetItemLayout}>
          <Button style={{marginRight: '8px'}} onClick={preStep}>上一步</Button>
          <Button type="primary" htmlType="submit">下一步</Button>
        </FormItem>
      </Form>
    );
  }
}
