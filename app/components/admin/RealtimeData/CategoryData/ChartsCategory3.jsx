import React, { PropTypes, Component } from 'react';
import echarts from 'echarts';
import { Spin } from 'antd';

export default class UserChart extends Component {
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
              data: ['单品1','单品2','单品3','单品4','单品5']
          },
          series : [
              {
                  name: '访问来源',
                  type: 'pie',
                  radius : '55%',
                  center: ['50%', '60%'],
                  data:[
                      {value:640, name:'单品1'},
                      {value:640, name:'单品2'},
                      {value:640, name:'单品3'},
                      {value:1537, name:'单品4'},
                      {value:769, name:'单品5'}
                  ]
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
