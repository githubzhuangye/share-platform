import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal, message } from 'antd';
import { ProductTable } from 'components/admin/ProductManage';
import * as productManageActionCreators from 'redux/modules/productManage';

const confirm = Modal.confirm;

@connect(
  ({productManage}) => ({
    dataSource: productManage.dataSource, page: productManage.page, total: productManage.total,
    loading: productManage.loading,
    selectedRowKeys: productManage.selectedRowKeys
  }),
  dispatch => bindActionCreators(productManageActionCreators, dispatch)
)
class ProductTableContainer extends React.Component {
  static propTypes = {
    dataSource: PropTypes.array.isRequired,
    page: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    loading: PropTypes.bool.isRequired,
    selectedRowKeys: PropTypes.array.isRequired,
    setSelectedRowKeys: PropTypes.func.isRequired,
    handleFetchProduct: PropTypes.func.isRequired,
    handlePageChange: PropTypes.func.isRequired,
    handleProductsStatusChange: PropTypes.func.isRequired,
    handleEditProduct: PropTypes.func.isRequired
  }
  componentDidMount() {
    this.props.handleFetchProduct();
  }
  handlePagechange(page) {
    this.props.handlePageChange(page);
  }
  handleRowSelectionChange(keys) {
    this.props.setSelectedRowKeys(keys);
  }
  handleStartProducts() {
    this.props.handleProductsStatusChange('启用');
  }
  handleStopProducts() {
    this.props.handleProductsStatusChange('停用');
  }
  handleEditProduct(key) {
    this.props.handleEditProduct(key);
  }
  render () {
    const { dataSource, page, total, loading, selectedRowKeys } = this.props;
    return (
      <ProductTable
        dataSource={dataSource}
        page={page}
        total={total}
        loading={loading}
        selectedRowKeys={selectedRowKeys}
        onRowSelectionChange={::this.handleRowSelectionChange}
        onPageChange={::this.handlePagechange}
        onStartProducts={::this.handleStartProducts}
        onStopProducts={::this.handleStopProducts}
        onEditPropduct={::this.handleEditProduct}/>
    );
  }
}

export default ProductTableContainer;
