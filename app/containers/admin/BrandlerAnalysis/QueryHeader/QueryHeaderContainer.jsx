import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as queryHeaderActionCreators from 'redux/modules/brandlerQueryHeader';
import { QueryHeader } from 'components/admin/BrandlerAnalysis';

@connect(
  ({brandlerQueryHeader}, ownProps) => ({
    areaList: brandlerQueryHeader.get('areaList').toArray(),
    saasList: brandlerQueryHeader.get('saasList').toArray(),
    marketList: brandlerQueryHeader.get('marketList').toArray(),
    isFetched: brandlerQueryHeader.get('isFetched'),
    loading: brandlerQueryHeader.get('loading'),
    fetchData: ownProps.fetchData,
    hasBackBtn: ownProps.hasBackBtn,
    onDataFetched: ownProps.onDataFetched,
    onQueryChange: ownProps.onQueryChange,
  }),
  dispatch => bindActionCreators(queryHeaderActionCreators, dispatch),
)
export default class QueryHeaderContainer extends Component {
  static propTypes = {
    areaList: PropTypes.array.isRequired,
    saasList: PropTypes.array.isRequired,
    marketList: PropTypes.array.isRequired,
    isFetched: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    handleFetchList: PropTypes.func.isRequired,
    handleFetchMarketList: PropTypes.func.isRequired,
    fetchData: PropTypes.func.isRequired,
    hasBackBtn: PropTypes.bool.isRequired,
    onDataFetched: PropTypes.func,
    onQueryChange: PropTypes.func,
  }
  static defaultProps = {
    hasBackBtn: false,
  }
  componentDidMount() {
    const { isFetched, handleFetchList } = this.props;
    if (!isFetched) {
      handleFetchList();
    }
  }
  render() {
    const { areaList, saasList, marketList, loading, hideMarket,
      fetchData, hasBackBtn, onDataFetched, onQueryChange, handleFetchMarketList } = this.props;
    return (
      <QueryHeader
        areaList={areaList}
        saasList={saasList}
        marketList={marketList}
        loading={loading}
        hideMarket={hideMarket}
        fetchData={fetchData}
        fetchMarket={handleFetchMarketList}
        hasBackBtn={hasBackBtn}
        onDataFetched={onDataFetched}
        onQueryChange={onQueryChange}/>
    );
  }
}
