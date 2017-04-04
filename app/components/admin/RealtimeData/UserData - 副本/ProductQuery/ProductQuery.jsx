import React, { PropTypes, Component } from 'react';
import { Button, Radio, Form, Input, Row, Col, DatePicker, Select } from 'antd';
import moment from 'moment';
import { PRODUCT_STATUS, DATE_INTERVAL } from 'config/constants';
import { generateOptions, disabledDate } from 'helpers/util';


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
  SubAndRestBtns.propTypes = {
    onSubBtnClick: PropTypes.func,
    onRestBtnClick: PropTypes.func
  };
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
            <FormItem label="活动名称" {...formItemLayout}>
              {getFieldDecorator('goodname')(
                <Input placeholder="请选择活动名称" size="small"/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="数据日期" labelCol={{span: 3}} wrapperCol={{span: 20}} style={marginStyle}>
              {getFieldDecorator('date')(
                <Input placeholder="请选择活动日期" size="small"/>
              )}
            </FormItem>
          </Col>

        </Row>
        <Col span={6} style={{ marginTop: '-5px' }}>
            <FormItem>
                <Button type="primary" size="small" onClick={onSubBtnClick}>查询</Button>
                &nbsp;&nbsp;&nbsp;
                <Button size="small" onClick={onRestBtnClick}>重置</Button>
                <span style={{ display: 'none' }} className={styles.downLoadBtn}>下载报表</span>
            </FormItem>
        </Col>
      </Form>
    );
  }
}
