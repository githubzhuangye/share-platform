import React, { PropTypes, Component } from 'react';
import echarts from 'echarts';
import { Spin } from 'antd';

export default class ProportionCharts extends Component {
  static propTypes = {
    dataSource: PropTypes.shape({
    //  date: PropTypes.array,
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
  //    date: [],
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
    const {  get, use, pp } = dataSource;
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
              data: ['沃尔玛','物美','丹尼斯','美特好','华润万家']
          },
          series : [
              {
                  name: '访问来源',
                  type: 'pie',
                  radius : '55%',
                  center: ['50%', '60%'],
                  data:[
                      {value:640, name:'沃尔玛'},
                      {value:640, name:'物美'},
                      {value:640, name:'丹尼斯'},
                      {value:1537, name:'美特好'},
                      {value:769, name:'华润万家'}
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
              orient: 'horizontal',
              data: ['沃尔玛','物美','丹尼斯','美特好','华润万家']
          },
          series : [
              {
                  name: '访问来源',
                  type: 'pie',
                  radius : '55%',
                  center: ['50%', '60%'],
                  data:[
                      {value:640, name:'沃尔玛'},
                      {value:640, name:'物美'},
                      {value:640, name:'丹尼斯'},
                      {value:1537, name:'美特好'},
                      {value:769, name:'华润万家'}
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
