import React from 'react';
import axios from 'axios';
import { flow, pickBy, omitBy, isArray, isFunction } from 'lodash/fp';
import { generateAuthFields, formatBackendDate, isValidField } from 'helpers/util';

export default function queriable({url, initialFetch = false, formatData, formatTotal, formatDate, pageFieldName = 'page'}) {
  return Component => {
    if (!url) {
      throw new Error('请输入获取数据的url!');
    }
    if (!isFunction(formatData)) {
      throw new Error('请提供正确的dataSource格式化函数!');
    }
    if (!isFunction(formatTotal)) {
      throw new Error('请提供正确的total格式化函数!')
    }

    return class QuariableComponent extends React.Component {
      state = {
        queryData: {},
        dataSource: [],
        page: 1,
        total: 0,
        loading: false
      }
      fetchData() {
        this.setState({...this.state, loading: true});
        return axios
          .get(url, { params: {...generateAuthFields(), ...this.state.queryData, [pageFieldName]: this.state.page}})
          .then(data => data.data.data)
          .then(data => ({ total: formatTotal(data), dataSource: formatData(data) }))
          .then(data => this.setState({...this.state, ...data, loading: false}))
          .catch(error => console.log(error));
      }
      componentDidMount() {
        if (initialFetch) {
          this.fetchData();
        }
      }
      handlePageChange(page) {
        this.setState({...this.state, page}, ::this.fetchData);
      }
      handleTotalChange(total) {
        this.setState({...this.state, total});
      }
      handleQueryBtnClick(data) {
        let queryData = data;
        if (formatDate) {
          queryData = data.date ? ({...data, start: formatBackendDate(data.date[0]), end: formatBackendDate(data.date[1]) }) : data;
        }
        queryData = flow(
          pickBy(isValidField),
          omitBy(value => isArray(value)) // 忽略数组，如RangePicker返回的数组
        )(queryData)
        this.setState({...this.state, queryData, page: 1}, ::this.fetchData);
      }
      render() {
        const { queryData,...mergeProps } = this.state;
        const props = { ...this.props, ...mergeProps };
        return (
          <Component
            {...props}
            onPageChange={::this.handlePageChange}
            onQueryBtnClick = {::this.handleQueryBtnClick } />
        );
      }

    }

  }
}
