import React, { PropTypes } from 'react';
import { commonApi } from 'api';
import { Board } from 'components/admin/Sidebar';

export default class BoardContainer extends React.Component {
  static propTypes = {
    duration: PropTypes.number.isRequired,
  }
  static defaultProps = {
    duration: 10,
  }
  state = {
    newData: [],
    timer: null
  }
  componentDidMount() {
    this.fetchLiveCoupon();
    const timer = setInterval(() => {
      this.fetchLiveCoupon();
    }, 1000 * this.props.duration);
    this.setState({...this.state, timer});
  }
  componentWillUnmount() {
    clearInterval(this.state.timer);
    this.setState({...this.state, timer: null});
  }
  fetchLiveCoupon() {
    commonApi
      .fetchLiveCoupon()
      .then(data => this.setState({...this.state, newData: data}));
  }
  render () {
    const { newData } = this.state;
    return (
      <Board newData={newData}/>
    );
  }
}