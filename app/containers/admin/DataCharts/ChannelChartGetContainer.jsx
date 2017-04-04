import React, {Component, PropTypes} from 'react';

//import { DataSelectContainer } from 'containers/admin';
import { ChannelChartGet } from 'components/admin';
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
  }),
  dispatch => bindActionCreators({...ChannelDataAnalysisActionCreators,...dataSelectActionCreators}, dispatch)
)

export default class ChannelChartUseContainer extends Component {
  static propTypes = {
    starttime: PropTypes.string.isRequired,
    endtime: PropTypes.string.isRequired,
    activeList: PropTypes.array.isRequired,
  }

   componentDidMount() {
    const activeList = this.props.handleActiveList();
    const { starttime,endtime } = this.props;
//    const ChannelData = await this.props.handleChannelData('USE',activeList,'20170102','20170308');

  }
  render() {
    const {ChannelData,isloadingChannel,activeList} = this.props;
    return (
      <ChannelChartGet {...ChannelData} loading={isloadingChannel} activeList={activeList}/>
    );
  }
}
