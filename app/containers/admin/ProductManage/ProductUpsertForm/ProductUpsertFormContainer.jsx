import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ProductUpsertForm } from 'components/admin/ProductManage';
import * as productManageActionCreators from 'redux/modules/productManage';
import { FORM_MODE } from 'config/constants';

@connect(
  ({productManage}) => ({
    visible: productManage.upsertFormModalVisible,
    brandlist: productManage.productInfo.brandlist,
    categoryList: productManage.productInfo.categoryList,
    dictlist: productManage.productInfo.dictlist,
    upsertFormData: productManage.upsertFormData,
    upsertFormMode: productManage.upsertFormMode,
  }),
  dispatch => bindActionCreators(productManageActionCreators, dispatch)
)
class ProductUpsertFormContainer extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    brandlist: PropTypes.array.isRequired,
    categoryList: PropTypes.array.isRequired,
    dictlist: PropTypes.array.isRequired,
    upsertFormData: PropTypes.object,
    upsertFormMode: PropTypes.number.isRequired,
    handleModalClose: PropTypes.func.isRequired,
    handleUpsertFormSubmit: PropTypes.func.isRequired,
    handleUpdateProduct: PropTypes.func.isRequired
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.upsertFormMode === FORM_MODE.EDIT.value) {
      setTimeout(() => {
        this._form.setFieldsValue(this.props.upsertFormData);
      }, 0);
    }
  }
  render () {
    const { upsertFormMode, visible, handleModalClose, handleUpsertFormSubmit, handleUpdateProduct,
      brandlist, categoryList, dictlist } = this.props;
    return (
      <ProductUpsertForm
        ref={form => this._form = form}
        mode={upsertFormMode}
        visible={visible}
        brandlist={brandlist}
        categoryList={categoryList}
        dictlist={dictlist}
        onUpdateProduct={handleUpdateProduct}
        onUpsertFormSubmit={handleUpsertFormSubmit}
        onUpsertFormClose={handleModalClose}/>
    );
  }
}

export default ProductUpsertFormContainer;
