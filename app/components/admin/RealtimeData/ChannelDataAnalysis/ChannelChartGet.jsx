import React, { PropTypes, Component } from 'react';
import echarts from 'echarts';
import { Spin,message } from 'antd';
import { DataPublicApi } from 'api';
import store from 'config/store.js';
import { getResult } from 'helpers/util';
import * as styles from './styles.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as dataSelectActionCreators from 'redux/modules/dataSelect';

@connect(
  ({dataSelect}) => ({
    Submit: dataSelect.Submit,
  }),
  dispatch => bindActionCreators(dataSelectActionCreators, dispatch),
)
// 基于准备好的dom，初始化echarts实例
export default class ChannelChartUse extends Component {
  state={
      loading:true,
      Submit:false,
  }
  chartInstance = null;
  randomData() {
      return Math.round(Math.random()*1000);
  }
  componentDidMount() {
    this.chartInstance = echarts.init(this._dom);
    this.updateChart(this.props);
    const { activeId } = this.props;
  }
  componentWillReceiveProps(nextProps) {
    this.updateChart(nextProps);
  }
    getOption(props) {
      const type = 'GET';
      const activeid = store.getState().dataSelect.activeId;
      const starttime = store.getState().dataSelect.starttime.split(" ")[0];
      const endtime = store.getState().dataSelect.endtime.split(" ")[0];
      DataPublicApi.channelDataAnalysis(type,activeid,starttime,endtime)
      .then( data => {
        function ObjStory(val,name){
           this.value = val;
           this.name= name;
        }
        let nameReturn = [];
        let valueReturn = [];
        let aData = [];
        data.detail.map(item => {
          nameReturn.push(item.rcord);
          valueReturn.push(item.channelname);
          aData.push(new ObjStory(item.rcord,item.channelname));
        })
        this.setState({loading: false,Submit:true});
        let option;
          option = {
              tooltip : {
                  trigger: 'item',
                  formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              color:['#FF9C1B','#FD0000','#FF4000','#00A3FF','#FF4000'],
            icon:'pie',
              series : [
                  {
                      name: '领券数据',
                      type: 'pie',
                      radius : '55%',
                      center: ['50%', '60%'],
                      data:aData
                  }
              ]
          };
        this.chartInstance.setOption(option);
      }).catch(error => {
            console.log(error)
            this.setState({loading:false});
            message.error('饼图请求超时,请检查您的网络');
          })
    }
    updateChart(props) {
     this.chartInstance.clear();
     this.setState({loading:true})
     const option = this.getOption(props);
   }

    render() {
        return (
          <Spin tip="Loading..." spinning={this.state.loading}>
              <div ref={dom => this._dom = dom} className={styles.container}></div>
          </Spin>
        );
    }
}
