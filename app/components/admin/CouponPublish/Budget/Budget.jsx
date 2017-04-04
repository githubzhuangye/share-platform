import React, { PropTypes, Component } from 'react';
import { Form, Input, Select, Col } from 'antd';
import { budgetFieldDecorator, couponFeeFieldDecorator, rateFieldDecorator,
  couponCountFieldDecorator } from '../PublishForm/validator.js';
import { formatMoney, formatPrice } from 'helpers/util';

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 14 },
};

export default class Budget extends Component {
  static propTypes = {
    isEdit: PropTypes.bool.isRequired,
    form: PropTypes.object.isRequired,
    isMyVip: PropTypes.bool.isRequired,
    isSelectMode: PropTypes.number.isRequired,
    couponType: PropTypes.number.isRequired,
  }
  static defaultProps = {
    isEdit: false,
  }
  formatBudget(budget) {
    if (budget.length >= 13) {
      return '预算超过千亿？请认真审核下输入金额位数';
    }
    return formatPrice(budget) + '   ' + formatMoney(budget);
  }
  render() {
    const { form, couponType, isEdit, isSelectMode, isMyVip } = this.props;
    const budget = form.getFieldValue('budget');
    return (
      <div style={isSelectMode === 2 && !isMyVip ? {display:'none'}: {display:'block'}}>
        <FormItem label="总预算" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} required>
          <Col span={6}>
            <FormItem>
              {budgetFieldDecorator(form)(
                <Input type="number" style={{ width: 64, marginRight: 10 }} disabled={isEdit}/>
              )}元
            </FormItem>
          </Col>
          <Col span={18}>
            {budget ? <strong>{this.formatBudget(budget + '')}</strong> : null}
          </Col>
        </FormItem>
        <FormItem label="券面额" {...formItemLayout} required>
          {couponFeeFieldDecorator(form, couponType)(
            <Input type="number" style={{ width: 64, marginRight: 10 }} disabled={isEdit}/>
          )}元
        </FormItem>
        <FormItem label="预计核销率" {...formItemLayout} required>
          {rateFieldDecorator(form)(
            <Select style={{ width: 100 }} disabled={isEdit}>
              {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100].map((rate, index) => {
                return <Option key={index} value={rate + ''}>{rate}%</Option>
              })}
            </Select>
          )}
        </FormItem>
        <FormItem label="预计发放总量" {...formItemLayout} required
          help="预计发放总量 =总预算/(预计核销率*券面额)">
          {couponCountFieldDecorator(form)(
            <Input type="number" style={{ width: 110 }} disabled/>
          )}
        </FormItem>
      </div>
    );
  }
}
