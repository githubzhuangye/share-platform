import React, { PropTypes, Component } from 'react';
import { Link, Match } from 'react-router';
import { Table, Icon, Button, Spin, Card,  Pagination } from 'antd';
import * as styles from './styles.css';
import { ticketStatusColor, extractStatus } from 'helpers/util';
import { queryMarketFreshQRCodeByPubid } from 'api/ticketCode';
import { COUPON_STATUS, COUPON_TYPE, USER_TYPE } from 'config/constants';
import { COUPON_MODE } from '../TicketQueryForm/TicketQueryForm';

import { StatusIcon, TextPopover, HLink } from 'components/admin';
import TicketCodeModal from 'components/admin/Modal/TicketCodeModal';
import { TicketInfoModalContainer, TicketShopModalContainer, WxTicketModalContainer } from 'containers/admin/Modal';
import { StatusCheckContainer } from 'containers/admin/TicketQuery';
import { MarketAssignContainer } from 'containers/admin/HQCoupon';

const { VERIFING, NOT_START, ONGOING, OVER } = COUPON_STATUS;
const { SINGLE, BRAND, VOUCHER, FRESH } = COUPON_TYPE;
const { BRANDLER, RETAILER, MIYA } = USER_TYPE;

function getRowSelection({selectedKeys, setSelectedKeys, saasId}) {
  return {
    selectedRowKeys: selectedKeys,
    onChange(selectedRowKeys, selectedRows) {
      setSelectedKeys(selectedRowKeys);
    },
    getCheckboxProps: record => {
      const status = parseInt(record.status);
      return {
        disabled: status >= OVER.value || saasId !== record.pubSaasId
      };
    }
  };
}

function getEditOperation(record, userType, saasId) {
  if (+record.querytype == COUPON_MODE.ORIGIN.value) {
    return [SINGLE, BRAND, VOUCHER].map(i => i.value).includes(parseInt(record.type)) && (
        // 品牌商只有待审核的时候才能修改
        (userType === BRANDLER.value && +record.status === VERIFING.value) ||
        // 零售商只有在未开始时，并且券不是自己发的时才能修改
        (userType === RETAILER.value && saasId === record.pubSaasId && +record.status === NOT_START.value) ||
        (userType === MIYA.value && +record.status === VERIFING.value)
      )
    ? <span>
        <span className="ant-divider"></span>
        <HLink to={`/admin/coupon/publish/${record.key}`}>修改</HLink>
      </span>
    : null;
  } else {
    return +record.isupdate === 1 && (
      <span>
        <span className="ant-divider"></span>
        <HLink to={'/admin/coupon/query/editMarketAssign/' + record.key}>修改</HLink>
      </span>
    );
  }
}

export default class TicketQuery extends Component {
  static propTypes = {
    saasId: PropTypes.string.isRequired,
    userType: PropTypes.number.isRequired,
    dataSource: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    page: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    selectedKeys: PropTypes.array.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onTicketInfoClick: PropTypes.func.isRequired,
    onTicketShopClick: PropTypes.func.isRequired,
    onTicketUsageClick: PropTypes.func.isRequired,
    setSelectedKeys: PropTypes.func.isRequired,
    handleOffTickets: PropTypes.func.isRequired
  }
  state={
    codevisible:false,
    codeloading:false,
    dataSource:[],
    count:0,
    pubid:"",
    isretailer:this.props.userType === RETAILER.value?1:0,//是否为零售商 0:否 1:是
    querytype:this.props.userType === RETAILER.value?2:1//设置默认查询类型  1:商户 2:区域
  }
  onTicketCodeClick(pubid){ //查询券批次号下该券活动商户的生鲜券二维码
    var that=this;
    this.setState({
      codevisible:true,
      codeloading: true,
    })
    queryMarketFreshQRCodeByPubid({pubid:pubid,curpage:1,marketname:''}).then(result=>{
      if (result.code === '200') {
        this.setState({ dataSource: result.data.details,codeloading: false, count: result.data.totalcount,pubid:pubid })
      }
    }).catch(e => that.setState({ codeloading: false }));
  }

