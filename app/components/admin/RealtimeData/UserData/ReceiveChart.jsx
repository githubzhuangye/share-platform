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
  static defaultProps = {
        width: '400px',
        height: '300px',
    }

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
    DataPublicApi.userDataUse(type,activeid,starttime,endtime)
    .then( data => {
      function ObjStory(cnt,rcord){
         this.cnt = cnt;
         this.rcord= rcord;
      }
      let cnt = [];
      let rcord = [];
      data.detail.map(item => {
        cnt.push(item.cnt);
        rcord.push(item.rcord);
      })
      this.setState({loading: false,Submit:true});
      let option;
      option = {
          color: ['#3398DB'],
          tooltip : {
              trigger: 'axis',
              axisPointer : {
                  type : ''
              }
          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
          xAxis : [
              {
                  type : 'category',
                  data : cnt,
                  axisTick: {
                      alignWithLabel: true
                  }
              }
          ],
          yAxis : [
              {
                  type : 'value'
              }
          ],
          series : [
              {
                  name:'核券数',
                  type:'bar',
                  barWidth: '60%',
                  data:rcord
              }
          ]
        };
      this.chartInstance.setOption(option);
    }).catch(error => {
          console.log(error)
          this.setState({loading:false});
          // message.error('请求超时,请检查您的网络');
        })
  }
    updateChart(props) {
     this.chartInstance.clear();
     this.setState({loading:true})
     const option = this.getOption(props);
   }

    render() {
        const {width, height} = this.props;
        return (
          <Spin tip="Loading..." spinning={this.state.loading}>
              <div ref={dom => this._dom = dom} style={{
                width,
                height
            }}></div>
          </Spin>
        );
    }
}
