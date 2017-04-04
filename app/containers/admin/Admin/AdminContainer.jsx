import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Admin } from 'components/admin';
import * as authActionCreators from 'redux/modules/auth';
import { USER_TYPE } from 'config/constants';

@connect(
  ({auth}) => ({userType: auth.userType}),
  dispatch => bindActionCreators(authActionCreators, dispatch)
)
export default class AdminContainer extends Component {
  static propTypes = {
    userType: PropTypes.number.isRequired,
    handleFetchSaaslist: PropTypes.func.isRequired
  }
  componentDidMount() {
    const { userType, handleFetchSaaslist } = this.props;
    if (userType !== USER_TYPE.BRANDLER.value) {
      handleFetchSaaslist();
    }
  }
  render() {
    return (
      <Admin/>
    );
  }
}
