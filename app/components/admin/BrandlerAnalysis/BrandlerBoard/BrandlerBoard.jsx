import React, { Component, PropTypes } from 'react';
import { Spin } from 'antd';
import { Match } from 'react-router';
import styles from './styles.css';
import { reportApi } from 'api';
import { getTrendTemplate, getTotalTemplate } from './common.js';
import { navigateTo } from 'helpers/util';
import { cardable } from 'hoc';

import BoardCard from './BoardCard';
import { CouponWrapper, FansTrend, GoodTrend } from 'components/admin/BrandlerAnalysis';

@cardable(['看板'])
export default class BrandlerBoard extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  state = {
    loading: false,
    data: {
      use: {},
      get: {},
      fans: {},
      good: {},
    },
    activeCardTitle: '', // 当前选中的card title
  }
  componentDidMount() {
    this.fetchBrandlerBoard();
    this.activeAndNavigateTo('/admin/analysis/dashboard/coupon', "核券数");
  }
  fetchBrandlerBoard() {
    this.setState({loading: true});
    reportApi.fetchBrandlerBoard()
      .then(data => this.setState({
        loading: false,
        data: data,
      }));
  }
  activeAndNavigateTo(to, title) {
    const { router } = this.context;
    navigateTo(to, router);
    this.setState({activeCardTitle: title});
  }
  render() {
    const { router } = this.context;
    const { loading, data, activeCardTitle } = this.state;
    const { use, get, fans, good } = data;
    return (
      <Spin spinning={loading}>
        <ul className={styles.container}>
          <li className={styles.board}>
            <BoardCard
              title="核券数"
              content={getTrendTemplate('昨日核券数', '历史核券数')(use)}
              activeTitle={activeCardTitle}
              onMoreBtnClick={(currentTitle) => this.activeAndNavigateTo('/admin/analysis/dashboard/coupon', currentTitle)}/>
          </li>
          <li className={styles.board}>
            <BoardCard
              title="领券数"
              content={getTrendTemplate('昨日领券数', '历史领券数')(get)}
              activeTitle={activeCardTitle}
              onMoreBtnClick={(currentTitle) => this.activeAndNavigateTo('/admin/analysis/dashboard/coupon', currentTitle)}/>
          </li>
          <li className={styles.board}>
            <BoardCard
              title="粉丝"
              content={getTrendTemplate('昨日新增粉丝', '总粉丝数')(fans)}
              activeTitle={activeCardTitle}
              onMoreBtnClick={(currentTitle) => this.activeAndNavigateTo('/admin/analysis/dashboard/fans', currentTitle)}/>
          </li>
          <li className={styles.board}>
            <BoardCard
              title="单品分析"
              content={getTotalTemplate()(good)}
              activeTitle={activeCardTitle}
              onMoreBtnClick={(currentTitle) => this.activeAndNavigateTo('/admin/analysis/dashboard/good', currentTitle)}/>
          </li>
        </ul>

        <Match pattern="/admin/analysis/dashboard/coupon" component={CouponWrapper}/>
        <Match pattern="/admin/analysis/dashboard/fans" component={FansTrend}/>
        <Match pattern="/admin/analysis/dashboard/good" component={GoodTrend}/>
      </Spin>
    );
  }
}
