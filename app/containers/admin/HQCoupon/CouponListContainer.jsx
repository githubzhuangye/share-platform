import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { hqCouponApi } from 'api';
import { cardable } from 'hoc';

import { CouponList } from 'components/admin/HQCoupon';

@cardable(['会抢券'])
@connect(
  ({auth}) => ({
    saasId: auth.saasId,
  }),
)
export default class CouponListContainer extends Component {
  static propTypes = {
    saasId: PropTypes.string.isRequired,
  }
  state = {
    dataSource: [],
    page: 1,
    total: 0,
    loading: false,
  }
  componentDidMount() {
    this.fetchList();
  }
  handlePageChange(page) {
    this.setState({page}, ::this.fetchList);
  }
  fetchList() {
    this.setState({loading: true});
    // 获取coupon列表
    hqCouponApi.fetchCouponList(this.props.saasId, 1)
      .then(({total, dataSource}) => this.setState({total, dataSource, loading: false}));
  }
  handleMarketAssigned(key) {
    const dataSource = this.state.dataSource
      .map(item => item.key === key ? ({...item, allotStatus: 1}) : item);
    this.setState({dataSource});
  }
  render() {
    const { dataSource, page, total, loading } = this.state;
    return (
      <CouponList
        dataSource={dataSource}
        page={page}
        total={total}
        loading={loading}
        onMarketAssigned={::this.handleMarketAssigned}
        onPageChange={::this.handlePageChange}/>
    );
  }
}
