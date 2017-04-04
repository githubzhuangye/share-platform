import React, { PropTypes, Component } from 'react';
import { Form, Input, Row, Col, Button, message } from 'antd';
import { checkPaasword, validateFields } from 'helpers/util';
import { settingApi } from 'api';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 16},
};

@Form.create()
export default class PasswordSetting extends Component {
  state = {
    oldPasswordValid: false,
  }
  checkOldPassword(rule, value, callback) {
    settingApi.validatePassword(value)
      .then(code => {
        if (parseInt(code) === 200) {
          this.setState({oldPasswordValid: true});
          callback();
        } else {
          this.setState({oldPasswordValid: false});
          callback('密码错误！');
        }
      });
  }
  checkNewPassword(rule, value, callback) {
    if (checkPaasword(value)) {
      callback();
    } else {
      callback('密码长度不符，请输入6-16位密码');
    }
  }
  checkConfirmPaasword(rule, value, callback) {
    const newPassword = this.props.form.getFieldValue('newPassword');
    if (newPassword === value) {
      callback();
    } else {
      callback('两次输入密码不同！');
    }
  }
  handleSubmit() {
    validateFields(this.props.form)
      .then(values => {
        settingApi.updatePassword(values.newPassword, values.oldPassword)
          .then(data => {
            if (parseInt(data.code) === 200) {
              message.success('密码更新成功');
            } else {
              message.error(data.msg);
            }
          });
      })
      .catch(console.log);
  }
  getFieldDecorators() {
    const { getFieldDecorator } = this.props.form;
    const oldPassword = getFieldDecorator('oldPassword', {
      rules: [{validator: ::this.checkOldPassword}],
      validateTrigger: 'onBlur',
    });
    const newPassword = getFieldDecorator('newPassword', {
      rules: [{validator: ::this.checkNewPassword}],
      validateTrigger: 'onBlur',
    });
    const confirmPassword = getFieldDecorator('confirmPassword', {
      rules: [{validator: ::this.checkConfirmPaasword}],
      validateTrigger: 'onBlur',
    });
    return {
      oldPassword,
      newPassword,
      confirmPassword,
    };
  }
  render() {
    const { oldPasswordValid } = this.state;
    const fieldDecorators = this.getFieldDecorators();
    return (
      <Form style={{marginTop: '8px', height: '400px'}}>
        <FormItem label="旧密码" {...formItemLayout}>
          {fieldDecorators['oldPassword'](
            <Input type="password" placeholder="请输入旧密码"/>
          )}
        </FormItem>
        <FormItem label="新密码" {...formItemLayout} help="6~16个字符，区分大小写">
          {fieldDecorators['newPassword'](
            <Input type="password" placeholder="请输入新密码" disabled={!oldPasswordValid}/>
          )}
        </FormItem>
        <FormItem label="确认新密码" {...formItemLayout}>
          {fieldDecorators['confirmPassword'](
            <Input type="password" placeholder="请再次输入新密码" disabled={!oldPasswordValid}/>
          )}
        </FormItem>
        <Row>
          <Col offset={6}>
            <Button type="primary" disabled={!oldPasswordValid} onClick={::this.handleSubmit}>修改</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}
