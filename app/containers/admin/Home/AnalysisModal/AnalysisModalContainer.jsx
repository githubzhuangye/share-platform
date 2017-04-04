import React, { PropTypes, Component } from 'react';
import { List } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as analysisModalActionCreators from 'redux/modules/analysisModal';
import { AnalysisModal } from 'components/admin/Home';

@connect(
  ({analysisModal}) => ({
    totalSaas: analysisModal.get('totalSaas'),
    activeSaas: analysisModal.get('activeSaas'),
    visible: analysisModal.get('modalVisible'),
    dataSource: analysisModal.get('dataSource'),
    page: analysisModal.get('page'),
    pageTotal: analysisModal.get('pageTotal')
  }),
  dispatch => bindActionCreators(analysisModalActionCreators, dispatch)
)
export default class AnalysisModalContainer extends Component {
  static propTypes = {
    totalSaas: PropTypes.number.isRequired,
    activeSaas: PropTypes.number.isRequired,
    dataSource: PropTypes.instanceOf(List),
    visible: PropTypes.bool.isRequired,
    page: PropTypes.number.isRequired,
    pageTotal: PropTypes.number.isRequired,
    closeModal: PropTypes.func.isRequired,
    handleFetchAnalysisData: PropTypes.func.isRequired,
    handlePageChange: PropTypes.func.isRequired,
    setQueryDate: PropTypes.func.isRequired
  }
  componentDidMount() {
    this.props.handleFetchAnalysisData();
  }
  handleQueryBtnClick() {
    this.props.handleFetchAnalysisData();
  }
  handleDateChange(value) {
    this.props.setQueryDate(value);
  }
  render() {
    const { visible, totalSaas, activeSaas, dataSource, page, pageTotal, closeModal, handlePageChange } = this.props;
    return (
      <AnalysisModal
        visible={visible}
        totalSaas={totalSaas}
        activeSaas={activeSaas}
        dataSource={dataSource}
        page={page}
        pageTotal={pageTotal}
        onCancel={closeModal}
        onQueryBtnClick={::this.handleQueryBtnClick}
        onDateChange={::this.handleDateChange}
        onPageChange={handlePageChange}/>
    );
  }
}
