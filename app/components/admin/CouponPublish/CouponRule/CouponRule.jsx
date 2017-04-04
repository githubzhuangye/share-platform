import React, { PropTypes, Component } from 'react';
import { Form, Input } from 'antd';
import { formItemLayout } from '../constants.js';
import { addRequiredDecorator } from 'helpers/util';

const FormItem = Form.Item;
let uuid = 0;


export default class CouponRule extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
  }

  remove = (k) => {
    const { form } = this.props;
    const keys = form.getFieldValue('couponrule');
    if (keys.length === 0) {
      return;
    }
    form.setFieldsValue({
      couponrule: keys.filter(key => key !== k),
    });
  }

  add = () => {
    uuid++;
    const { form } = this.props;
    const keys = form.getFieldValue('couponrule');
    const nextKeys = keys.concat(uuid);
    form.setFieldsValue({
      couponrule: nextKeys,
    });
  }

  render() {
    const { form, isMyVip, isSelectMode } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    // const requiredFieldDecorators = addRequiredDecorator(['couponrule'], form.getFieldDecorator);

    getFieldDecorator('couponrule', { initialValue: [] });
    const keys = getFieldValue('couponrule');
    const formItems = keys.map((k, index) => {
      return (
        <FormItem
          {...formItemLayout}
          label="使用说明"
          required={false}
          key={k}
        >

          {getFieldDecorator(`couponrule${k}`, {
            validateTrigger: ['onChange'],
            rules: [{
              required: false,
            }],
          })(
            <Input placeholder="请输入使用说明，50字以内" style={{ width: 276 }}/>
          )}

          <span style={{position: 'relative','left': '10px',cursor: 'pointer', color: '#f55f4e'}} disabled={keys.length === 0} onClick={() => this.remove(k)}>删除</span>
        </FormItem>
      );
    });
    return (
      <div style={isSelectMode === 2 && !isMyVip ? {display:'none'}: {display:'block'}}>

        <FormItem label="使用说明" {...formItemLayout} required={false}>

          {getFieldDecorator(`couponrule0`, {
            validateTrigger: ['onChange'],
            rules: [{
              required: false
            }],
          })(
            <Input placeholder="请输入使用说明，50字以内" style={{ width: 276 }}/>
          )}

          <span style={{position: 'relative','left': '10px',cursor: 'pointer', color: '#f55f4e'}} onClick={:: this.add}>
          增加
          </span>
        </FormItem>
        {formItems}
      </div>
    );
  }
}
