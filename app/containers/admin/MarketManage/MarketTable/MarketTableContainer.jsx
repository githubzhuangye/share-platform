import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MarketTable } from 'components/admin/MarketManage';
import * as marketManageActionCreators from 'redux/modules/marketManage';
import { MARKET_STATUS } from 'config/constants';

const { STOP, START } = MARKET_STATUS;

@connect(
  ({marketManage}) => ({
    dataSource: marketManage.dataSource,
    totalMarket: marketManage.totalMarket,
    page: marketManage.page,
    loading: marketManage.loading,
    selectedRowKeys: marketManage.selectedKeys
  }),
  dispatch => bindActionCreators(marketManageActionCreators, dispatch)
)
class MarketTableContainer extends React.Component {
  static propTypes = {
    dataSource: PropTypes.array.isRequired,
    totalMarket: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    loading: PropTypes.bool.isRequired,
    selectedRowKeys: PropTypes.array.isRequired,
    handleFetchMarket: PropTypes.func.isRequired,
    handlePageChange: PropTypes.func.isRequired,
    setSelectedKeys: PropTypes.func.isRequired,
    handleMarketsStatusChange: PropTypes.func.isRequired,
  }
  componentDidMount() {
    this.props.handleFetchMarket();
  }
  handleStartBtnClick() {
    this.props.handleMarketsStatusChange(START.value);
  }
  handleStopBtnClick() {
    this.props.handleMarketsStatusChange(STOP.value);
  }
  render () {
    const { dataSource, totalMarket, page, loading, selectedRowKeys, handlePageChange, setSelectedKeys } = this.props;
    return (
      <MarketTable
        dataSource={dataSource}
        page={page}
        totalMarket={totalMarket}
        loading={loading}
        selectedRowKeys={selectedRowKeys}
        onPageChange={handlePageChange}
        onSelectedKeysChange={setSelectedKeys}
        onStartBtnClick={::this.handleStartBtnClick}
        onStopBtnClick={::this.handleStopBtnClick}/>
    );
  }
}

export default MarketTableContainer;
