import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import { HomeNav } from 'components/admin/Home';

@connect(
  ({menu}) => ({
    nav: menu.nav
  }),
)
export default class HomeNavContainer extends Component {
  static propTypes = {
    nav: PropTypes.array.isRequired,
  }
  render() {
    return (
      <HomeNav {...this.props}/>
    );
  }
}
