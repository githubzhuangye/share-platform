import React, { PropTypes } from 'react';
import styles from './styles.css';
import { centToYuan, extractStatus, formatDateFromStatrToEnd } from 'helpers/util';
import { COUPON_STATUS, COUPON_TYPE } from 'config/constants';

function DetailItem({label, value}) {
  return (
    <div className={styles.detail_item}>
      <label className={styles.detail_item_label}>{label}</label>
      <span>: </span>
      <span className={styles.detail_item_value}>{value || ''}</span>
    </div>
  );
}

CouponDetail.propTypes = {
  pic: PropTypes.string,
  couponname: PropTypes.string,
  couponfee: PropTypes.string,
  type: PropTypes.string,
  couponcount: PropTypes.string,
  starttime: PropTypes.string,
  endtime: PropTypes.string,
  lockflag: PropTypes.string,
  fetch_num: PropTypes.string,
  use_num: PropTypes.string,
};

export default function CouponDetail({pic, couponname, couponfee, type, couponcount, 
  starttime, endtime, lockflag, fetch_num, use_num}) {
  return (
    <div className={styles.detail}>
      {pic && <div className={styles.detail_img}><img src={pic}/></div>} 
      <div className={styles.detail_text}>
        <div className={styles.detail_row}>
          <DetailItem label="名称" value={couponname}/>
          <DetailItem label="面额" value={`${centToYuan(couponfee)}元`}/>
          <DetailItem label="券类型" value={extractStatus(COUPON_TYPE)(type)}/>
          <DetailItem label="发放总量" value={couponcount}/>
        </div>
        <div className={styles.detail_row}>
          <DetailItem label="有效期" value={formatDateFromStatrToEnd(starttime, endtime)}/>
          <DetailItem label="状态" value={extractStatus(COUPON_STATUS)(lockflag)}/>
          <DetailItem label="领取总量" value={fetch_num}/>
          <DetailItem label="核销总量" value={use_num}/>
        </div>
      </div>
    </div>
  );
}