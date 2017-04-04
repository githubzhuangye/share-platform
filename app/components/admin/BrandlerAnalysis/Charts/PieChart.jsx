import React, { PropTypes, Component } from 'react';
import echarts from 'echarts';
import { Radio } from 'antd';
import { DIMENSIONS } from 'config/constants';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

function titleForDimension(dimension) {
  const titleWrapper = title => 'Top' + title + '分布图';
  switch(dimension) {
    case DIMENSIONS.REGION: return titleWrapper('区域');
    case DIMENSIONS.SAAS: return titleWrapper('商户');
    case DIMENSIONS.MARKET: return titleWrapper('门店');
  }
}

export default class PieChart extends Component {
  static propTypes = {
    dataSource: PropTypes.array.isRequired,
    dimension: PropTypes.string,
    title: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
    showGet: PropTypes.bool.isRequired,
    onItemClick: PropTypes.func,
    radioStyle: PropTypes.object,
  }
  static defaultProps = {
    loading: false,
    width: '600px',
    height: '300px',
    dataSource: [],
    showGet: false,
  }
  state = {
    dataType: 'use',
  }
  chartInstance = null
  componentDidMount() {
    const { onItemClick } = this.props;
    this.chartInstance = echarts.init(this._dom);
    onItemClick && this.chartInstance.on('click', params => onItemClick(params.name));
    this.updateChart(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.updateChart(nextProps);
    // 每次切换维度的时候，重制dataType的值为use
    this.setState({dataType: 'use'});
  }
  handleRadioChange(e) {
    this.setState({dataType: e.target.value}, () => this.updateChart(this.props));
  }
  updateChart(props) {
    const { dimension, dataSource, loading, title } = props;
    const { dataType } = this.state;
    const data = dataSource.map(item => ({name: item.name, value: item[dataType]}));
    const option = {
      tooltip : {
        trigger: 'item',
        formatter: "{b} : {c} ({d}%)"
      },
      series : [
        {
          name: dataType === 'use' ? '核销数量' : '领取数量',
          type: 'pie',
          minAngle: 10,
          data: data.filter(i => i.value && +i.value > 0),
        }
      ]
    };
    this.chartInstance.setOption(option);
  }
  render() {
    const { width, height, dimension, showGet, radioStyle } = this.props;
    const { dataType } = this.state;
    return (
      <div style={{width, position: 'relative'}}>
        <h2>{titleForDimension(dimension)}</h2>
        <div ref={dom => this._dom = dom} style={{width, height}}></div>
        {showGet
        ? <RadioGroup value={dataType} style={radioStyle ? radioStyle : {position: 'absolute', left: '40%', top: '-28px'}}
            onChange={::this.handleRadioChange}>
            <RadioButton value="use">核销量</RadioButton>
            <RadioButton value="get">领取量</RadioButton>
          </RadioGroup>
        : null
        }
      </div>
    );
  }
}
