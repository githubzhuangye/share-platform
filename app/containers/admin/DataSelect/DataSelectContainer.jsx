import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as dataSelectActionCreators from 'redux/modules/dataSelect';
import * as userDataActionCreators from 'redux/modules/userData';
import { USER_TYPE } from 'config/constants';
import {YESDAY, POINTDAY, SEVENDAY, NINTHDAY} from 'helpers/util';
import { DataSelect } from 'components/admin';
import { Form } from 'antd';
import store from 'config/store.js';
import { DataPublicApi } from 'api';
let firstVal = 0;
import ChannelChartUse from 'components/admin/RealtimeData/ChannelDataAnalysis/ChannelChartUse'
import ChannelChartGet from 'components/admin/RealtimeData/ChannelDataAnalysis/ChannelChartGet'
@connect(
  ({dataSelect,userData}) => ({
    activeList: dataSelect.activeList,
    starttime: dataSelect.starttime,
    endtime: dataSelect.endtime,
    activeId: dataSelect.activeId,
    Submit: dataSelect.Submit,
    topData:userData.topData,
  }),
  dispatch => bindActionCreators({...dataSelectActionCreators,...userDataActionCreators}, dispatch),
)

export default class DataSelectContainer extends Component {
  static propTypes = {
    setDates: PropTypes.func.isRequired,
    activeList: PropTypes.array.isRequired,
    activeId: PropTypes.string.isRequired,

  }

  state = {
    loading: false,
    chartsVal : {},
    type:'USE',
    activeId :'',
    starttime :'',
    endtime :'',
    _starttime:'',
    _endtime:'',
    Submit:false,
    topData:'',
  }

  handleDateChange(value,dateString){
      const { _starttime,_endtime } = this.state;
      this.setState({_starttime: dateString[0],_endtime: dateString[1]});
  }

  handleActiveChange(value){
    console.info(value)
    this.props.fetchActiveId(value.split(",")[0]);

    const { activeList,activeId } = this.props;
    const dataChartsVal = {
       '_id' : value.split(",")[0],
       '_sttime' : value.split(",")[1],
       '_edtime' : value.split(",")[2],
    }
    const dVal = {
       '_id' : value.split(",")[0],
       '_st' : dataChartsVal._sttime.split(" ")[0],
       '_ed' : dataChartsVal._edtime.split(" ")[0],
    }
    this.setState({chartsVal: dVal});

  }

  disabledDate(current) {
    const { chartsVal } = this.state;
    const { _st,_ed } = chartsVal;

    let _s = _st.replace(/-/g,'/');
    let _e = _ed.replace(/-/g,'/');

    let st = new Date(_s);
    let et = new Date(_e);

    let start = st.getTime();
    let end = et.getTime();

    return current && current.valueOf() > end || current.valueOf() < start;
  }

  handleOnsubmit(){
    const { setDates,activeId,Submit,topData } = this.props;

    const { _starttime,_endtime } = this.state;//选择到的时间

    setDates(_starttime,_endtime);
    this.setState({loading:false});
    this.props.fetchSubmit();
    this.props.handleTopData();
    this.props.handleUserDataUse()
    this.props.handleUserDataGet();
  }

  componentDidMount() {
      // const { setDates } = this.props;
      // const { chartsVal } = this.state;
      const activeList = this.props.handleActivityList();
      this.handleOnsubmit();
      // firstVal = 0;

  }
  componentWillReceiveProps(nextProps) {
        firstVal=0;
        ++firstVal;
        if (firstVal === 1) {
            if (nextProps.activeList[0]) {
              this.setState({starttime: nextProps.activeList[0].starttime,endtime: nextProps.activeList[0].endtime});
              return;
            }
        }
  }
  render() {
    const { form } = this.props;
    const { setDates,activeList,activeId } = this.props;
    const { chartsVal } = this.state;
    const { starttime,endtime } = this.props;//此时的时间是选择的时间
    return (
        <div>
          <DataSelect chartsVal={ chartsVal } disabledDate={:: this.disabledDate} activeList={activeList}  onDateChange={:: this.handleDateChange}  onSubmit={:: this.handleOnsubmit} onActiveChange={:: this.handleActiveChange}/>
        </div>
  );
  }
}
