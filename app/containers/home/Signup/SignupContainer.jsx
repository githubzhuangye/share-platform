import React, { Component, PropTypes } from 'react';
import { Form } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Signup } from 'components/home';
import * as signupActionCreators from 'redux/modules/signup';
import * as authActionCreators from 'redux/modules/auth';

@Form.create()
@connect(({signup}) => ({
  step: signup.step,
  userType: signup.userType
}), dispatch => bindActionCreators({...signupActionCreators, ...authActionCreators}, dispatch))
export default class SignupContainer extends Component {
  static propTypes = {
    step: PropTypes.number.isRequired,
    form: PropTypes.object.isRequired,
    setUserType: PropTypes.func.isRequired,
    resetState: PropTypes.func.isRequired
  }
  componentDidMount() {
    this.props.resetState();
  }
  handleUserTypeChange(userType) {
    this.props.setUserType(userType);
  }
  render() {
    const { form, step } = this.props;
    return (
      <Signup step={step} form={form}
        onUserTypeChange={::this.handleUserTypeChange}/>
    );
  }
}
