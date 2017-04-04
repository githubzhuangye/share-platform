import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { handleAuth } from 'redux/modules/auth';

import { ThirdStep } from 'components/home/SignupForm';

@connect(
  ({signup}) => ({
    step: signup.step,
    userInfo: {accountId: signup.formData.account_id, pwd: signup.formData.password},
  }),
  { handleAuth },
)
class ThirdStepContainer extends React.Component {
  static propTypes = {
    step: PropTypes.number.isRequired,
    userInfo: PropTypes.object.isRequired,
    handleAuth: PropTypes.func.isRequired,
  }
  render () {
    return (
      <ThirdStep {...this.props}/>
    );
  }
}

export default ThirdStepContainer;
