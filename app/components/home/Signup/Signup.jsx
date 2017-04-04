import React, { Component, PropTypes } from 'react';
import { Steps, Button, Tabs, Icon, Form, Input, Checkbox } from 'antd';
import * as styles from './styles.css';
import { USER_TYPE } from 'config/constants';

import { MainWrapper } from 'components/home';
import { FirstSignupFormContainer, SecondSignupFormContainer, UserTypeSelectionContainer,
  ThirdStepContainer } from 'containers/home/SignupForm';

const { RETAILER, BRANDLER, MIYA } = USER_TYPE;

const TabPane = Tabs.TabPane;
const Step = Steps.Step;

const steps = [{
  title: '选择商户类型'
}, {
  title: '创建账户',
}, {
  title: '完善信息',
}, {
  title: '注册成功',
}].map((s, i) => <Step key={i} title={s.title} />);

function ShowHideWrapper(props) {
  const { step } = props;
  const children = props.children.map((child, index) => (
    <div key={index} style={{display: step === index ? 'block' : 'none'}}>{child}</div>
  ));
  return (
    <div>
      {children}
    </div>
  );
}

export default class Signup extends Component {
  static propsType = {
    step: PropTypes.number.isRequired,
    form: PropTypes.object.isRequired,
    onNextStep: PropTypes.func.isRequired,
    onUserTypeChange: PropTypes.func.isRequired
  }
  render() {
    const { step, form, onNextStep, onUserTypeChange } = this.props;
    return (
      <MainWrapper>
        <div className={styles.container}>
          <Steps current={step} status={step === 3 ? 'finish' : 'process'}>{steps}</Steps>
          <div className={styles.content}>
            <ShowHideWrapper step={step}>
              <UserTypeSelectionContainer/>
              <FirstSignupFormContainer form={form}/>
              <SecondSignupFormContainer onNextStep={onNextStep} form={form}/>
              <ThirdStepContainer/>
            </ShowHideWrapper>
          </div>
          <a className={styles.video} href="http://v.youku.com/v_show/id_XMTc1NDY3MzY5Mg==.html" target="_blank">
            <Icon type="question-circle" style={{color: '#FEC52E', transform: 'scale(1.5)', marginRight: '5px'}}/>
            点击查看注册教程(视频)
          </a>
        </div>
      </MainWrapper>
    );
  }
}
