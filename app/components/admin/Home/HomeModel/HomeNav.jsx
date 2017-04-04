import React, { PropTypes, Component } from 'react';
import { Row, Col, Menu, Dropdown, Icon } from 'antd';
import classnames from 'classnames';
import { Link } from 'react-router';
import * as styles from './styles/homeNav.css';
import { navigateTo } from 'helpers/util';

import { HMenuContainer } from 'containers/admin';

export default class HomeNav extends Component {
  static propTypes = {
    nav: PropTypes.array.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  render() {
    const [ coupon, manage, analysis ] = this.props.nav;
    const { router } = this.context;
    return (
      <Row>
        <Col span={5} offset={1} className={styles.homeMiddle}>
          <HMenuContainer menu={coupon}>
            <span 
              className={styles.triggerBtn}
              onClick={() => navigateTo(coupon[0].url, router)}>
              <div>
                <img src={require('images/icon_2.png')} />
              </div>
              <p className={styles.btnName}>我要<span className={styles.font22}>发券</span> ></p>
            </span>
          </HMenuContainer>
        </Col>
        <Col span={5} className={styles.homeMiddle}>
          <HMenuContainer menu={manage}>
            <span 
              className={styles.triggerBtn} 
              onClick={() => navigateTo(manage[0].url, router)}>
              <div>
                <img src={require('images/icon_3.png')} />
              </div>
              <p className={styles.btnName}>我要<span className={styles.font22}>管理</span> ></p>
            </span>
          </HMenuContainer>
        </Col>
        <Col span={5} className={styles.homeMiddle}>
          <HMenuContainer menu={analysis}>
            <span 
              className={styles.triggerBtn}
              onClick={() => navigateTo(analysis[0].url, router)}>
              <div>
                <img src={require('images/icon_4.png')} />
              </div>
              <p className={styles.btnName}>我要<span className={styles.font22}>分析</span> ></p>
            </span>
          </HMenuContainer>
        </Col>
        <Col span={6} offset={2} className={classnames(styles.homeMiddle,styles.fontColors)}>
            <p>1.顾客每天都流失，如何管理？</p>
            <p>2.淡季客流少怎么办？</p>
            <p>3.不知道自己的沉睡粉丝到哪里去了？</p>
            <p>4.活动空档期怎么发券？</p>
            <p>...</p>
        </Col>
      </Row>);
  }
}