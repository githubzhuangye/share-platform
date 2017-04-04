import React, { PropTypes, Component } from 'react';
import { Form, Select, Row, Col, DatePicker } from 'antd';
import { QueryTable } from 'components/admin';
import { queriable, cardable } from 'hoc';
import { FORM_ITEM_LAYOUT, host } from 'config/constants';
import { ActivityAndMarketSelectionContainer } from 'containers/admin/ReportTables';
import { formatFrontDate, formatBackendDate } from 'helpers/util';
import { ReportDatePicker } from 'components/admin/ReportTables';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

function getQueryForm(form) {
  return (
    <Row>
      <Col span={8}>
        <ActivityAndMarketSelectionContainer form={form} hideMarket={true}/>
      </Col>
      <Col span={8}>
        <ReportDatePicker form={form}/>
      </Col>
    </Row>
  );
}

function getColumns() {
  return [
    {
      title: '渠道名称',
      dataIndex: 'channel',
      key: 'channel'
    },
    {
      title: '领券数量',
      dataIndex: 'gets',
      key: 'gets'
    },
    {
      title: '领券用户数量',
      dataIndex: 'getusers',
      key: 'getusers'
    },
    {
      title: '核销数量',
      dataIndex: 'uses',
      key: 'uses'
    },
    {
      title: '核券用户数量',
      dataIndex: 'useusers',
      key: 'useusers'
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date'
    }
  ];
}

const formatData = data => data.date.map(item => ({...item, date: formatFrontDate(item.date)}));
const formatTotal = data => data.totalcount;

@cardable(['领取核销渠道查询'])
@queriable({url: `${host}/cp/coupon/query!channelinfo.action`, formatData, formatTotal, formatDate: true})
export default class Channel extends Component {
  render() {
    return (
      <QueryTable
        {...this.props}
        exportUrl={`${host}/cp/coupon/query!exportChannelinfo.action`}
        getQueryForm={getQueryForm}
        columns={getColumns()}/>
    );
  }
}
