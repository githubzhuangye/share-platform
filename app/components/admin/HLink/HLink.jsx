import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import store from 'config/store';
import { setTab } from 'redux/modules/tab';

export default class HLink extends Component {
  handleLinkClick(url) {
    store.dispatch(setTab(url.split('/')[2]));
  }
  render() {
    return (
      <Link {...this.props} onClick={() => this.handleLinkClick(this.props.to)}>
        {this.props.children}
      </Link>
    );
  }
}