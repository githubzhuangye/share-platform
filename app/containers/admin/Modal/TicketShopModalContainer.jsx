import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { TicketShopModal } from 'components/admin/Modal';
import { openTicketShopModal, closeTicketShopModal } from 'redux/modules/modal';

@connect(
  ({modal}) => ({visible: modal.ticketShopModalVisible, shopsInfo: modal.shopsInfo}),
  { closeTicketShopModal }
)
class TicketShopModalContainer extends React.Component {
  render () {
    const { visible, shopsInfo, closeTicketShopModal,callbackQuerytype,querytype,isretailer } = this.props;
    return (
      <TicketShopModal
        visible={visible}
        shopsInfo={shopsInfo}
        onCancel={closeTicketShopModal}
        callbackQuerytype={callbackQuerytype}
        querytype={querytype}
        isretailer={isretailer}
        />
    );
  }
}

export default TicketShopModalContainer;
