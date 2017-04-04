import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { ticketQueryApi } from 'api';
import { formatRangePickerDate, exportExcel } from 'helpers/util';
import { cardable } from 'hoc';
import { host } from 'config/constants';

import { CouponDetail } from 'components/admin';
import QueryForm from './QueryForm';
import UsageTable from './UsageTable';

@cardable([{name: '券查询', url: '/admin/coupon/query'}, '领券明细'])
export default class CouponUsage extends Component {
  static contextTypes = {
    history: PropTypes.object.isRequired,
  }
  state = {
    couponDetail: {},   // 顶部信息
    queryData: {        // 查询信息
      type: 'GET', 
    },      
    page: 1,            // 当前第几页
    total: 0,           // 数据总条数
    dataSource: [],     // 数据列表
  }
  componentDidMount() {
    const { queryData, page } = this.state;

    // 获取顶部detail信息
    const pubId = this.props.params.id;
    ticketQueryApi.fetchTicketDetail(pubId)
      .then(couponDetail => this.setState({couponDetail}));

    // 组件挂载后查询一次数据
    this.fetchDetail(queryData, page);
  }
  handleQueryBtnClick(queryData) {
    this.setState({queryData, page: 1}, () => this.fetchDetail(queryData, 1));
  }
  handleExportBtnClick(queryData) {
    this.setState({queryData});

    const params = {...this.formatData(queryData), pubid: this.props.params.id};
    exportExcel(`${host}/cp/coupon/c_exportReceivelist.action`, params);
  }
  handlePageChange(page) {
    this.setState({page}, () => this.fetchDetail(this.state.queryData, page));
  }
  formatData(queryData) {
    const { date, saasMarket, ...others } = queryData;
    
    const formData = {
      ...others, 
      ...saasMarket,
    };

    const formatedDate = formatRangePickerDate(date);
    if (formatedDate) {
      formData.starttime = formatedDate.start;
      formData.endtime = formatedDate.end;
    }

    return formData;
  }
  fetchDetail(queryData, page) {
    const pubId = this.props.params.id;
    const formData = this.formatData(queryData);

    ticketQueryApi.fetchTicketUsage(pubId, {...formData, page})
      .then(data => this.setState({
        dataSource: data.list,
        total: data.totalcount,
      }));
  }
  render() {
    const { couponDetail, dataSource, page, total, queryData } = this.state;
    const pubId = this.props.params.id;
    return (
      <div>
        <CouponDetail {...couponDetail}/>
        <QueryForm 
          pubId={pubId}
          onQueryBtnClick={::this.handleQueryBtnClick}
          onExportBtnClick={::this.handleExportBtnClick}/>
        <div style={{marginTop: '20px'}}>
          <UsageTable
            dataSource={dataSource}
            type={queryData.type} 
            page={page} total={total} onPageChange={::this.handlePageChange}/>
        </div> 
      </div>
    );
  }
}