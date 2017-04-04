import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { TicketInfoModal } from 'components/admin/Modal';
import { handleOpenInfoModalAndFetchData, closeTicketInfoModal } from 'redux/modules/modal';

@connect(
  ({modal}) => ({visible: modal.ticketInfoModalVisible, ticketInfo: modal.ticketInfo}),
  { handleOpenInfoModalAndFetchData, closeTicketInfoModal }
)
class TicketInfoModalContainer extends React.Component {
  render () {
    const { visible, closeTicketInfoModal, ticketInfo } = this.props;
    return (
      <TicketInfoModal
        visible={visible}
        ticketInfo={ticketInfo}
        onCancel={closeTicketInfoModal}/>
    );
  }
}

export default TicketInfoModalContainer;
