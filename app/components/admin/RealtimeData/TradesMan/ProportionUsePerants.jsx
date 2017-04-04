import React, { PropTypes, Component } from 'react';
import echarts from 'echarts';
import { Spin } from 'antd';

export default class ProportionCharts extends Component {
  static propTypes = {
    dataSource: PropTypes.shape({
      date: PropTypes.array,
    }).isRequired,
    loading: PropTypes.bool.isRequired,
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
  }
  static defaultProps = {
    loading: false,
    width: '390px',
    height: '300px',
    dataSource: {
      date: [],
    },
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
    const { dataSource } = props;
    const { date,detail } = dataSource;

    let yData = [];
    let xData = [];
    let aData = [];
    function ObjStory(val,name,id){
       this.value = val;
       this.name= name;
       this.marketid = id;
    }
    if (detail) {
      detail.map(item =>{
        yData.push(item.rcord); 
        xData.push(item.marketname);
        aData.push(new ObjStory(item.rcord,item.marketname,item.marketid));
      });
    }
    let option;
      option = {
          tooltip : {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series : [
              {
                  name: '访问来源',
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
