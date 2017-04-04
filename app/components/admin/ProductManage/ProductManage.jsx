import React, { PropTypes, Component } from 'react';
import { Card, Button, Icon } from 'antd';
import * as styles from './styles.css';
import { ProductTableContainer, ProductUpsertFormContainer, ProductQueryFormContainer } from 'containers/admin/ProductManage';

export default class ProductManage extends Component {
  render() {
    const { onAddProduct } = this.props;
    return (
      <div>
        <div className={styles.findSection}>
          <ProductQueryFormContainer/>
        </div>
        <ProductTableContainer/>
        <ProductUpsertFormContainer/>
      </div>
    );
  }
}
