import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { UserTypeSelection } from 'components/home/SignupForm';
import { nextStep, setUserType } from 'redux/modules/signup';

@connect(
  ({signup}) => ({userType: signup.userType}),
  { nextStep, setUserType }
)
class UserTypeSelectionContainer extends React.Component {
  static propTypes = {
    userType: PropTypes.number.isRequired,
    nextStep: PropTypes.func.isRequired,
    setUserType: PropTypes.func.isRequired
  }
  render () {
    const { userType, nextStep, setUserType } = this.props;
    return (
      <UserTypeSelection
        userType={userType}
        nextStep={nextStep}
        onChange={setUserType}/>
    );
  }
}

export default UserTypeSelectionContainer;
