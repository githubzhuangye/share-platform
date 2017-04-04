import React, { PropTypes } from 'react';
import { Modal, Row, Col } from 'antd';
import moment from 'moment';
import classnames from 'classnames';
import { StatusIcon } from 'components/admin';
import * as styles from './ticketInfoModal.css';
import { COUPON_TYPE, COUPON_STATUS } from 'config/constants';
import { ticketStatusColor, extractStatus, centToYuan, formatDateFromStatrToEnd } from 'helpers/util';

const { FRESH } = COUPON_TYPE;

function Title({title, status}) {
  return (
    <div className={styles.titleContainer}>
      <h2>{title}</h2>
      <span><StatusIcon color={ticketStatusColor(status)}/>{extractStatus(COUPON_STATUS)(status)}</span>
    </div>
  );
}

TicketInfoModal.propTypes = {
  ticketInfo: PropTypes.object.isRequired,
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired
};

const Slash = () => (
  <div className={styles.slash}></div>
);

export default function TicketInfoModal({visible, onCancel, ticketInfo}) {
  const { couponname, type, couponfee, minfee, goodid, starttime, endtime, memo,
    shopcount, couponcount, lockflag, count, fetch_num, use_num, interval_discount } = ticketInfo;
  return (
    <Modal
      title={<Title title={couponname} status={lockflag}/>}
      visible={visible}
      onCancel={onCancel}
      width={600}
      footer={null}>
      <Row className={styles.row}>
        <Col span={3} className={styles.desc}>券种类</Col>
        <Col span={5} className={styles.content}>{extractStatus(COUPON_TYPE)(type)}</Col>
        <Col span={3} className={styles.desc}>券面额</Col>
        <Col span={5} className={classnames({[styles.content]: +type !== FRESH.value})}>
          {+type === FRESH.value ? <Slash/> : `${centToYuan(couponfee)}元`}
        </Col>
        <Col span={3} className={styles.desc}>使用条件</Col>
        <Col span={5} className={classnames({[styles.content]: +type !== FRESH.value})}>
          {+type === FRESH.value ? <Slash/> : +minfee && `满${centToYuan(minfee)}元` || '无'}
        </Col>
      </Row>
      <Row className={styles.row}>
        <Col span={3} className={styles.desc}>商品编码</Col>
        <Col span={5} className={styles.content}>{goodid}</Col>
        <Col span={3} className={styles.desc}>限领次数</Col>
        <Col span={5} className={styles.content}>{count}</Col>
        <Col span={3} className={styles.desc}>发放总量</Col>
        <Col span={5} className={styles.content}>{`${couponcount}张`}</Col>
      </Row>
      <Row className={styles.row}>
        <Col span={3} className={styles.desc}>门店数</Col>
        <Col span={5} className={styles.content}>{`${shopcount}家`}</Col>
        <Col span={3} className={styles.desc}>领取数量</Col>
        <Col span={5} className={styles.content}>{`${fetch_num}张`}</Col>
        <Col span={3} className={styles.desc}>核销数量</Col>
        <Col span={5} className={styles.content}>{`${use_num}张`}</Col>
      </Row>
      <Row className={styles.row}>
        <Col span={3} className={styles.desc}>券有效期</Col>
        <Col span={21} className={styles.content}>{formatDateFromStatrToEnd(starttime, endtime)}</Col>
      </Row>
      {+type === FRESH.value &&
        <Row className={styles.row}>
          <Col span={3} className={styles.desc}>券规则</Col>
          <Col span={21} className={classnames(styles.content, styles.freshRule)}>
            {interval_discount.map((rule, index) => <p key={index}>{rule.str}</p>)}
          </Col>
        </Row>
      }
    </Modal>
  );
}
