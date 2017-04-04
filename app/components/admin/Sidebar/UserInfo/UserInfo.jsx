import React, { PropTypes } from 'react';
import { Modal, Icon, Popover } from 'antd';
import styles from './styles.css';
import { MessageBoxContainer } from 'containers/admin';
import { Setting } from 'components/admin';
import { shortenStr } from 'helpers/util';

const ListItem = ({icon, text, onClick}) => (
  <span className={styles.messagesAndSettingItem} onClick={onClick}>
    <Icon type={icon}/>
    <span style={{marginLeft: '4px'}}>{text}</span>
  </span>
);

export default class UserInfo extends React.Component {
  static propTyps = {
    username: PropTypes.string.isRequired,
    saasLogo: PropTypes.string,
    messageCount: PropTypes.number.isRequired,
    onViewBtnClick: PropTypes.func.isRequired,
  }
  state = {
    settingVisible: false,
  }
  toggleSettingVisible() {
    this.setState({settingVisible: !this.state.settingVisible});
  }
  render() {
    const { username, saasLogo, messageCount, onViewBtnClick } = this.props;
    const { settingVisible } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.logo}>
          <img src={saasLogo ? saasLogo : require('images/avator.png')} onClick={::this.toggleSettingVisible}/>
        </div>
        <p className={styles.username}>
          {username.length > 12
          ? <Popover content={username} overlayStyle={{width: '200px'}}>
              <span>{shortenStr(username, 11)}</span>
            </Popover>
          : <span>{username}</span>}
        </p>
        <div className={styles.messagesAndSetting}>
          <ListItem icon="mail" text="消息" onClick={onViewBtnClick}/>
          <span className={styles.divider}></span>
          <ListItem icon="setting" text="设置" onClick={::this.toggleSettingVisible}/>
        </div>
        <Setting visible={settingVisible} onClose={::this.toggleSettingVisible}/>
        <MessageBoxContainer/>
      </div>
    );
  }
}
