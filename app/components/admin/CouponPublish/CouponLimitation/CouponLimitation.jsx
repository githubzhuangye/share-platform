import React, { PropTypes, Component } from 'react';
import { Select, Input, Form } from 'antd';
import { formItemLayout } from '../constants.js';
import { limitFieldDecorator } from '../PublishForm/validator.js';

const Option = Select.Option;
const FormItem = Form.Item;

class Limitation extends Component {
  static propTypes = {
    isEdit: PropTypes.bool.isRequired,
  }
  state = {
    showInput: false,
    selectValue: '1',
    inputValue: '1'
  }
  componentWillReceiveProps({value}) {
    if (value === undefined) { // 清空时
      return this.setState({selectValue: '1', inputValue: '1', showInput: false});
    }
  }
  handleSelectChange(value) {
    if (value === 'noop') {
      this.setState({showInput: true, selectValue: value, inputValue: '1'});
      this.props.onChange('1');
    } else {
      this.setState({showInput: false, selectValue: value});
      this.props.onChange(value);
    }
  }
  handleInputChange(e) {
    const value = e.target.value;
    this.setState({inputValue: value});
    this.props.onChange(value);
  }
  render() {
    const { selectValue, inputValue, showInput } = this.state;
    const { isEdit } = this.props;
    return (
      <div>
        <Select
          disabled={isEdit}
          style={{ width: 234 }}
          onChange={::this.handleSelectChange}
          value={selectValue}>
          <Option value="1">1张/人</Option>
          <Option value="2">2张/人</Option>
          <Option value="3">3张/人</Option>
          <Option value="10">10张/人</Option>
          <Option value="noop">设定每人领取总张数</Option>
        </Select>
        <div style={{ display: showInput ? 'block' : 'none' }}>
          <Input
            type="number"
            style={{ width: 200, margin: '10px 10px 0 0' }}
            onChange={::this.handleInputChange}
            value={inputValue}/>张/人
        </div>
      </div>
    );
  }
}

CouponLimitation.propTypes = {
  form: PropTypes.object.isRequired,
  isEdit: PropTypes.bool.isRequired,
};

CouponLimitation.defaultProps = {
  isEdit: false,
};

export default function CouponLimitation({form, isEdit, isSelectMode, isMyVip}) {
  return (
    <FormItem label="领取限制" {...formItemLayout} required style={isSelectMode === 2 && !isMyVip ? {display:'none'}: {display:'block'}}>
      {limitFieldDecorator(form)(
        <Limitation isEdit={isEdit}/>
      )}
    </FormItem>
  );
}
