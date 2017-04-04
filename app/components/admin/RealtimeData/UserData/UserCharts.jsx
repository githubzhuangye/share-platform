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
              data: ['1张','2张','3张','8张','10张']
          },
          series : [
              {
                  name: '访问来源',
                  type: 'pie',
                  radius : '55%',
                  center: ['50%', '60%'],
                  data:[
                      {value:640, name:'1张'},
                      {value:640, name:'2张'},
                      {value:640, name:'3张'},
                      {value:1537, name:'8张'},
                      {value:769, name:'10张'}
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
              data: ['1张','2张','3张','8张','10张']
          },
        icon:'pie',
          series : [
              {
                  name: '访问来源',
                  type: 'pie',
                  radius : '55%',
                  center: ['50%', '60%'],
                  data:[{value:640, name:'1张'},
                      {value:640, name:'2张'},
                      {value:640, name:'3张'},
                      {value:1537, name:'8张'},
                      {value:769, name:'10张'}
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
