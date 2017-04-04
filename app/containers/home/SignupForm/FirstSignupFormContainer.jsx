import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FirstSignupForm } from 'components/home/SignupForm';
import * as signupActionCreators from 'redux/modules/signup';

@connect(() => ({}), dispatch => bindActionCreators(signupActionCreators, dispatch))
export default class FirstSignupFormContainer extends Component {
  static propTypes = {
    addFormDataAndGoNext: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
    preStep: PropTypes.func.isRequired
  }
  render() {
    const { addFormDataAndGoNext, form, preStep } = this.props;
    return (
      <FirstSignupForm onSubmit={addFormDataAndGoNext} form={form} preStep={preStep}/>
    );
  }
}
