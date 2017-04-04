import React, { PropTypes, Component } from 'react';
import { Form, DatePicker, Radio, Button } from 'antd';

import { SaasMarketSelect } from 'components/admin';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const RangerPicker = DatePicker.RangePicker;

@Form.create()
export default class QueryForm extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    pubId: PropTypes.string.isRequired,
    onQueryBtnClick: PropTypes.func.isRequired,
    onExportBtnClick: PropTypes.func.isRequired,
  }
  render() {
    const { form, pubId, onQueryBtnClick, onExportBtnClick } = this.props;
    const { getFieldDecorator, getFieldsValue } = form;
    const type = form.getFieldValue('type');
    return (
      <Form>
        <label>查询日期: </label>
        {getFieldDecorator('date')(
          <RangerPicker style={{width: 200}}/>
        )}
        {getFieldDecorator('type', {initialValue: 'GET'})(
          <RadioGroup
            style={{marginLeft: '8px'}} 
            onChange={e => onQueryBtnClick({...getFieldsValue(), type: e.target.value})}>
            <Radio value="GET">领取</Radio>
            <Radio value="USE">核销</Radio>
          </RadioGroup>
        )}
        {type === 'USE' && getFieldDecorator('saasMarket')(
          <SaasMarketSelect pubId={pubId}/>
        )}
        <Button type="primary" size="small" 
          onClick={() => onQueryBtnClick(getFieldsValue())}>
          查询
        </Button>
        <Button type="primary" size="small" style={{marginLeft: '8px'}}
          onClick={() => onExportBtnClick(getFieldsValue())}>
          导出
        </Button>
      </Form>
    );
  }
}