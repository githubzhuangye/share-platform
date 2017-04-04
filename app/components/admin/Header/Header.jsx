import React, { PropTypes, Component } from 'react';
import * as styles from './styles.css';
import { USER_TYPE } from 'config/constants';

import { AnalysisModalContainer } from 'containers/admin/Home';
import { VideoList } from 'components/admin';

export default class Header extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    userType: PropTypes.number.isRequired,
    onLogoutBtnClick: PropTypes.func.isRequired,
    onAnalysisModalOpen: PropTypes.func.isRequired
  }
  state = {
    videoListVisible: false,
  }
  timer = null
  handleVideoMouseOver() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    } else {
      this.setState({videoListVisible: true});
    }
  }
  handleVideoMouseOut() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setState({videoListVisible: false});
      this.timer = null;
    }, 300);
  }
  render() {
    const { username, userType, onLogoutBtnClick, onAnalysisModalOpen } = this.props;
    const { videoListVisible } = this.state;
    return (
      <div className={styles.colorWrapper}>
        <div className={styles.container}>
          <h2 className={styles.title}>数字营销共享平台</h2>
          <div className={styles.info}>
            <span className={styles.infoPos} onClick={onAnalysisModalOpen}>{username}</span>
            <a className={styles.logout} onClick={onLogoutBtnClick}>退出</a>
            <span className={styles.slash}>|</span>
            <span
              className={styles.video}
              onMouseOver={::this.handleVideoMouseOver}
              onMouseOut={::this.handleVideoMouseOut}>
              视频教程
            </span>
            <span className={styles.slash}>|</span>
            <span>客服电话：0571-86077510</span>
          </div>
        </div>
        <VideoList
          visible={videoListVisible}
          onMouseOver={::this.handleVideoMouseOver}
          onMouseOut={::this.handleVideoMouseOut}/>
        {userType === USER_TYPE.MIYA.value
        ? <AnalysisModalContainer/>
        : null}
      </div>
    );
  }
}
