import React, { PropTypes, Component } from 'react';
import { Button, Radio, Form, Input, Row, Col, DatePicker, Select } from 'antd';
import moment from 'moment';
import { PRODUCT_STATUS, DATE_INTERVAL } from 'config/constants';
import { generateOptions, disabledDate } from 'helpers/util';
import { QueryAndExportBtns } from 'components/admin';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const { START, STOP, ALL } = PRODUCT_STATUS;

@Form.create()
export default class QueryForm extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    status: PropTypes.number.isRequired,
    onStatusChange: PropTypes.func.isRequired,
    onQueryBtnClick: PropTypes.func.isRequired,
    onAddBtnClick: PropTypes.func.isRequired
  }
  handleQuery() {
    const { status, form, onQueryBtnClick } = this.props;
    const { getFieldsValue } = form;
    const formData = this.formatFormData(form.getFieldsValue());
    onQueryBtnClick({...formData, status});
  }
  handleChange(e) {
    this.props.onStatusChange(e.target.value);
  }
  formatFormData() {
    const formData = this.props.form.getFieldsValue();
    // format date
    const date = formData.date;
    const dateFormatStr = 'YYYY-MM-DD';
    if (date && date[0] && date[1]) {
      formData.start = moment(date[0]).format(dateFormatStr);
      formData.end = moment(date[1]).format(dateFormatStr);
    }
    delete formData.date;

    return formData;
  }
  render() {
    const { status, onStatusChange, form, brandlist, categoryList, onAddBtnClick } = this.props;
    const { getFieldDecorator } = form;
    const marginStyle = {marginTop: '2px', marginBottom: '2px'};
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 16},
      style: marginStyle
    };
    return (
      <Form>
        <Row>
          <Col span={8}>
            <FormItem label="商品名称" {...formItemLayout}>
              {getFieldDecorator('goodname')(
                <Input placeholder="请输入商品名称" size="small"/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="商品条码" {...formItemLayout}>
              {getFieldDecorator('goodid')(
                <Input placeholder="请输入商品条码" size="small"/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="商品品牌" {...formItemLayout}>
              {getFieldDecorator('brandid')(
                <Select placeholder="请选择商品品牌" size="small" allowClear>
                  {generateOptions(brandlist, 'id', 'brandname')}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem label="品类名称" {...formItemLayout}>
              {getFieldDecorator('category_id')(
                <Select size="small" allowClear placeholder="请选择品类名称">
                  {generateOptions(categoryList, 'catid', 'catname')}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={16}>
            <FormItem label="状态" labelCol={{span: 3}} wrapperCol={{span: 20}} style={marginStyle}>
              <RadioGroup value={status} size="large" size="small" onChange={::this.handleChange}>
                <Radio value={START.value}>{START.text}</Radio>
                <Radio value={STOP.value}>{STOP.text}</Radio>
                <Radio value={ALL.value}>{ALL.text}</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={16}>
            <FormItem label="添加时间" labelCol={{span: 3}} wrapperCol={{span: 20}} style={marginStyle}>
              {getFieldDecorator('date')(
                <RangePicker size="small" disabledDate={disabledDate(DATE_INTERVAL.AFTER)} style={{width: '40%'}}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <FormItem wrapperCol={{offset: 2}} style={marginStyle}>
          <QueryAndExportBtns
            onQueryBtnClick={::this.handleQuery}/>
          <Button size="small" type="primary" style={{marginLeft: '8px'}} onClick={onAddBtnClick}>添加商品</Button>
        </FormItem>
      </Form>
    );
  }
}
