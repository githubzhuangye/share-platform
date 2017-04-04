import React, { Component, PropTypes } from 'react';
import { Steps, Button, Tabs, Icon, Form, Input, Checkbox,message } from 'antd';
const createForm = Form.create;
const FormItem = Form.Item;
import * as styles from './styles.css';
import md5 from "md5";
import { pwdValicode,resetPwd } from './AjaxData';
import { USER_TYPE,SIGN_KEY } from 'config/constants';

const { RETAILER, BRANDLER, MIYA } = USER_TYPE;
import { MainWrapper } from 'components/home';

@createForm()
export default class FindPsw extends Component {
  state={
    btnDisabled:true,
    getValidateBtn:"获取验证码",
    validateLoading:false,
    submitLoading:false
  }
  static propsType = {
    form: PropTypes.object.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired
  }
   handleReset(e) {
    e.preventDefault();
    this.props.form.resetFields();
  }
  signKey(account_id){
    let signstr = "&account_id="+account_id+"&signkey="+SIGN_KEY;
    return md5(signstr).toUpperCase();
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        console.log('Errors in form!!!');
        return;
      };
      let self=this;
      let requestData={
        account_id:values.name,
        password:values.passwd,
        code:values.validate,
        sign:self.signKey(values.name)
      };
      self.setState({
        submitLoading:true
      });
      resetPwd(requestData,function (data) {
        self.setState({
          submitLoading:false
        });
        if(parseInt(data.code)!=200){
          message.error(data.msg)
        }else{
          message.success("密码修改成功，去登陆吧！");
          setTimeout(function(){
            self.context.router.replace('/');
          },1500)
        }
      })

    });
  }

  userExists(rule, value, callback) {
    if (!value) {
      callback([new Error("请输入用户名！")]);
       this.setState({
            btnDisabled:true
          })
    } else {
      var reg=/^1[34578]\d{9}$/;
      setTimeout(function() {
        if (0) {
          callback([new Error("请输入正确的用户名！")]);
           this.setState({
            btnDisabled:true
          })
        } else {
          this.setState({
            btnDisabled:false
          })
          callback();
        }
      }.bind(this), 500);

    }
  }

  checkPass(rule, value, callback) {
    const { validateFields } = this.props.form;
    if (!value) {
      //validateFields(['rePasswd'], { force: true });
      callback();
    }else if(value.length<6 || value.length >16){
      callback("密码长度需介于6-16个字符之间");
    }
    callback();
  }

  checkPass2(rule, value, callback) {
    const { getFieldValue } = this.props.form;
    if (value && value !== getFieldValue('passwd')) {
      callback('两次输入密码不一致！');
    } else {
      callback();
    }
  }
  componentWillUnmount(){
    clearInterval(this.timer);
  }
  getValidate(){
    const { getFieldProps } = this.props.form;
    let account_id=getFieldProps(["name"]).value;
    let self=this;
    let count=60;
    let requestData={
      account_id:account_id,
      sign:this.signKey(account_id)
    };
    self.setState({
           validateLoading:true
          });


    pwdValicode(requestData,function(data){
      if(parseInt(data.code)!=200){
          message.error(data.msg,10);
          clearInterval(self.timer);
          self.setState({
            getValidateBtn:"获取验证码",
            btnDisabled:false,
            validateLoading:false
          });
          count=60;
        }else{
             self.setState({
              getValidateBtn:count--+"秒",
              btnDisabled:true,
              validateLoading:false
            });
           self.timer = setInterval(function(){
            if(count<=0){
              clearInterval(self.timer);
              self.setState({
                getValidateBtn:"获取验证码",
                btnDisabled:false
              });
              count=60;
            }else{
              self.setState({
                getValidateBtn:count--+"秒",
                btnDisabled:true
              });
            }
          },1000);
        }
    })
  }
  render() {
    const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
    const nameProps = getFieldProps('name', {
      rules: [
        { validator: ::this.userExists },
      ],
    });
    const emailProps = getFieldProps('validate', {
      validate: [{
        rules: [
          { required: true, message: '请输入验证码' },
        ],
        trigger: 'onBlur',
      }],
    });
    const passwdProps = getFieldProps('passwd', {
      rules: [
        { required: true, whitespace: true, message: '请填写密码' },
        { validator: ::this.checkPass },
      ],
    });
    const rePasswdProps = getFieldProps('rePasswd', {
      rules: [{
        required: true,
        whitespace: true,
        message: '请再次输入密码',
      }, {
        validator: ::this.checkPass2,
      }],
    });
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 17 },
    };
    const formItemLayout2 = {
      labelCol: { span: 4 },
      wrapperCol: { span: 19 },
    };
    return (
      <MainWrapper>
        <div className={styles.container}>
          <div className={styles.contentLeft}>
            <Form horizontal>
              <FormItem
                  {...formItemLayout2}
                  label="用户名"
                  required
                  help={isFieldValidating('name') ? '校验中...' : (getFieldError('name') || []).join(', ')}
              >
                <Input {...nameProps} placeholder="请输入用户名" className={styles.telStyle}/>
                <Button type="ghost" onClick={::this.getValidate} disabled={this.state.btnDisabled} loading={this.state.validateLoading}  className={styles.getValidate}>{this.state.getValidateBtn}</Button>
              </FormItem>

              <FormItem
                  {...formItemLayout}
                  label="验证码"
              >
                <Input {...emailProps} ref="validateInput" placeholder="请输入验证码" />
              </FormItem>

              <FormItem

                  {...formItemLayout}
                  label="密码"
              >
                <Input {...passwdProps} type="password" autoComplete="off" placeholder="请输入新密码"

                />
              </FormItem>

              <FormItem
                  {...formItemLayout}
                  label="确认密码"
              >
                <Input {...rePasswdProps} type="password" autoComplete="off" placeholder="请再次输入密码"

                />
              </FormItem>

              <FormItem wrapperCol={{ span: 12, offset: 7 }}>
                <Button type="ghost" onClick={::this.handleReset}>重置</Button>
                &nbsp;&nbsp;&nbsp;
                <Button type="primary" onClick={::this.handleSubmit} loading={this.state.submitLoading} >确定</Button>
              </FormItem>
            </Form>
          </div>
          <div className={styles.contentRight}>
              <ul>
                <li>·您的密码长度需介于6-16个字符之间</li>
                <li>·您的密码只能包括英文字母（A-Z/a-z），数字（0-9）以及标点符号</li>
              </ul>
          </div>

        </div>
      </MainWrapper>
    );
  }
}
