import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
import { createForm } from 'rc-form';
import Input from './InputItem';
import * as styles from './styles.css';
import * as globalStyles from 'sharedStyles/global.css';

@createForm()
export default class LoginForm extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    error: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
  }
  handleSubmit(e) {
    e.preventDefault();
    const formData = this.props.form.getFieldsValue();
    this.props.onSubmit(formData);
  }
  render() {
    const { error, onBlur } = this.props;
    const { getFieldProps } = this.props.form;
    return (
      <div className={styles.container}>
        <h3 className={styles.header}>账户登陆</h3>
        <form>
          <Input
            {...getFieldProps('accountId')}
            onBlur={onBlur}
            type="text" placeholder="用户名" iconUrl={require('images/user.png')}/>
          <Input
            {...getFieldProps('pwd')}
            onBlur={onBlur}
            type="password" placeholder="密码" iconUrl={require('images/password.png')}/>
          { error ? <p className={styles.error}>{error}</p> : null}
          <div className={styles.signup}>
            <p><Link to="/findpsd" className={classnames(styles.link, globalStyles.floatLeft)}>忘记登陆密码</Link></p>
            <p><Link id="signupBtn" to="/signup" className={classnames(styles.link, globalStyles.floatRight)}>免费注册</Link></p>
          </div>
          <button className={styles.button} onClick={::this.handleSubmit}>登陆</button>
        </form>
        <p className={styles.contact}>联系客服：0571-86077510</p>
      </div>
    );
  }
}
