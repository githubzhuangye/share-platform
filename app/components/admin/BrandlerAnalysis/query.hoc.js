import React, { PropTypes, Component } from 'react';
import { QueryHeaderContainer } from 'containers/admin/BrandlerAnalysis';

export default config => Component => {
  return class AutoQueryComponent extends Component {
    state = {
      query: undefined,
      total: undefined,
      dataSource: undefined,
    }
    handleDataFetched(data) {
      const { dataSource, total } = data;
      this.setState({dataSource, total});
    }
    handleQueryChange(query) {
      this.setState({query});
    }
    render() {
      const props = {...this.props, ...this.state};
      return (
        <div>
          <QueryHeaderContainer
            hasBackBtn={config.hasBackBtn}
            fetchData={config.fetchData}
            onDataFetched={::this.handleDataFetched}
            onQueryChange={::this.handleQueryChange}/>
          <Component {...props}/>
        </div>
      );
    }
  }
}
