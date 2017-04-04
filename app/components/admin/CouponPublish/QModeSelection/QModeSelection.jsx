import React, { PropTypes, Component } from 'react';
import { Form, Radio } from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 14 }
};

export const Q_MODE = {
  DING_XIANG: {
    text: '定向模式',
    value: '1',
  },
  QIANG_DAN: {
    text: '抢单模式',
    value: '2',
  },
};

const { DING_XIANG, QIANG_DAN } = Q_MODE;

class Selection extends Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
  }
  render() {
    const { value, onChange } = this.props;
    return (
      <FormItem label="会抢模式" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} required
        style={{marginBottom: '0px'}}>
        <RadioGroup value={value} onChange={onChange}>
          <Radio value={DING_XIANG.value}>{DING_XIANG.text}</Radio>
          <Radio value={QIANG_DAN.value}>{QIANG_DAN.text}</Radio>
        </RadioGroup>
        <div style={{color: '#f55f4e'}}>
          将在{'"会抢"'}中
          {value === DING_XIANG.value ? '对指定门店发布券' : '供指定区域零售商抢单'}
        </div>
      </FormItem>
    );
  }
}

QModeSelection.propTypes = {
  form: PropTypes.object.isRequired,
};

export default function QModeSelection({form}) {
  return form.getFieldDecorator('hqType', {initialValue: DING_XIANG.value})(
    <Selection/>
  );
}
