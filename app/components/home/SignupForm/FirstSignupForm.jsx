import React, { Component, PropTypes } from 'react';
import { Button, Form, Input, Checkbox, Select, Icon } from 'antd';
import { signupApi } from 'api';
import { checkPaasword } from 'helpers/util';

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};
const offsetItemLayout = {
  wrapperCol: { span: 16, offset: 6 }
};

export default class FirstSignupForm extends Component {
  static propsType = {
    onSubmit: PropTypes.func.isRequired,
    preStep: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
  }
  state = {
    agreement: false
  }
  fields = ['account_id', 'password', 'repassword']
  hanldeSubmit(e) {
    e.preventDefault();
    const { form, onSubmit } = this.props;
    form.validateFields(this.fields, (errors, values) => {
      if (!errors) {
        const { repassword, ...formData } = values;
        onSubmit(formData);
      }
    });
  }
  handleAgreementChange(e) {
    this.setState({agreement: e.target.checked});
  }
  validateUsername(rule, value, callback) {
    if (value !== '') {
      signupApi.searchForUser(value)
        .then(data => {
          if (parseInt(data.code) === 200) {
            callback();
          } else {
            callback('用户名已存在');
          }
        });
    } else {
      callback();
    }
  }
  validatePassword(rule, value, callback) {
    if (checkPaasword(value)) {
      callback();
    } else {
      callback('密码长度不符，请输入6-16位密码');
    }
  }
  confirmPassword(rule, value, callback) {
    const { getFieldValue } = this.props.form;
    if (value !== getFieldValue('password')) {
      callback('两次输入密码不一致!');
    } else {
      callback();
    }
  }
  render() {
    const { form, preStep } = this.props;
    const { agreement } = this.state;
    const { getFieldDecorator } = form;
    const usernameFieldDecorator = getFieldDecorator('account_id', {
      rules: [
        { required: true, message: '用户名不能为空' },
        { validator: ::this.validateUsername, message: '用户名已存在' }
      ],
      validateTrigger: 'onBlur'
    });
    const passwordFieldDecorator = getFieldDecorator('password', {
      rules: [
        {required: true, message: '密码不能为空'},
        {validator: ::this.validatePassword},
      ],
      validateTrigger: 'onBlur'
    });
    const repasswordFieldDecorator = getFieldDecorator('repassword', {
      rules: [
        {validator: ::this.confirmPassword}
      ],
      validateTrigger: 'onBlur'
    });
    return (
      <Form horizontal
            onSubmit={::this.hanldeSubmit}>
        <FormItem label="用户名" {...formItemLayout}>
          {usernameFieldDecorator(
            <Input placeholder="请输入用户名"/>
          )}
        </FormItem>
        <FormItem label="密码" {...formItemLayout} help="6~16个字符，区分大小写">
          {passwordFieldDecorator(
            <Input type="password" placeholder="请输入密码"/>
          )}
        </FormItem>
        <FormItem label="密码确认" {...formItemLayout} required>
          {repasswordFieldDecorator(
            <Input type="password" placeholder="请输入密码"/>
          )}
        </FormItem>
        <FormItem {...offsetItemLayout}>
          <Checkbox onChange={::this.handleAgreementChange}>同意<a>{'《网签协议》'}</a></Checkbox>
        </FormItem>
        <FormItem {...offsetItemLayout}>
          <Button style={{marginRight: '8px'}} onClick={preStep}>上一步</Button>
          <Button type="primary" htmlType="submit" disabled={!agreement}>下一步</Button>
        </FormItem>
      </Form>
    );
  }
}
