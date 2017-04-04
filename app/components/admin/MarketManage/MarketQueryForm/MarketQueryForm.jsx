import React, { PropTypes, Component } from 'react';
import { Row, Col, Form, Input, Select, Radio, Button } from 'antd';
import { MARKET_STATUS, FORM_ITEM_LAYOUT } from 'config/constants';
import { filterFormData, generateOptions } from 'helpers/util';

import { QueryAndExportBtns, HLink } from 'components/admin';

const formItemLayout = FORM_ITEM_LAYOUT;
const { ALL, START, STOP } = MARKET_STATUS;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

@Form.create()
export default class MarketQueryForm extends Component {
  static propTypes = {
    saaslist: PropTypes.array.isRequired,
    onQueryBtnClick: PropTypes.func.isRequired,
    onAddBtnClick: PropTypes.func.isRequired
  }
  handleQueryBtnClick() {
    const { form, onQueryBtnClick } = this.props;
    const { getFieldsValue } = form;
    const queryData = filterFormData(getFieldsValue(), (value, key) => {
      return !(key === 'status' && value === ALL.value);
    });
    onQueryBtnClick(queryData);
  }
  render() {
    const { form, saaslist, onAddBtnClick } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form>
        <Row>
          <Col span={8}>
            <FormItem label="商户名称" {...formItemLayout}>
              {getFieldDecorator('saasname')(
                <Select size="small" placeholder="请选择商户名称" style={{width: '100%'}} allowClear>
                  {generateOptions(saaslist, 'name', 'name')}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="门店名称" {...formItemLayout}>
              {getFieldDecorator('name')(
                <Input size="small" placeholder="请输入门店名称"/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="状态" {...formItemLayout}>
              {getFieldDecorator('status', {initialValue: ALL.value})(
                <RadioGroup>
                  <Radio value={ALL.value}>{ALL.text}</Radio>
                  <Radio value={START.value}>{START.text}</Radio>
                  <Radio value={STOP.value}>{STOP.text}</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
        </Row>
        <FormItem wrapperCol={{offset: 2}} style={{marginTop: '2px', marginBottom: '2px'}}>
          <QueryAndExportBtns
            onQueryBtnClick={::this.handleQueryBtnClick}/>
          <Button size="small" type="primary" style={{marginLeft: '8px'}}>
            <HLink to={`/admin/manage/market/new`}>添加门店</HLink>
          </Button>
        </FormItem>
      </Form>
    );
  }
}
