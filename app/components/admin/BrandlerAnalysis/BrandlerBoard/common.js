import React from 'react';
import styles from './common.css';
import TrendPersent from './TrendPersent.jsx';

export function getTrendTemplate(yesterdayText, totalText) {
  return function({pre = '', total = '', pp = '', daylipp = ''}) {
    return (
      <div>
        <div>{yesterdayText}:</div>
        <div className={styles.number}>{pre}</div>
        <div className={styles.bottomLeft}>
          <div>{totalText}:</div>
          <div className={styles.red}>{total}</div>
        </div>
        <div className={styles.bottomRight}>
          <div>周环比：<TrendPersent persent={pp}/></div>
          <div>日环比：<TrendPersent persent={daylipp}/></div>
        </div>
      </div>
    );
  }
}

export function getTotalTemplate() {
  return function({goodname = '', totaluse = '', totalget = ''}) {
    return (
      <div>
        <div className={styles.No1}>{'NO.1'}</div>
        <div className={styles.No1Text}>{goodname}</div>
        <div className={styles.bottomLeft}>
          <div>核券总数:</div>
          <div className={styles.red}>{totaluse}</div>
        </div>
        <div className={styles.bottomRight}>
          <div>领券总数:</div>
          <div className={styles.red}>{totalget}</div>
        </div>
      </div>
    );
  }
}
