import React,  { PropTypes, Component } from 'react';
import { Form, DatePicker } from 'antd';
import moment from 'moment';
import { FORM_ITEM_LAYOUT } from 'config/constants';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

export default class ReportDatePicker extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired
  }
  validateDate(_, value, callback) {
    if (!value || (value[0] === null && value[1] === null)) { // 日期不选，可以通过
      callback();
    } else {
      const [ start, end ] = value;
      const dateRange = (end - start) / (1000 * 60 * 60 * 24);
      if (dateRange > 15) {
        callback(`日期范围不能大于15天,您现在选的日期范围为${dateRange}天`);
      } else {
        callback();
      }
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const dateFieldDecorator = getFieldDecorator('date', {
      rules: [
        {validator: ::this.validateDate}
      ]
    });
    return (
      <FormItem label="时间段" {...FORM_ITEM_LAYOUT}>
        {dateFieldDecorator(
          <RangePicker size="small"/>
        )}
      </FormItem>
    );
  }
}
