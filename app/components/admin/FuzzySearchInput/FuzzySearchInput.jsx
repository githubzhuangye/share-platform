import React, { PropTypes, Component } from 'react';
import { AutoComplete } from 'antd';

export default class FuzzySearchInput extends Component {
  static propTypes = {
    delayTime: PropTypes.number.isRequired,
    fetchData: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,     // 接受两个参数，第二个参数表示是否是由于选中触发值改变，true表示是
    formatValue: PropTypes.func,  // 格式化请求的参数
  }
  static defaultProps = {
    delayTime: 300,
  }
  state = {
    value: this.props.value,
    dataSource: [],
  }
  timer = null
  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({value: nextProps.value});
    }
  }
  handleChange(value) {
    if (value) {
      const query = this.props.formatValue ? this.props.formatValue(value) : value;
      this.fetch(query);
    }

    this.setState({value});
    this.props.onChange && this.props.onChange(value, false);
  }
  handleSelect(value) {
    this.setState({value});
    this.props.onChange && this.props.onChange(value, true);
  }
  fetch(value) {
    const { delayTime, fetchData } = this.props;
    // 如果之前的数据请求定时器还在，先清除，再发起一个新的数据请求定时器
    if (this.timer) {
      clearTimeout(this.timer);
    }
    if (value) {
      this.timer = setTimeout(() => {
        fetchData(value)
          .then(dataSource => this.setState({dataSource}));
      }, delayTime);
    } else {
      this.setState({dataSource: []});
    }
  }
  render() {
    const { dataSource, value } = this.state;
    const { placeholder } = this.props;
    return (
      <AutoComplete
        allowClear
        value={value}
        placeholder={placeholder}
        dataSource={dataSource}
        style={{ width: 280 }}
        onSelect={::this.handleSelect}
        onChange={::this.handleChange}
      />
    );
  }
}
