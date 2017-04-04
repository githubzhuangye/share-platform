import React, { PropTypes, Component } from 'react';
import { Table, Icon, Button, Radio, Form, Input, Spin, Card, Row, Col, Select, Pagination,
  Popover, DatePicker } from 'antd';
import * as styles from './styles.css';
import { StatusIcon, TextPopover } from 'components/admin';
import { PRODUCT_STATUS } from 'config/constants';
import { extractStatus, ticketStatusColor } from 'helpers/util';

const { START, STOP, ALL } = PRODUCT_STATUS;
const productStatusMap = extractStatus(PRODUCT_STATUS);

function rowSelection(onRowSelectionChange, selectedRowKeys) {
  return {
    selectedRowKeys,
    onChange(selectedRowKeys) {
      onRowSelectionChange(selectedRowKeys);
    }
  };
}

function columns(onEditPropduct) {
  return [{
    title: '商品名称',
    dataIndex: 'goodname',
    key: 'goodname',
    render: (_, {goodname}) => <TextPopover title="商品名称" content={goodname}/>
  }, {
    title: '商品条码',
    dataIndex: 'goodid',
    key: 'goodid',
  }, {
    title: '品牌',
    dataIndex: 'brandname',
    key: 'brandname',
    render: (_, {brandname}) => <TextPopover title="品牌" content={brandname}/>
  }, {
    title: '品类',
    dataIndex: 'catname',
    key: 'catname'
  }, {
    title: '图片',
    dataIndex: 'pic',
    key: 'pic',
    render: (pic) => <img className={styles.brandImage} src={pic || require('images/not_found.png')}/>
  },{
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status, record) => <span><StatusIcon color={status == '0' ? 'red' : 'green'}/>{productStatusMap(status)}</span>
  }, {
    title: '添加时间',
    dataIndex: 'createtime',
    key: 'createtime'
  }, {
    title: '更新时间',
    dataIndex: 'updatetime',
    key: 'updatetime'
  }, {
    title: '操作',
    key: 'operation',
    render: (_, {key}) => {
      return (
        <span>
          <a onClick={() => onEditPropduct(key)}>修改</a>
        </span>
      )
    },
  }];
}

export default class ProductTable extends Component {
  static propTypes = {
    dataSource: PropTypes.array.isRequired,
    page: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    loading: PropTypes.bool.isRequired,
    onRowSelectionChange: PropTypes.func.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onStartProducts: PropTypes.func.isRequired,
    onStopProducts: PropTypes.func.isRequired,
    onEditPropduct: PropTypes.func.isRequired
  }
  render() {
    const { dataSource, page, total, loading, selectedRowKeys, onRowSelectionChange, onPageChange,
     onStartProducts, onStopProducts, onEditPropduct } = this.props;
    return (
      <div>
        <Spin spinning={loading}>
          <Table
            dataSource={dataSource}
            columns={columns(onEditPropduct)}
            rowSelection={rowSelection(onRowSelectionChange, selectedRowKeys)}
            pagination={false}/>
        </Spin>
        <div className={styles.footer}>
          <div className={styles.btnGroup}>
            <Button size="small" type="primary" className={styles.deleteBtn} onClick={onStartProducts}>启用</Button>
            <Button type="ghost" size="small" onClick={onStopProducts}>停用</Button>
          </div>
          <Pagination current={page} total={total} onChange={onPageChange} showQuickJumper/>
        </div>
      </div>
    );
  }
}
