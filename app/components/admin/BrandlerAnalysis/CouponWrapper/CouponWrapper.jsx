import React, { PropTypes, Component } from 'react';
import { DIMENSIONS } from 'config/constants';
import CouponAnalysis from './CouponAnalysis';
import CouponDetail from './CouponDetail';
import { cardable } from 'hoc';

export default class CouponWrapper extends Component {
  state = {
    dimensionDepth: 1,
    firstDimension: DIMENSIONS.REGION,
    firstDimensionInfo: {},
  }
  handlePieItemClick(info) {
    if (this.state.firstDimension === DIMENSIONS.MARKET) return;
    this.setState({dimensionDepth: 2, firstDimensionInfo: info});
  }
  handleBackBtnClick() {
    this.setState({dimensionDepth: 1, firstDimensionName: {}});
  }
  handleFirstDimensionChange(firstDimension) {
    this.setState({firstDimension});
  }
  render() {
    const { dimensionDepth, firstDimension, firstDimensionInfo } = this.state;
    return dimensionDepth === 1
      ? <CouponAnalysis
          dimension={firstDimension}
          onPieItemClick={::this.handlePieItemClick}
          onDimensionChange={::this.handleFirstDimensionChange}/>
      : <CouponDetail
          firstDimension={firstDimension}
          firstDimensionInfo={firstDimensionInfo}
          onBackBtnClick={::this.handleBackBtnClick}/>;
  }
}
