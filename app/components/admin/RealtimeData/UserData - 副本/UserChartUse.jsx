import React, { PropTypes, Component } from 'react';
import echarts from 'echarts';
import { Spin } from 'antd';

export default class UserChartUse extends Component {
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
    width: '390px',
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

    function  ObjStory(val,name){
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
          tooltip : {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          color:['#FF9C1B','#FD0000','#FF4000','#00A3FF','#FF4000'],
          legend: {
              itemWidth:10,
              itemHeight:10,
              textStyle: {
                fontSize:6
              },
              orient: 'horizontal',
              data:xData
          },
        icon:'pie',
          series : [
              {
                  name: '核劵数据',
                  type: 'pie',
                  radius : '55%',
                  center: ['50%', '60%'],
                  data:aData
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
    return (
      <div ref={dom => this._dom = dom} style={{width, height}}></div>
    );
  }
}
