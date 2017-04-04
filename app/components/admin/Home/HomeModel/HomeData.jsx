import React from 'react';
import { Row, Col } from 'antd';
import * as styles from './styles/homeData.css';
import classnames from 'classnames';
import DataAbout, { Retailer } from './Data/DataAbout';


export const YesterDayData = React.createClass({
	render() {
	    	return (
		      	<Retailer/>
	    	);
  	},
});

export const BottomShowData = React.createClass({
  render() {
        return (
            <Row className={styles.goodJob}>
                   
                   <Col span={22} offset={1} className={styles.goodDataWrap}>

                          <Col span={24} className={styles.goodTitle}>他们做的不错！</Col>

                          <Col span={8} className={styles.goodData}>
                                <div className={styles.goodDataBox}>
                                      <img src={require('images/bt_1.jpg')} />

                                      <p>永辉超市</p>

                                      <Col span={24} className={classnames(styles.goodHoverData,styles.aniEase)}>
                                            <div className={styles.btLine}></div>
                                             <Col span={10} offset={7}>
                                                   <h6 className={styles.bottomName}><span>核销门店数:</span><span>445</span></h6>
                                                   <h6 className={styles.bottomName}><span>核销券总数:</span><span>192065</span></h6>
                                                   <h6 className={styles.bottomName}><span>累计用户数:</span><span>514704</span></h6>
                                             </Col>
                                      </Col>

                                </div>
                         </Col>

                         <Col span={8} className={styles.goodData}>
                                <div className={styles.goodDataBox}>
                                      <img src={require('images/bt_2.jpg')} />
                                      <p>美特好</p>

                                      <Col span={24} className={classnames(styles.goodHoverData,styles.aniEase)}>
                                            <div className={styles.btLine}></div>
                                             <Col span={10} offset={7}>
                                                   <h6 className={styles.bottomName}><span>核销门店数:</span><span>16</span></h6>
                                                   <h6 className={styles.bottomName}><span>核销券总数:</span><span>36524</span></h6>
                                                   <h6 className={styles.bottomName}><span>累计用户数:</span><span>30260</span></h6>
                                             </Col>

                                      </Col>

                                </div>
                         </Col>

                         <Col span={8} className={styles.goodData}>
                                <div className={styles.goodDataBox}>
                                      <img src={require('images/bt_3.jpg')} />
                                      <p>周黑鸭</p>

                                      <Col span={24} className={classnames(styles.goodHoverData,styles.aniEase)}>
                                            <div className={styles.btLine}></div>
                                             <Col span={10} offset={7}>
                                                   <h6 className={styles.bottomName}><span>核销门店数:</span><span>814</span></h6>
                                                   <h6 className={styles.bottomName}><span>核销券总数:</span><span>513508</span></h6>
                                                   <h6 className={styles.bottomName}><span>累计用户数:</span><span>466376</span></h6>
                                             </Col>
                                      </Col>

                                </div>
                         </Col>

                   </Col>
                  <Col span={22} offset={1} className={styles.goodDataWrap}>
                    <img src={require('images/bt_info.png')} />
                  </Col>
             </Row>
        );
    },
});

