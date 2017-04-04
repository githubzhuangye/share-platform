import React, { Component, PropTypes } from 'react';
import { Button, Form, Input, Checkbox, Select, Icon, message } from 'antd';
import classnames from 'classnames';
import { Link } from 'react-router';
import * as styles from './thirdStep.css';
import { authApi } from 'api';

export default class ThirdStep extends Component {
  static propTypes = {
    step: PropTypes.number.isRequired,
    userInfo: PropTypes.object.isRequired,
    handleAuth: PropTypes.func.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired
  }
  state = {
    seconds: 3,
  }
  timer = null
  componentWillReceiveProps() {
    if (this.props.step === 3) {
      this.startTimer();
    }
  }
  componentWillUnmount() {
    this.clearTimer();
  }
  startTimer() {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      const seconds = this.state.seconds - 1;
      if (seconds === 0) {
        this.jumpToAdmin();
        return;
      }
      this.setState({seconds});
    }, 1000);
  }
  clearTimer() {
    clearInterval(this.timer);
    this.timer = null;
  }
  async jumpToAdmin() {
    const { userInfo, handleAuth } = this.props;
    this.clearTimer();
    try {
      await handleAuth(userInfo);
      this.context.router.replaceWith('/admin');
    } catch(e) {
      message.error(e.message);
    }
  }
  render() {
    return (
      <div className={styles.container}>
        <span><img src={require('images/success.png')}/></span>
        <p className={styles.info}>恭喜您,注册成功!</p>
        <p onClick={::this.jumpToAdmin} className={classnames('ant-btn', 'ant-btn-primary', styles.jump)}>立即跳转</p>
        <p className={styles.time}>{this.state.seconds}s后自动跳转</p>
      </div>
    );
  }
}
