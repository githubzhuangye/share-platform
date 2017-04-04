import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Header } from 'components/admin';
import * as authActionCreators from 'redux/modules/auth';
import * as analysisModalActionCreators from 'redux/modules/analysisModal';
import store, { RESET } from 'config/store';
import { USER_TYPE } from 'config/constants';

@connect(
  ({auth}) => ({username: auth.username, userType: auth.userType}),
  dispatch => bindActionCreators({...authActionCreators, ...analysisModalActionCreators}, dispatch)
)
class HeaderContainer extends React.Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    userType: PropTypes.number.isRequired,
    handleLogout: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired
  }
  static contextTypes = {
    router: PropTypes.object.isRequired
  }
  handleLogoutBtnClick() {
    this.props.handleLogout()
      .then(this.context.router.replaceWith('/'))
      .then(() => store.dispatch({type: RESET}))
  }
  handleAnalysisModalOpen() {
    const { userType, openModal } = this.props;
    if (userType === USER_TYPE.MIYA.value) {
      openModal();
    }
  }
  render () {
    const { username, userType, handleLogout } = this.props;
    return (
      <Header
        username={username}
        userType={userType}
        onLogoutBtnClick={::this.handleLogoutBtnClick}
        onAnalysisModalOpen={::this.handleAnalysisModalOpen}/>
    );
  }
}

export default HeaderContainer;
