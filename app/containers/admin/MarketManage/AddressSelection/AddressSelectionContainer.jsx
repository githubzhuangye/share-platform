import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AddressSelection } from 'components/admin/MarketManage';
import * as marketManageActionCreators from 'redux/modules/marketManage';

@connect(
  ({marketManage, common}, ownProps) => ({
    provinceAndCity: common.get('provinceAndCity').toJS(),
    region: marketManage.region,
    ...ownProps,
  }),
  dispatch => bindActionCreators(marketManageActionCreators, dispatch)
)
export default class AddressSelectionContainer extends React.Component {
  static propTypes = {
    provinceAndCity: PropTypes.array.isRequired,
    form: PropTypes.object.isRequired,
    region: PropTypes.array.isRequired,
    mode: PropTypes.string.isRequired,
    setRegion: PropTypes.func.isRequired,
  }
  render () {
    return (
      <AddressSelection {...this.props}/>
    );
  }
}
