import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { SecondSignupForm } from 'components/home/SignupForm';
import * as signupActionCreators from 'redux/modules/signup';

@connect(
  () => ({}),
  dispatch => bindActionCreators(signupActionCreators, dispatch)
)
export default class SecondSignupFormContainer extends Component {
  static propTypes = {
    addFormData: PropTypes.func.isRequired,
    submitData: PropTypes.func.isRequired,
    preStep: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
  }
  render() {
    const { form, addFormData, submitData, preStep } = this.props;
    return (
      <SecondSignupForm
        form={form}
        preStep={preStep}
        addFormData={addFormData}
        submitData={submitData}/>
    );
  }
}
