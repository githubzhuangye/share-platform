import React, { PropTypes, Component } from 'react';
import { Card, Button, Icon } from 'antd';
import { Match } from 'react-router';
import * as styles from './styles.css';

import { TicketQueryFormContainer, TicketTableContainer } from 'containers/admin/TicketQuery';

export default function TicketQuery() {
  return (
    <div>
      <div className={styles.findSection}>
        <TicketQueryFormContainer/>
      </div>
      <TicketTableContainer/>
    </div>
  );
}
