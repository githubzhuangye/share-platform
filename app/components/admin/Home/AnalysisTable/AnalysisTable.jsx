import React, { PropTypes } from 'react';
import { Spin } from 'antd';
import styles from './styles.css';

TableItem.propTypes = {
  date: PropTypes.string.isRequired,
  gets: PropTypes.string.isRequired,
  uses: PropTypes.string.isRequired
}

function TableItem({date, gets, uses}) {
  return (
    <ul className={styles.listSec}>
      <li>{date}</li>
      <li>{gets}</li>
      <li>{uses}</li>
    </ul>
  );
}

function NotFound() {
  return (
    <div className={styles.notFound}>没有数据</div>
  );
}

AnalysisTable.propTypes = {
  dataSource: PropTypes.array
}

export default function AnalysisTable({dataSource}) {
  if (!dataSource || dataSource.length === 0) {
    return (
      <div className={styles.notFound}> <Spin loading={true} /></div>
    );
  }
  return (
    <div>
      <div className={styles.checkInner}>
        <ul className={styles.listOne}>
          <li>日期</li>
          <li>发券总数</li>
          <li>核销总数</li>
        </ul>
        <div className={styles.innerBox}>
          <div className={styles.innerCont}>
            {dataSource.map((item, index) => <TableItem key={index} {...item}/>)}
          </div>
        </div>
      </div>
    </div>
  );
}
