import React, {Component, PropTypes} from 'react';

//import { DataSelectContainer } from 'containers/admin';
import { ChannelChartUse } from 'components/admin';
import {cardable} from 'hoc';
import { Cascader,DatePicker,Spin } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChannelDataAnalysisActionCreators from 'redux/modules/ChannelDataAnalysis';
import * as dataSelectActionCreators from 'redux/modules/dataSelect';
import { DataPublicApi } from 'api';

@connect(
  ({ChannelDataAnalysis,dataSelect}) => ({
    activeList: dataSelect.activeList,
    channelDataUse: ChannelDataAnalysis.channelDataUse,
    starttime: dataSelect.starttime,
    endtime: dataSelect.endtime,
    activeId: dataSelect.activeId,
  }),
  dispatch => bindActionCreators({...ChannelDataAnalysisActionCreators,...dataSelectActionCreators}, dispatch)
)

export default class ChannelChartUseContainer extends Component {
  static propTypes = {
    starttime: PropTypes.string.isRequired,
    endtime: PropTypes.string.isRequired,
    activeList: PropTypes.array.isRequired,
    activeId: PropTypes.string.isRequired,
  }

   componentDidMount() {
    const activeList = this.props.handleActiveList();
    const { starttime,endtime,activeId } = this.props;
  }
  render() {
    const {ChannelData,isloadingChannel,activeId} = this.props;
    return (
      <ChannelChartUse {...ChannelData} loading={isloadingChannel} activeList={activeList} activeId={activeId}/>
    );
  }
}
