import React, { PropTypes, Component } from 'react';
import echarts from 'echarts';
import { Spin } from 'antd';

export default class ChannelCharts extends Component {
  static propTypes = {
    dataSource: PropTypes.shape({
      date: PropTypes.array,
      get: PropTypes.array,
      use: PropTypes.array,
      pp: PropTypes.array,
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
    dataSource: {
      date: [],
      get: [],
      use: [],
      pp: [],
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
    const { dataSource, showGet } = props;
    const { date, get, use, pp } = dataSource;
    let option;
    if (showGet) {
      option = {
          tooltip : {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          color:['#FF9C1B','#FD0000','#FF4000','#00A3FF','#FF4000'],
          legend: {
              itemWidth:10,
              itemHeight:10,
              orient: 'horizontal',
              data: ['品牌公众号','零售商公众号','线下物料','支付宝卡包','会花']
          },
          series : [
              {
                  name: '访问来源',
                  type: 'pie',
                  radius : '55%',
                  center: ['50%', '60%'],
                  data:[
                      {value:640, name:'品牌公众号'},
                      {value:640, name:'零售商公众号'},
                      {value:640, name:'线下物料'},
                      {value:1537, name:'支付宝卡包'},
                      {value:769, name:'会花'}
                  ]
              }
          ]
      };
    } else {
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
              data: ['品牌公众号','零售商公众号','线下物料','支付宝卡包','会花']
          },
        icon:'pie',
          series : [
              {
                  name: '访问来源',
                  type: 'pie',
                  radius : '55%',
                  center: ['50%', '60%'],
                  data:[{value:640, name:'品牌公众号'},
                      {value:640, name:'零售商公众号'},
                      {value:640, name:'线下物料'},
                      {value:1537, name:'支付宝卡包'},
                      {value:769, name:'会花'}
                  ]
              }
          ]
      };
    }
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
