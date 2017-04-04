import React from 'react';
import { Spin } from 'antd';

const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    position: 'relative'
  },
  center: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  }
};

function Loading() {
  return (
    <div style={styles.container}>
      <div style={styles.center}>
        <Spin size="large"/>
      </div>
    </div>
  );
}

export default class AsyncComponent extends React.Component {
  state = {
    component: null
  }
  componentDidMount() {
    this.props.loader((componentModule) => {
      this.setState({
        component: componentModule.default
      });
    });
  }
  renderPlaceholder() {
    return (
      <Loading/>
    );
  }
  render() {
    if (this.state.component) {
      return <this.state.component/>
    }
    return (this.props.renderPlaceholder || this.renderPlaceholder)();
  }
}

AsyncComponent.propTypes = {
  loader: React.PropTypes.func.isRequired,
  renderPlaceholder: React.PropTypes.func
};
