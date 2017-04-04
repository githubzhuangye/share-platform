import React, { Component } from 'react';
import classnames from 'classnames';
import * as styles from './styles.css';

export default function Footer(props) {
  return (
    <div className={classnames(props.className, styles.container)}>
      <div className={styles.ulContainer}>
        <ul>
          <li><a href="#">关于会花</a></li>
          <li><a href="#">联系方式</a></li>
          <li><a href="#">帮助中心</a></li>
          <li><a href="#">合作伙伴</a></li>
        </ul>
      </div>
      <p>Copyright © 2015  MiYa Technology  All rights Reserved</p>
    </div>
  );
}
