import React, { PropTypes } from 'react';
import { TicketQuery } from 'components/admin';
import { cardable } from 'hoc';

@cardable(['券查询'])
export default class TicketQueryContainer extends React.Component {
  render () {
    return (
      <TicketQuery/>
    );
  }
}
