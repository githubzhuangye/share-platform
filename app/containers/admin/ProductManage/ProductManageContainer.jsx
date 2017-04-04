import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ProductManage } from 'components/admin';
import * as productManageActionCreators from 'redux/modules/productManage';
import { cardable } from 'hoc';

@cardable(['商品管理'])
@connect(
  ({productManage}) => ({productInfoFetched: productManage.productInfoFetched}),
  dispatch => bindActionCreators(productManageActionCreators, dispatch)
)
class ProductManageContainer extends React.Component {
  static propTypes = {
    productInfoFetched: PropTypes.bool.isRequired,
    handleQueryProductInfo: PropTypes.func.isRequired
  }
  componentDidMount() {
    const { productInfoFetched, handleQueryProductInfo } = this.props;
    if (!productInfoFetched) {
      handleQueryProductInfo();
    }
  }
  render () {
    return (
      <ProductManage/>
    );
  }
}

export default ProductManageContainer;