  getColumns({userType, saasId, onTicketInfoClick, onTicketShopClick, onTicketUsageClick, couponType, onTicketWxClick}){
    return [
      {
        title: '券名称',
        dataIndex: 'ticketName',
        key: 'ticketName',
        render: ticketName => <TextPopover title="券名称" content={ticketName}/>
      }, {
        title: '券类型',
        dataIndex: 'type',
        key: 'type',
        render: type => extractStatus(COUPON_TYPE)(type),
      }, {
        title: '券面额',
        dataIndex: 'price',
        key: 'price',
      }, {
        title: '发行数量',
        dataIndex: 'amount',
        key: 'amount'
      }, {
        title: '使用时间',
        dataIndex: 'time',
        key: 'time'
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (status, item) => (<StatusCheckContainer status={status} ticketId={item.key}/>)
      }, {
        title: '操作',
        key: 'operation',
        render: (text, record) => {
          const {querytype,isretailer}=this.state;
          return (
            <span>
              <a onClick={() => onTicketInfoClick(record.key)}>详情</a>
              <span className="ant-divider"></span>
              <a onClick={() => (this.setState({pubid:record.key}),onTicketShopClick(record.key,querytype,isretailer))}>门店</a>
              <span className="ant-divider"></span>
              <HLink to={`/admin/coupon/usage/${record.key}`}>领券明细</HLink>
              {parseInt(record.type) === FRESH.value
              ? <span>
                  <span className="ant-divider"></span>
                  <a onClick={() => this.onTicketCodeClick(record.key)}>二维码</a>
                </span>
              : null}
              {couponType === 3 && userType !== 1 && parseInt(record.status) !== 5 ?
                  <Button type="primary" size='small' style={{marginLeft: '5px'}} onClick={() => onTicketWxClick(record.key)}>库存管理</Button> : null
              }

              {getEditOperation(record, userType, saasId)}
            </span>)
        },
      }];
  }
  callbackVisible(visible){
    this.setState({
      codevisible:visible
    })
  }

   callbackQuerytype(value){ //回调查询类型
     const {querytype,isretailer,pubid}=this.state;
    this.setState({
      querytype:value
    },function(){
       this.props.onTicketShopClick(pubid,value,isretailer)
    });
  }
  render() {
    const { saasId, userType, dataSource, loading, page, total, selectedKeys, onPageChange, onTicketInfoClick, onTicketShopClick,
      onTicketUsageClick, onTicketWxClick, setSelectedKeys, handleOffTickets,couponType } = this.props;
    const {querytype,isretailer}=this.state;

    return (
      <div>
        <Spin spinning={loading}>
          <Table
            columns={::this.getColumns({onTicketInfoClick, onTicketShopClick, onTicketUsageClick, onTicketWxClick, userType, saasId,couponType})}
            rowSelection={getRowSelection({selectedKeys, setSelectedKeys, saasId})}
            dataSource={dataSource} pagination={false}/>
        </Spin>
        <div className={styles.footer}>
          <Button type="primary" className={styles.shelfBtn} size="small" onClick={handleOffTickets}>下架</Button>
          <Pagination current={page} total={total} onChange={onPageChange} showQuickJumper/>
        </div>
        <TicketInfoModalContainer/>
        <WxTicketModalContainer/>
        <TicketShopModalContainer callbackQuerytype={::this.callbackQuerytype}
                 querytype={querytype}
                 isretailer={isretailer}
                 />
        <TicketCodeModal visible={this.state.codevisible} callbackVisible={::this.callbackVisible} loading={this.state.codeloading} count={this.state.count} dataSource={this.state.dataSource} pubid={this.state.pubid}/>
        <Match
          pattern="/admin/coupon/query/editMarketAssign/:id"
          component={({params}) =>
          <MarketAssignContainer
            mode="edit"
            params={params}
            couponInfo={dataSource.find(i => i.key === params.id)}/>}/>
      </div>
    );
  }
}
