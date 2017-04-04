import React, { PropTypes } from 'react';
import { Popover } from 'antd';
import * as styles from './styles.css';
import { host } from 'config/constants';

let qrCodeImg = require('images/qrcode.png');
if (window.env == 'undefined' || window.env == undefined) qrCodeImg = require('images/br_def.png');
switch (window.env) {
  case 'prod': qrCodeImg = require('images/br_prod.png'); break;
  case 'beta': qrCodeImg = require('images/br_beta.png'); break;
  case 'test': qrCodeImg = require('images/br_test.png'); break;
}

const content = (
  <div className={styles.brcodeWrap}>
    <img src={require('images/br_tit.png')} />
    <img style={{width: 100,display: 'block',margin: '0 auto',marginBottom: 10}} src={qrCodeImg} />
  </div>
);

export const Qrcode = React.createClass({
  	render() {
	  	return (
	  		<Popover placement="rightTop" content={content} trigger="click">
	    			<div className={styles.qrContainer}>
    					<p>快点我，召唤二维码吧！</p>
    					<img src={require('images/qrcode.png')} />
	    			</div>
	    		</Popover>
	  	);
	},
});
