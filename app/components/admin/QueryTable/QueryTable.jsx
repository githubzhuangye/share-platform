import React, { Component, PropTypes } from 'react';
import { Table, Form, Row, Col } from 'antd';
import { pickBy, omitBy, isArray, flow } from 'lodash/fp';
import * as globalStyles from 'sharedStyles/global.css';
import { MARGIN_STYLE } from 'config/constants';
import { validateFields, formatBackendDate, generateAuthFields, fuckBackend, isValidField } from 'helpers/util';
import EventEmitter from 'helpers/event';
import { LOADED_ACTIVITY_LIST } from 'containers/admin/ReportTables/ActivityAndMarketSelectionContainer';

import { QueryAndExportBtns } from 'components/admin';

@Form.create()
export default class QueryTable extends Component {
  static propTypes = {
    columns: PropTypes.array.isRequired,
    dataSource: PropTypes.array.isRequired,
    page: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    loading: PropTypes.bool.isRequired,
    form: PropTypes.object.isRequired,
    statistics: PropTypes.node,
    onPageChange: PropTypes.func.isRequired,
    onQueryBtnClick: PropTypes.func.isRequired,
    getQueryForm: PropTypes.func,
    exportUrl: PropTypes.string,
    autoInjectQueryAndExportBtns: PropTypes.bool.isRequired,
  }
  static defaultProps = {
    autoInjectQueryAndExportBtns: true,
  }
  componentDidMount() {
    EventEmitter.on(LOADED_ACTIVITY_LIST, ::this.handleQueryBtnClick);
  }
  componentWillUnmount() {
    EventEmitter.off(LOADED_ACTIVITY_LIST);
  }
  handleQueryBtnClick() {
    const { form, onQueryBtnClick } = this.props;
    const { getFieldsValue } = this.props.form;
    validateFields(this.props.form)
      .then(values => onQueryBtnClick(values))
      .catch(e => console.log(e));
  }
  handleExportBtnClick() {
    // TODO: need to refactor
    if (!this.props.exportUrl) {
      return;
    }
    validateFields(this.props.form)
      .then(data => {
        let queryData = data.date ? ({...data, start: formatBackendDate(data.date[0]), end: formatBackendDate(data.date[1])}) : data;
        queryData = flow(
          pickBy(isValidField),
          omitBy(value => isArray(value)) // 忽略数组，如RangePicker返回的数组
        )(queryData)
        window.location.assign(this.props.exportUrl + '?' + fuckBackend({...queryData, ...generateAuthFields()}));
      })
      .catch(e => console.log(e));
  }
  render() {
    const { columns, dataSource, page, total, loading, onPageChange, onQueryBtnClick,
      getQueryForm, form, exportUrl, autoInjectQueryAndExportBtns } = this.props;
    const pager = {cur: page, total, onChange: onPageChange};
    return (
      <div>
        <div className={globalStyles.queryForm}>
          <Form>
            {getQueryForm && getQueryForm(form, ::this.handleQueryBtnClick, ::this.handleExportBtnClick)}
            {autoInjectQueryAndExportBtns
            ? <Row>
                <Col offset={2} span={8} style={MARGIN_STYLE}>
                  <QueryAndExportBtns
                    onQueryBtnClick={::this.handleQueryBtnClick}
                    onExportBtnClick={exportUrl ? ::this.handleExportBtnClick : null}/>
                </Col>
              </Row>
            : null}
          </Form>
        </div>
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={pager}/>
      </div>
    );
  }
}
