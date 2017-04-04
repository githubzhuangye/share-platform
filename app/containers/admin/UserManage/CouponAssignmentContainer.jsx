import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as couponAssignmentActionCreators from './couponAssignment.reducer';

import { CouponAssignment } from 'components/admin/UserManage';

@connect(
  ({couponAssignment}) => ({
    coupons: couponAssignment.get('coupons').toJS(),
    phone: couponAssignment.get('phone'),
    phoneError: couponAssignment.get('phoneError'),
  }),
  dispatch => bindActionCreators(couponAssignmentActionCreators, dispatch)
)
export default class CouponAssignmentContainer extends Component {
  static propTypes = {
    coupons: PropTypes.array.isRequired,
    phone: PropTypes.string.isRequired,
    phoneError: PropTypes.string.isRequired,
    setCouponCount: PropTypes.func.isRequired,
    setCouponPhone: PropTypes.func.isRequired,
    handleCouponIdChange: PropTypes.func.isRequired,
    handleCloseAssignModal: PropTypes.func.isRequired,
    handleConfirm: PropTypes.func.isRequired,
  }
  render() {
    return (
      <CouponAssignment {...this.props}/>
    );
  }
}
