import React, { Component, PropTypes } from 'react';
import { Input, Select, Form } from 'antd';
import { matchGoodList } from 'api/couponPublish';
import { formItemLayout } from '../constants.js';
import { goodIdFieldDecorator } from '../PublishForm/validator.js';

const Option = Select.Option;
const FormItem = Form.Item;
export const GOOD_NOT_FOUND_VALUE = 'GOOD_NOT_FOUND_VALUE';

class InnerSearchableInput extends Component {
  static propTypes = {
    isEdit: PropTypes.bool.isRequired,
    onChange: PropTypes.func,
    delayTime: PropTypes.number,
    value: PropTypes.object,
  }
  static defaultProps = {
    delayTime: 300,
    isEdit: false,
  }
  state = {
    data: [],
    selectedItem: {},
  }
  componentWillReceiveProps({value}) {
    if (!value) { // form中其他输入框改变都会导致重新渲染整个表单,因此调用该方法时可能value值可能为undefined(用户还未输入)
      return;
    }
    this.setState({selectedItem: value});
  }
  handleChange(value) {
    // value 形式为xxxid: xxxname, 查询时向后台发送xxxname
    const goodPart = value.split(':');
    const goodValue = goodPart.length === 2 ? goodPart[1] : goodPart[0];
    this.setState({selectedItem: {text: value}});
    if (value) {
      this.fetchGood(goodValue, data => this.setState({data}));
    }
  }
  handleBlur(value) {
    const data = this.state.data;
    // 如果blur之前选择了正确的good,则返回正确的选中项
    // 否则显示用户输入的内容,但是用GOOD_NOT_FOUND_VALUE作为返回值的value,表示用户没有选择正确的商品名
    let selectedItem = data.find(i => i.text === value);
    if (!selectedItem) {
      selectedItem = {
        text: value,
        value: GOOD_NOT_FOUND_VALUE,
        pic: '',
      };
    }
    this.updateSelectedItem(selectedItem);
  }
  handleSelect(value) {
    const selectedItem = this.state.data.find(i => i.text === value);
    this.updateSelectedItem(selectedItem);
  }
  updateSelectedItem(selectedItem) {
    this.setState({selectedItem});
    this.props.onChange(selectedItem);
  }
  fetchGood(value, callback) {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    this.timeout = setTimeout(() => this.fetch(value, callback), this.props.delayTime);
  }
  fetch(value, callback) {
    matchGoodList(value)
      .then(({dataSource}) => callback(dataSource.good.map(i => ({value: i.GOODID, text: i.GOODNAME, pic: i.GOODPIC}))));
  }
  render() {
    const { data, selectedItem } = this.state;
    const { isEdit } = this.props;
    const maxText = data.sort((item1, item2) => item1.text.length - item2.text.length > 0)[0];
    const inputWidth = maxText && maxText.text.length * 11 > 300 ? maxText.text.length * 11 : 300;
    const options = data.map(d => <Option key={d.value} value={d.text}>{d.text}</Option>);
    return (
      <Select
        disabled={isEdit}
        combobox
        value={selectedItem.text}
        placeholder="输入商品关键字，可以模糊匹配，20字以内"
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSelect={::this.handleSelect}
        onChange={::this.handleChange}
        onBlur={::this.handleBlur}
        style={{width: inputWidth}}>
        {options}
      </Select>
    );
  }
}

SearchableInput.propTypes = {
  form: PropTypes.object.isRequired,
  isMyVip: PropTypes.bool.isRequired,
  isSelectMode: PropTypes.number.isRequired,
  isFresh: PropTypes.bool.isRequired,
};

SearchableInput.defaultProps = {
  isFresh: false,
};

export default function SearchableInput({form, isFresh, isEdit, isSelectMode, isMyVip}) {
  return (
    <FormItem label="商品名称" {...formItemLayout} required style={isSelectMode === 2 && !isMyVip ? {display:'none'}: {display:'block'}}>
      {goodIdFieldDecorator(form, isFresh)(
        <InnerSearchableInput
          placeholder="输入商品关键字，可以模糊匹配，20字以内"
          isEdit={isEdit}/>
      )}
    </FormItem>
  );
}
