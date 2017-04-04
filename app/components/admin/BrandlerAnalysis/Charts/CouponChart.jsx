import React, { PropTypes, Component } from 'react';
import echarts from 'echarts';
import { Spin } from 'antd';

export default class CouponChart extends Component {
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
    width: '600px',
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
        title: {
          text: '券况走势图',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer : {
            type: 'shadow',
          },
          // formatter: params => {
          //   if (params.length === 1) {
          //     return `
          //       <h3>${params[0].name}</h3>
          //       <div>${params[0].seriesName}：${params[0].data}</div>
          //     `;
          //   }
          //   const categoryName = params[0].name;
          //   const dataIndex = params[0].dataIndex;
          //   return `
          //     <h3>${categoryName}</h3>
          //     <div>领券数：${get[dataIndex]}</div>
          //     <div>核券数：${use[dataIndex]}</div>
          //     <div>渗透率：${pp[dataIndex]}</div>
          //   `;
          // },
        },
        legend: {
          data:['领券数', '核券数'],
        },
        color: ['#007DA9', '#f55f4e'],
        xAxis: [
          {
            type: 'category',
            data: date,
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '领券数',
            type: 'bar',
            barGap: '0',
            data: get,
          },
          {
            name: '核券数',
            type: 'bar',
            barGap: '0',
            data: use,
          },
        ]
      };
    } else {
      option = {
        title: {
          text: '券况走势图',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer : {
            type: 'shadow',
          },
        },
        color: ['#f55f4e'],
        xAxis: [
          {
            type: 'category',
            data: date,
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '核券数',
            type: 'bar',
            data: use,
          },
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
