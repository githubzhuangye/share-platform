import React, { PropTypes } from 'react';
import { Row, Col, Radio, Button } from 'antd';
import { USER_TYPE } from 'config/constants';
import * as styles from './userTypeSelection.css';

const RadioGroup = Radio.Group;
const { RETAILER, BRANDLER } = USER_TYPE;

UserTypeSelection.propTypes = {
  userType: PropTypes.number.isRequired,
  nextStep: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};

export default function UserTypeSelection({onChange, userType, nextStep}) {
  return (
    <div className={styles.container}>
      <Row>
        <Col span={6} className={styles.alignRight}>您想成为:</Col>
        <Col span={14}>
          <RadioGroup onChange={(e) => onChange(e.target.value)} value={userType}>
            <Radio value={RETAILER.value}>{RETAILER.text}</Radio>
            <Radio value={BRANDLER.value}>{BRANDLER.text}</Radio>
          </RadioGroup>
        </Col>
      </Row>
      <div className={styles.btn}>
        <Row>
          <Col offset={6} span={14}>
            <Button type="primary" htmlType="submit" disabled={userType === -1} onClick={nextStep}>下一步</Button>
          </Col>
        </Row>
      </div>
    </div>
  );
}
