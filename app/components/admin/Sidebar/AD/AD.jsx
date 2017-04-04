import React, { PropTypes } from 'react';
import * as styles from './styles.css';

export default function AD() {
  return (
    	<div className={styles.container}>
      		<h3>广告位</h3>
      		<div className={styles.innerContainer}>
      			<img src={require('images/ads_1.png')} />
      			<img src={require('images/ads_2.png')} />
      		</div>
    	</div>
  );
}
