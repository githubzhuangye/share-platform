import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as couponAssignmentActionCreators from './couponAssignment.reducer';

import { UserManage } from 'components/admin/UserManage';

@connect(
  ({couponAssignment}) => ({
    assignmentModalVisible: couponAssignment.get('modalVisible'),
  }),
  dispatch => bindActionCreators(couponAssignmentActionCreators, dispatch)
)
export default class UserManageContainer extends Component {
  static propTypes = {
    assignmentModalVisible: PropTypes.bool.isRequired,
    openAssignModal: PropTypes.func.isRequired,
  }
  render() {
    const { assignmentModalVisible, openAssignModal } = this.props;
    return (
      <UserManage
        assignmentModalVisible={assignmentModalVisible}
        openAssignModal={openAssignModal}/>
    );
  }
}
