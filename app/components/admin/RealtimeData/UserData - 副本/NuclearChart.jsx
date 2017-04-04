import React, { PropTypes, Component } from 'react';
import echarts from 'echarts';
import { Spin } from 'antd';

export default class NuclearChart extends Component {
  static propTypes = {
    dataSourceUse: PropTypes.shape({
      date: PropTypes.array,
      coupon: PropTypes.string,
      user: PropTypes.string,
      avg: PropTypes.string,
    }).isRequired,
    loading: PropTypes.bool.isRequired,
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
    showGet: PropTypes.bool.isRequired,
  }
  static defaultProps = {
    loading: false,
    width: '400px',
    height: '300px',
    dataSourceUse: {
      date: [],
      coupon: [],
      user: [],
      avg: [],
    },
    showGet: false,
  }
  chartInstance = null
  componentDidMount() {
    this.chartInstance = echarts.init(this._dom);
    this.updateChart(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.updateChart(nextProps);
  }
  getOption(props) {
    const { dataSourceUse, showGet } = props;
    const {date,coupon,user,avg,detail } = dataSourceUse;

    let yData = [];
    let xData = [];
    let aData = [];
    function ObjStory(val,name){
       this.value = val;
       this.name= name;
    }
    if (detail) {
      detail.map(item =>{
        yData.push(item.rcord);
        xData.push(item.cnt);
        aData.push(new ObjStory(item.rcord,item.cnt));
      });
    }
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
              data : xData,
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
              data:yData
          }
      ]
    };

    return option;
  }
  updateChart(props) {
    const { loading } = props;
    const option = this.getOption(props);
    this.chartInstance.clear();
    this.chartInstance.setOption(option);
    if (loading) {
      this.chartInstance.showLoading();
    } else {
      this.chartInstance.hideLoading();
    }
  }
  render() {
    const { width, height } = this.props;
    const {loading,date,coupon,user,avg} = this.props;
    const {dataSourceUse} = this.props;

    return (
      <div ref={dom => this._dom = dom} style={{width, height}}></div>
    );
  }
}
