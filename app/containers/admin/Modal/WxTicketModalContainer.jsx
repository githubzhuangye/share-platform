import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { WxTicketModal } from 'components/admin/Modal';
import { handleOpenWxModalAndFetchData, closeTicketWxModal, handleNeedPay, fetchTicketNeedSuccess } from 'redux/modules/modal';

@connect(
  ({modal}) => ({visible: modal.WxticketModalVisible,ticketWx: modal.ticketWx,totalpay: modal.totalpay,wxkey: modal.wxkey,needpay: modal.needpay}),
  { handleOpenWxModalAndFetchData, handleNeedPay, closeTicketWxModal, fetchTicketNeedSuccess }
)
class WxTicketModalContainer extends React.Component {
  render () {
    const { visible, closeTicketWxModal, ticketWx, totalpay,handleNeedPay,wxkey, needpay, fetchTicketNeedSuccess } = this.props;
    return (
      <WxTicketModal
        visible={visible}
        ticketWx={ticketWx}
        totalpay={totalpay}
        onCancel={closeTicketWxModal}
        handleNeedPayClick={handleNeedPay}
        wxkey={wxkey}
        needpay={needpay}
        setNeedPay={fetchTicketNeedSuccess}
        />
    );
  }
}

export default WxTicketModalContainer;
