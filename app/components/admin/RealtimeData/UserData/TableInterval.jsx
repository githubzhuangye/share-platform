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
      title: '用户人数（人）',
      dataIndex: 'user',
      key: 'user'
    }, {
      title: '5张',
      dataIndex: 'five',
      key: 'five'
    }, {
      title: '4张',
      dataIndex: 'four',
      key: 'four'
    }, {
      title: '3张',
      dataIndex: 'three',
      key: 'three'
    }, {
      title: '2张',
      dataIndex: 'two',
      key: 'two'
    }, {
      title:'1张',
      dataIndex: 'one',
      key: 'one'
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
