import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MarketQueryForm } from 'components/admin/MarketManage';
import * as marketManageActionCreators from 'redux/modules/marketManage';

@connect(
  ({auth}) => ({saaslist: auth.saaslist}),
  dispatch => bindActionCreators(marketManageActionCreators, dispatch)
)
class MarketQueryFormContainer extends React.Component {
  static propTypes = {
    saaslist: PropTypes.array.isRequired,
    handleQuery: PropTypes.func.isRequired,
    openUpsertForm: PropTypes.func.isRequired
  }
  render () {
    const { openUpsertForm, handleQuery, saaslist } = this.props;
    return (
      <MarketQueryForm
        saaslist={saaslist}
        onQueryBtnClick={handleQuery}
        onAddBtnClick={openUpsertForm}/>
    );
  }
}

export default MarketQueryFormContainer;
