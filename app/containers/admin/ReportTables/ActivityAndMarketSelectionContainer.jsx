import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as reportActionCreators from 'redux/modules/report';
import EventEmitter from 'helpers/event';

import { ActivityAndMarketSelection } from 'components/admin/ReportTables';

export const LOADED_ACTIVITY_LIST = 'LOADE_ACTIVITY_LIST';

@connect(
  ({report}) => ({
    activityList: report.activityList,
    marketList: report.marketList
  }),
  dispatch => bindActionCreators(reportActionCreators, dispatch)
)
export default class ActivityAndMarketSelectionContainer extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    activityList: PropTypes.array.isRequired,
    marketList: PropTypes.array.isRequired,
    handleFetchActivityList: PropTypes.func.isRequired,
    handleFetchMarketList: PropTypes.func.isRequired,
    activityFieldName: PropTypes.string,
    hideMarket: PropTypes.bool
  }
  async componentDidMount() {
    const activityList = await this.props.handleFetchActivityList();

    // 每次列表加载后，如果活动列表不为空，主动触发一次报表查询，并且根据该活动查询一次门店列表
    if (activityList.length) {
      EventEmitter.emit(LOADED_ACTIVITY_LIST);
      this.props.handleFetchMarketList(activityList[0].activeid);
    }
  }
  render () {
    const { form, activityList, marketList, handleFetchMarketList, activityFieldName, hideMarket } = this.props;
    return (
      <ActivityAndMarketSelection
        form={form}
        activityList={activityList}
        marketList={marketList}
        activityFieldName={activityFieldName}
        hideMarket={hideMarket}
        fetchMarketList={handleFetchMarketList}/>
    );
  }
}
