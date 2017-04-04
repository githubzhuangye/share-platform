import React, { PropTypes } from 'react';
import { Table } from 'antd';
import { Link, Match } from 'react-router';
import { extractStatus } from 'helpers/util';
import { COUPON_TYPE } from 'config/constants';

import { TextPopover, HLink } from 'components/admin';
import { MarketAssignContainer } from 'containers/admin/HQCoupon';

const ALLOT_STATUS = {
  NOT_ALLOT: 0,
  ALLOT: 1,
};

function getColumns() {
  return [
    {
      title: '品牌商',
      dataIndex: 'brandler',
      key: 'brandler',
      width: 130,
    }, {
      title: '券种类',
      dataIndex: 'couponType',
      key: 'couponType',
      width: 130,
      render: couponType => extractStatus(COUPON_TYPE)(couponType),
    }, {
      title: '券名称',
      dataIndex: 'couponName',
      key: 'couponName',
      width: 180,
    }, {
      title: '券数量',
      dataIndex: 'amount',
      key: 'amount',
      width: 130,
    }, {
      title: '有效日期',
      dataIndex: 'date',
      key: 'date',
      width: 130,
    }, {
      title: <span style={{marginLeft: '24px'}}>操作</span>,
      key: 'operation',
      width: 130,
      render: (text, record) =>
      <span style={{marginLeft: '24px'}}>
      {+record.allotStatus === ALLOT_STATUS.NOT_ALLOT
        ? <HLink to={`/admin/coupon/hq/new/${record.key}`}>分配门店</HLink>
        : "已分配"}
      </span>
      ,
    }];
}

CouponList.propTypes = {
  dataSource: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onMarketAssigned: PropTypes.func.isRequired,
};

export default function CouponList({dataSource, page, total, loading, onPageChange, onMarketAssigned}) {
  const pagination = {
    current: page,
    total,
    onChange: onPageChange,
  };
  return (
    <div>
      <Table
        columns={getColumns()}
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}/>
      <Match
        pattern="/admin/coupon/hq/new/:id"
        component={({params}) =>
        <MarketAssignContainer
          mode="new"
          params={params}
          couponInfo={dataSource.find(i => i.key === params.id)}
          onMarketAssigned={onMarketAssigned}/>}/>
    </div>
  );
}
