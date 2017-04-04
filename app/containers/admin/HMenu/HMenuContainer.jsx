import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as tabActionCreators from 'redux/modules/tab';

import { HMenu } from 'components/admin';

@connect(
  (_, ownProps) => ({
    ...ownProps,
  }),
  dispatch => bindActionCreators(tabActionCreators, dispatch),
)
export default class HMenuContainer extends Component {
  static propTypes = {
    setTab: PropTypes.func.isRequired,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  handleLinkClick(url) {
    this.props.setTab(url.split('/')[2]);
    this.context.router.replaceWith(url);
  }
  render() {
    return (
      <HMenu {...this.props}
        onLinkClick={::this.handleLinkClick}>
        {this.props.children}
      </HMenu>
    );
  }
}