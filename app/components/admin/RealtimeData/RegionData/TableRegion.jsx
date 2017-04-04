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
    return [{
      title: '地区',
      dataIndex: 'goodname',
      key: 'goodname'
    }, {
      title: 'PV',
      dataIndex: 'goodid',
      key: 'goodid',
    }, {
      title: 'UV',
      dataIndex: 'brandname',
      key: 'brandname'
    }, {
      title: '领券数量',
      dataIndex: 'catname',
      key: 'catname'
    }, {
      title: '领券人数',
      dataIndex: 'pic',
      key: 'pic'
    },{
      title: '核券数量',
      dataIndex: 'status',
      key: 'status'
    },{
      title: '核券人数'
    },{
      title: '核销率'
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
