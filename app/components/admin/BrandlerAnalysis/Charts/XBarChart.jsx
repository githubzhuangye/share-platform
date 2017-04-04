import React, { PropTypes, Component } from 'react';
import echarts from 'echarts';
import { Spin } from 'antd';

function shortenStr(str) {
  if (str.length >= 5) {
    return str.slice(0, 3) + '...';
  } else {
    return str;
  }
}

export default class XBarChart extends Component {
  static propTypes = {
    dataSource: PropTypes.shape({
      name: PropTypes.array,
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
  updateChart(props) {
    const { title, loading, dataSource } = props;
    const { name = [], use = [] } = dataSource;
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer : {
          type: 'shadow',
        },
      },
      formatter: params => {
        const name = this.props.dataSource.name;
        if (params.length === 1) {
          return `
            <h3>${name[params[0].dataIndex]}</h3>
            <div>${params[0].seriesName}：${params[0].data}</div>
          `;
        }
      },
      color: ['#f55f4e'],
      xAxis: [
        {
          type: 'value'
        }
      ],
      yAxis: [
        {
          type: 'category',
          data: name.map(shortenStr),
        }
      ],
      series: [
        {
          name: '核券数量',
          type: 'bar',
          data: use,
        },
      ]
    }
    this.chartInstance.setOption(option);
    if (loading) {
      this.chartInstance.showLoading();
    } else {
      this.chartInstance.hideLoading();
    }
  }
  render() {
    const { loading, width, height } = this.props;
    return (
      <div ref={dom => this._dom = dom} style={{width, height}}></div>
    );
  }
}
