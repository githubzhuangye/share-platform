import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { setUsername, setSaasLogo } from 'redux/modules/auth';
import { ProfileSetting } from 'components/admin/Setting';

@connect(
  () => ({}),
  { setUsername, setSaasLogo },
)
export default class ProfileSettingContainer extends Component {
  static propTypes = {
    setUsername: PropTypes.func.isRequired,
    setSaasLogo: PropTypes.func.isRequired,
  }
  render() {
    const { setUsername, setSaasLogo } = this.props;
    return (
      <ProfileSetting
        setUsername={setUsername}
        setSaasLogo={setSaasLogo}/>
    );
  }
}
