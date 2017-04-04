import React, { Component, PropTypes } from 'react';
import * as styles from './styles.css';

import { Header, Footer } from 'components/home';

export default class MainWrapper extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Header/>
        </div>
        <div className={styles.content}>
          {this.props.children}
        </div>
        <div className={styles.footer}>
          <Footer/>
        </div>
      </div>
    );
  }
}
