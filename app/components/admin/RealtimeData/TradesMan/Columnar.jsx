import React, { PropTypes, Component } from 'react';
import echarts from 'echarts';
import { Spin } from 'antd';

export default class ProportionCharts extends Component {
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
    showGet: PropTypes.bool.isRequired
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
    option = {
      color: ['#ff7200'],
      tooltip : {
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : ''        // 默认为直线，可选为：'line' | 'shadow'
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
              data : ['门店1', '门店2', '门店3', '门店4', '门店5'],
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
              name:'平均覆盖率',
              type:'bar',
              barWidth: '30%',
              data:[10, 52, 200, 334, 390, 330, 220]
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
