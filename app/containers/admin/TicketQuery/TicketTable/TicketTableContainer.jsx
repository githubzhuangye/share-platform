import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TicketTable } from 'components/admin/TicketQuery';
import * as ticketActionCreators from 'redux/modules/ticketQuery';
import * as modalActionCreators from 'redux/modules/modal';
import * as ticketUsageActionCreators from 'redux/modules/ticketUsage';
import { COUPON_USAGE_TIME } from 'config/constants';

@connect(
  ({ticketQuery, auth}) => ({
    dataSource: ticketQuery.dataSource,
    loading: ticketQuery.loading,
    total: ticketQuery.total,
    page: ticketQuery.page,
    selectedKeys: ticketQuery.selectedKeys,
    couponType: ticketQuery.couponType,
    userType: auth.userType,
    saasId: auth.saasId,
  }),
  dispatch => bindActionCreators({...ticketActionCreators, ...modalActionCreators, ...ticketUsageActionCreators}, dispatch)
)
class TicketTableContainer extends React.Component {
  static propTypes = {
    saasId: PropTypes.string.isRequired,
    userType: PropTypes.number.isRequired,
    dataSource: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    page: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    selectedKeys: PropTypes.array.isRequired,
    handleQueryTicket: PropTypes.func.isRequired,
    handlePageChange: PropTypes.func.isRequired,
    handleOpenInfoModalAndFetchData: PropTypes.func.isRequired,
    handleOpenShopModalAndFetchData: PropTypes.func.isRequired,
    openTicketUsageModal: PropTypes.func.isRequired,
    setSelectedKeys: PropTypes.func.isRequired,
    handleOffTickets: PropTypes.func.isRequired,
    setUsagePubid: PropTypes.func.isRequired,
    changeConditionAndFetchData: PropTypes.func.isRequired
  }
  componentDidMount() {
    this.props.handleQueryTicket({query_type: 1});
    this.props.selectCouponType(1);
  }
  handlePageChange(page) {
    this.props.handlePageChange(page);
  }
  handleTicketInfoClick(pubid) {
    this.props.handleOpenInfoModalAndFetchData(pubid);
  }

  handleTicketWxClick(pubid) {
    this.props.handleOpenWxModalAndFetchData(pubid);
  }

  handleTicketShopClick(pubid,querytype,isretailer) {
    this.props.handleOpenShopModalAndFetchData(pubid,querytype,isretailer);
  }
  handleTicketUsageClick(pubid) {
    this.props.setUsagePubid(pubid);
    this.props.openTicketUsageModal();
    this.props.changeConditionAndFetchData(COUPON_USAGE_TIME.ALL.value);
  }
  render () {
    return (
      <TicketTable
        {...this.props}
        onPageChange={::this.handlePageChange}
        onTicketInfoClick={::this.handleTicketInfoClick}
        onTicketShopClick={::this.handleTicketShopClick}
        onTicketWxClick={::this.handleTicketWxClick}
        onTicketUsageClick={::this.handleTicketUsageClick}/>
    );
  }
}

export default TicketTableContainer;
