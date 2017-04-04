import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import * as styles from './styles.css';

export default class Header extends Component {

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  handleClick() {
    this.context.router.replaceWith('/');
  }
  render(){
    return (
      <div className={styles.container}>
        <img src={require('images/logo.png')} onClick={::this.handleClick}/>
      </div>
    );
  }
}
