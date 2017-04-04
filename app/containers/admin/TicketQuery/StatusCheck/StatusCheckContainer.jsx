import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { message } from 'antd';
import { StatusCheck } from 'components/admin/TicketQuery';
import * as ticketQueryActionCreators from 'redux/modules/ticketQuery';

@connect(
  ({auth}) => ({userType: auth.userType}),
  dispatch => bindActionCreators(ticketQueryActionCreators, dispatch)
)
class StatusCheckContainer extends React.Component {
  static propTypes = {
    userType: PropTypes.number.isRequired,
    status: PropTypes.any.isRequired,
    ticketId: PropTypes.string.isRequired,
    handlePassTicket: PropTypes.func.isRequired,
    handleRejectTicket: PropTypes.func.isRequired,
  }
  handlePass() {
    const { ticketId, handlePassTicket } = this.props;
    handlePassTicket(ticketId)
      .catch(error => message.error(error.message));
  }
  handleReject() {
    const { ticketId, handleRejectTicket } = this.props;
    handleRejectTicket(ticketId)
      .catch(error => message.error(error.message));
  }
  render () {
    const { userType, status } = this.props;
    return (
      <StatusCheck
        userType={userType}
        status={status}
        onPass={::this.handlePass}
        onReject={::this.handleReject}/>
    );
  }
}

export default StatusCheckContainer;
