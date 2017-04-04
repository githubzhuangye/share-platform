import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TicketQueryForm } from 'components/admin/TicketQuery';
import * as ticketQueryActionCreators from 'redux/modules/ticketQuery';

@connect(
  ({auth}) => ({
    userType: auth.userType,
  }),
  dispatch => bindActionCreators(ticketQueryActionCreators, dispatch)
)
class TicketQueryFormContainer extends React.Component {
  static propTypes = {
    userType: PropTypes.number.isRequired,
    handleQueryTicket: PropTypes.func.isRequired
  }
  handleSubmit(queryData) {
    this.props.handleQueryTicket(queryData);
  }
  render () {
    return (
      <TicketQueryForm {...this.props}
        onSubmit={::this.handleSubmit}/>
    );
  }
}

export default TicketQueryFormContainer;
