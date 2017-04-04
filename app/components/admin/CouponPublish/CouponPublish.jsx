import React, { PropTypes, Component } from 'react';
import { Presentation } from 'components/admin/CouponPublish';
import { PublishFormContainer } from 'containers/admin/CouponPublish';
import styles from './styles.css';
import { cardable } from 'hoc';

@cardable(['券发行'])
export default class CouponPublish extends Component {
  render() {
    return (
      <div className={styles.couponPublish}>
        <div className={styles.tbfContext}>
          <div className={styles.tbfMain}>
            <Presentation/>
            <PublishFormContainer {...this.props}/>
          </div>
        </div>
      </div>
    );
  }
}
