import React, {PropTypes} from 'react';
import {
    Row,
    Col,
    Steps,
    Menu,
    Dropdown,
    Icon,
    Modal,
    Button,
    Popover
} from 'antd';
import classnames from 'classnames';
import * as styles from './styles.css';
import HomeChart from 'components/admin/Charts/HomeChart';
import HomeData, {YesterDayData, BottomShowData} from './HomeModel/HomeData';
import {HomeNavContainer} from 'containers/admin/Home';

let qrCodeImg = require('images/br_def.png');
if (window.env == 'undefined' || window.env == undefined)
    qrCodeImg = require('images/br_def.png');
switch (window.env) {
    case 'prod':
        qrCodeImg = require('images/br_prod.png');
        break;
    case 'beta':
        qrCodeImg = require('images/br_beta.png');
        break;
    case 'test1':
        qrCodeImg = require('images/br_test.png');
        break;
    case 'test2':
        qrCodeImg = require('images/br_test.png');
        break;
}

const content = (
    <div className={styles.brcodeWrap}>
        <img className={styles.brShowImg} src={qrCodeImg}/>
        <p style={{
            textAlign: 'center',
            color: '#000'
        }}>扫码查看领券页面</p>
    </div>
);

const Qrcode = React.createClass({
    getInitialState: function() {
        return {initImg: require('images/get_coupon_def.png')}
    },
    handMouseEnter: function(event) {
        this.setState({initImg: require('images/get_coupon_act.png')})
    },
    handMouseLeave: function(event) {
        this.setState({initImg: require('images/get_coupon_def.png')})
    },
    render() {
        return (
            <Popover placement="bottomRight" content={content} trigger="hover">
                <div className={styles.qrContainer}>
                    <img src={this.state.initImg} onMouseEnter={this.handMouseEnter} onMouseLeave={this.handMouseLeave}/>
                </div>
            </Popover>
        );
    }
});

export default function Home() {
    return (
        <div className={classnames(styles.homeWrap, styles.aniEase)}>
            <div className={styles.homeTop}>
                <Row className={styles.topInner}>
                    <Col span={9} offset={1}>
                        <p className={styles.innerLeft}>随时发券，随时管理，随时分析！营销就是这么简单！</p>
                    </Col>
                    <Col span={10} offset={1}>
                        <img className={styles.liBa} src={require('images/li_ba.gif')}/>
                        <Qrcode/>
                    </Col>
                    <img className={styles.hTip} src={require('images/home_tip.png')}/>
                </Row>

                <HomeNavContainer/>

            </div>

            <div className={classnames(styles.homeMain, styles.aniEase)}>

                <Row>
                    <Col span={6} className={styles.homeTitle}>
                        <Icon type="bars"/>平台数据 Platform Data
                    </Col>
                </Row>

                <YesterDayData/>

                <Row>
                    <Col span={6} className={styles.homeTitle}>
                        <Icon type="bars"/>核销曲线 Verification Sheet
                    </Col>
                </Row>

                <HomeChart/>

                <Row>
                    <Col span={6} className={styles.homeTitle}>
                        <Icon type="bars"/>我们的商户 Our Business
                    </Col>
                </Row>

                <BottomShowData/>

            </div>
        </div>
    );
}
