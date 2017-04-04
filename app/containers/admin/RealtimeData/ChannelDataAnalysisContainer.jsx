import React, {Component, PropTypes} from 'react';
import { DataSelectContainer } from 'containers/admin';
import { ChannelDataAnalysis } from 'components/admin';

import { Cascader,DatePicker,Spin } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChannelDataAnalysisActionCreators from 'redux/modules/ChannelDataAnalysis';
import * as userDataActionCreators from 'redux/modules/userData';
import { DataPublicApi } from 'api';

@connect(
  ({ChannelDataAnalysis,userData,dataSelect}) => ({
    activeList: ChannelDataAnalysis.activeList,
    channelDataUse: ChannelDataAnalysis.channelDataUse,
    channelDataGet: ChannelDataAnalysis.channelDataGet,
    topData:userData.topData,
    starttime: dataSelect.starttime,
    endtime: dataSelect.endtime,
  }),
  dispatch => bindActionCreators({...ChannelDataAnalysisActionCreators,...userDataActionCreators,...dataSelect}, dispatch)
)

export default class ChannelDataAnalysisContainer extends Component {
  static propTypes = {
    starttime: PropTypes.string.isRequired,
    endtime: PropTypes.string.isRequired,
  }

  async componentDidMount() {
      //初始化加载
  }

  render() {

    return (
      <ChannelDataAnalysis dataProps={this.props}/>
    );
  }
}
