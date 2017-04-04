import React, { PropTypes } from 'react';
import { Table } from 'antd';
import { centToYuan } from 'helpers/util';

function getColumns(type) {
  const baseColumns = [
    { 
      title: '日期',
      dataIndex: type === 'GET' ? 'gettime' : 'updatetime',
      key: 'date',
      width: 150,
    }, {
      title: '用户号',
      dataIndex: 'owner',
      key: 'owner',
      width: 150,
    }, {
      title: '券号',
      dataIndex: 'serialno',
      key: 'serialno',
      width: 150,
    }, 
  ];
  const extracColumns = [
    {
      title: '商户名称',
      dataIndex: 'saasname',
      key: 'saasname',
    }, {
      title: '门店名称',
      dataIndex: 'marketname',
      key: 'marketname',
    }, {
      title: '订单总额',
      dataIndex: 'tradeamount',
      key: 'tradeamount',
      render: value => `${centToYuan(value)}元`,
    }, {
      title: '订单号',
      dataIndex: 'outid',
      key: 'outid',
    },
  ];
  if (type === 'USE') {
    return [...baseColumns.map(columnConfig => ({...columnConfig, fixed: 'left'})), ...extracColumns];
  } else {
    return baseColumns;
  }
}

UsageTable.PropTypes = {
  dataSource: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default function UsageTable({dataSource, page, total, type, onPageChange}) {
  return (
    <Table
      columns={getColumns(type)}
      dataSource={dataSource}
      scroll={{ x: type === 'USE' ? 1300 : false }}
      pagination={{current: page, total, onChange: onPageChange}}/>
  );
}