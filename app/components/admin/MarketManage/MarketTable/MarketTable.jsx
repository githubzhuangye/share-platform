import React, { PropTypes, Component } from 'react';
import { Table, Button, Pagination } from 'antd';
import { MARKET_STATUS } from 'config/constants';
import { extractStatus, ticketStatusColor } from 'helpers/util';
import * as styles from './styles.css';

import { StatusIcon, HLink } from 'components/admin';

const { START, STOP, ALL } = MARKET_STATUS;
const marketStatusMap = extractStatus(MARKET_STATUS);

function rowSelection(onSelectedKeysChange, selectedRowKeys) {
  return {
    selectedRowKeys,
    onChange(selectedRowKeys) {
      onSelectedKeysChange(selectedRowKeys);
    }
  };
}

function columns() {
  return [{
    title: '门店名称',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '门店编号',
    dataIndex: 'id',
    key: 'id',
  }, {
    title: '门店地址',
    dataIndex: 'address',
    key: 'address'
  }, {
    title: '联系人',
    dataIndex: 'linkman',
    key: 'linkman'
  }, {
    title: '联系人号码',
    dataIndex: 'phone',
    key: 'phone'
  }, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status, record) => <span><StatusIcon color={status == '0' ? 'red' : 'green'}/>{marketStatusMap(status)}</span>
  }, {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    render: (_, {key}) => {
      return (
        <span>
          <HLink to={`/admin/manage/market/edit/${key}`}>修改</HLink>
        </span>
      )
    },
  }];
}

export default class MarketTable extends Component {
  static propTypes = {
    dataSource: PropTypes.array.isRequired,
    totalMarket: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    loading: PropTypes.bool.isRequired,
    selectedRowKeys: PropTypes.array.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onSelectedKeysChange: PropTypes.func.isRequired,
    onStartBtnClick: PropTypes.func.isRequired,
    onStopBtnClick: PropTypes.func.isRequired,
  }
  render() {
    const { dataSource, totalMarket, page, loading, selectedRowKeys, onPageChange, onSelectedKeysChange,
      onStartBtnClick, onStopBtnClick } = this.props;
    return (
      <div>
        <Table
          dataSource={dataSource}
          columns={columns()}
          rowSelection={rowSelection(onSelectedKeysChange, selectedRowKeys)}
          loading={loading}
          pagination={false}/>
        <div className={styles.footerContainer}>
          <div className={styles.btns}>
            <Button size="small" type="primary" style={{marginRight: '8px'}} onClick={onStartBtnClick}>{START.text}</Button>
            <Button size="small" onClick={onStopBtnClick}>{STOP.text}</Button>
          </div>
          <div className={styles.page}>
            <Pagination
              current={page}
              total={totalMarket}
              onChange={onPageChange}
              showQuickJumper/>
          </div>
        </div>
      </div>
    );
  }
}
