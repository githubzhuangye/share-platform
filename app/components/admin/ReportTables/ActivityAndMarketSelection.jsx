import React, { PropTypes, Component } from 'react';
import { Form, Col, Select } from 'antd';
import { FORM_ITEM_LAYOUT } from 'config/constants';
import { generateOptions } from 'helpers/util';

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 16},
  style: {marginTop: '2px', marginBottom: '2px'},
};

export default class ActivityAndMarketSelection extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    activityList: PropTypes.array.isRequired,
    marketList: PropTypes.array.isRequired,
    fetchMarketList: PropTypes.func.isRequired,
    activityFieldName: PropTypes.string,
    hideMarket: PropTypes.bool
  }
  handleActivityChange(value) {
    // TODO: 清除活动下拉框时，提示问题
    const { fetchMarketList, form, hideMarket } = this.props;
    if (!value) { // 清除选项时，不进行新的门店拉取
      form.resetFields();
      return;
    }
    if (!hideMarket) {
      this._marketSelect.props.onChange();
      fetchMarketList(value);
    }
  }
  render() {
    const { form, activityList, marketList, activityFieldName = 'activeId', hideMarket } = this.props;
    const { getFieldDecorator } = form;
    const activityFieldDecorator = getFieldDecorator(activityFieldName, {
      initialValue: activityList > 0 ? activityList[0].activeid : undefined,
      onChange: ::this.handleActivityChange,
      rules: [
        {required: true, message: '请选择活动'}
      ]
    });
    return (
      <div>
        <Col span={hideMarket ? 24 : 12}>
          <FormItem label="活动名称" {...FORM_ITEM_LAYOUT}>
            {activityFieldDecorator(
              <Select size="small" placeholder="请选择活动名称" allowClear>
                {generateOptions(activityList, 'activeid', 'name')}
              </Select>
            )}
          </FormItem>
        </Col>
        { !hideMarket
        ? <Col span={12}>
            <FormItem label="门店名称" {...FORM_ITEM_LAYOUT}>
              {getFieldDecorator('marketid')(
                <Select size="small" placeholder="请选择门店名称" allowClear ref={marketSelect => this._marketSelect = marketSelect}>
                  {generateOptions(marketList, 'marketid', 'marketname')}
                </Select>
              )}
            </FormItem>
          </Col>
        : null}
      </div>
    );
  }
}
