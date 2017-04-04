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
      title: '券面额',
      dataIndex: 'Juser',
      key: 'Juser'
    }, {
      title: '3折',
      dataIndex: 'Jthree',
      key: 'Jfive'
    }, {
      title: '4折',
      dataIndex: 'Jfour',
      key: 'Jfour'
    }, {
      title: '5折',
      dataIndex: 'Jfive',
      key: 'Jfive'
    }, {
      title: '6折',
      dataIndex: 'Jsix',
      key: 'Jsix'
    }, {
      title:'7折',
      dataIndex: 'Jseven',
      key: 'Jseven'
    }, {
      title:'8折',
      dataIndex: 'Jeight',
      key: 'Jeight'
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
