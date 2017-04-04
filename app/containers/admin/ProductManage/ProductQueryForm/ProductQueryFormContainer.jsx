import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ProductQueryForm } from 'components/admin/ProductManage';
import * as productManageActionCreators from 'redux/modules/productManage';

@connect(
  ({productManage}) => ({
    status: productManage.queryStatus,
    brandlist: productManage.productInfo.brandlist,
    categoryList: productManage.productInfo.categoryList
  }),
  dispatch => bindActionCreators(productManageActionCreators, dispatch)
)
class ProductQueryFormContainer extends React.Component {
  static propTypes = {
    status: PropTypes.number.isRequired,
    setQueryStatus: PropTypes.func.isRequired,
    handleQueryProduct: PropTypes.func.isRequired,
    openUpsertFormModal: PropTypes.func.isRequired
  }
  handleQuery(queryData) {
    this.props.handleQueryProduct(queryData);
  }
  render () {
    const { status, setQueryStatus, brandlist, categoryList, openUpsertFormModal } = this.props;
    return (
      <ProductQueryForm
        status={status}
        onStatusChange={setQueryStatus}
        brandlist={brandlist}
        categoryList={categoryList}
        onQueryBtnClick={::this.handleQuery}
        onAddBtnClick={openUpsertFormModal}/>
    );
  }
}

export default ProductQueryFormContainer;
