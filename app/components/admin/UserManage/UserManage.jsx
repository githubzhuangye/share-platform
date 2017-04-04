import React, { PropTypes, Component } from 'react';
import { Form, Input, Row, Col, Button } from 'antd';
import { QueryTable, StatusIcon, QueryAndExportBtns } from 'components/admin';
import { queriable, cardable } from 'hoc';
import { FORM_ITEM_LAYOUT, host } from 'config/constants';
import { addRequiredDecorator } from 'helpers/util';

import { CouponAssignmentContainer } from 'containers/admin/UserManage';

const FormItem = Form.Item;

function getQueryForm(onAssignBtnClick, form, onQueryBtnClick) {
  const { getFieldDecorator } = form;
  const requiredFiledDecorators = addRequiredDecorator(['user_account'], getFieldDecorator);
  return (
    <div>
      <Row>
        <Col span={8}>
          <FormItem label="券包条码" {...FORM_ITEM_LAYOUT}>
            {requiredFiledDecorators('user_account')(
              <Input size="small" placeholder="请输入手机号或OPEN_ID"/>
            )}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label="券名称" {...FORM_ITEM_LAYOUT}>
            {getFieldDecorator('coupon_name')(
              <Input size="small" placeholder="请输入券名称"/>
            )}
          </FormItem>
        </Col>
        <Col span={8} style={{marginTop: '6px'}}>
          <QueryAndExportBtns
            onQueryBtnClick={onQueryBtnClick}/>
          <Button size="small" type="primary" style={{marginLeft: '8px'}} onClick={onAssignBtnClick}>
            指定发券
          </Button>
        </Col>
      </Row>
    </div>
  );
}

function getColumns() {
  return [
    {
      title: '券批次号',
      dataIndex: 'pubid',
      key: 'pubid'
    },
    {
      title: '券名称',
      dataIndex: 'couponname',
      key: 'couponname'
    },
    {
      title: '券面额(元)',
      dataIndex: 'couponfee',
      key: 'couponfee',
      render: couponfee => (couponfee / 100).toFixed(2)
    },
    {
      title: '核销订单号',
      dataIndex: 'outid',
      key: 'outid'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: status => parseInt(status) === 3 ? <span><StatusIcon color="red"/>未核销</span>
        : <span><StatusIcon/>已核销</span>
    },
    {
      title: '领取时间',
      dataIndex: 'gettime',
      key: 'gettime'
    },
    {
      title: '核销时间',
      dataIndex: 'updatetime',
      key: 'updatetime',
      render: (_, item) => parseInt(item.status) === 4 ? item.updatetime : ''
    }
  ];
}

const formatTotal = data => data.totalcount;
const formatData = data => data.couponlist;

@cardable(['消费者管理'])
@queriable({url: `${host}/cp/coupon/c_userCoupons.action`, initialFetch: false, mock: false, formatData, formatTotal})
export default class UserManage extends Component {
  static propTypes = {
    assignmentModalVisible: PropTypes.bool.isRequired,
    openAssignModal: PropTypes.func.isRequired,
  }
  render() {
    const { assignmentModalVisible, openAssignModal } = this.props;
    return (
      <div>
        <QueryTable
          {...this.props}
          getQueryForm={getQueryForm.bind(null, openAssignModal)}
          columns={getColumns()}
          autoInjectQueryAndExportBtns={false}/>
        {assignmentModalVisible && <CouponAssignmentContainer/>}
      </div>
    );
  }
}
