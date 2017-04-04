import React, { PropTypes, Component } from 'react';
import { Modal, Tabs } from 'antd';
import ProfileSetting from './ProfileSetting.jsx';
import PasswordSetting from './PasswordSetting.jsx';
import { ProfileSettingContainer } from 'containers/admin/Setting';

const TabPane = Tabs.TabPane;

export default class Setting extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  }
  render() {
    const { visible, onClose } = this.props;
    return visible === true
    ? (
      <Modal title={null} footer={null} visible={true} onCancel={onClose}>
        <Tabs>
          <TabPane tab="个人设置" key="1">
            <ProfileSettingContainer/>
          </TabPane>
          <TabPane tab="密码设置" key="2">
            <PasswordSetting/>
          </TabPane>
        </Tabs>
      </Modal>
    )
    : null;
  }
}
