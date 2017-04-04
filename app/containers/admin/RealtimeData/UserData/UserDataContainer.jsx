import React, { PropTypes } from 'react';
import * as styles from 'components/admin/RealtimeData/TotalData/styles.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userDataActionCreators from 'redux/modules/userData';
import EventEmitter from 'helpers/event';
import {userDataApi} from 'api';
import { UserData } from 'components/admin/RealtimeData';


import { ActivitySelection,SubAndRestBtns } from 'components/admin/RealtimeData';
import DataCharts from 'components/admin/RealtimeData/TotalData/DataCharts';
import PvUvData from 'components/admin/RealtimeData/TotalData/PvUvData';

export const LOADED_ACTIVITY_LIST = 'LOADE_ACTIVITY_LIST';

class UserDataContainer extends React.Component {
  render () {
    return (
      <UserData/>
    );
  }
}

export default UserDataContainer;
