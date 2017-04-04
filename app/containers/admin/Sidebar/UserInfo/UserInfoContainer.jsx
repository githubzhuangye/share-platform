import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { UserInfo } from 'components/admin/Sidebar';
import * as messageBoxActionCreators from 'redux/modules/messageBox';

@connect(
  ({auth, messageBox}) => ({
    username: auth.username,
    saasLogo: auth.saasLogo,
    unread: messageBox.unread,
  }),
  dispatch => bindActionCreators(messageBoxActionCreators, dispatch)
)
class UserInfoContainer extends React.Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    saasLogo: PropTypes.string,
    unread: PropTypes.number.isRequired,
    openModal: PropTypes.func.isRequired,
  }
  render () {
    const { username, unread, saasLogo, openModal } = this.props;
    return (
      <UserInfo
        username={username}
        saasLogo={saasLogo}
        messageCount={unread}
        onViewBtnClick={openModal}/>
    );
  }
}

export default UserInfoContainer;
