import { fromJS, List } from 'immutable';
import { commonApi } from 'api';
import moment from 'moment';

const PREFIX = '@@ANALYSIS_MODAL/';
const SET_QUERY_DATE = PREFIX + 'SET_QUERY_DATE';
const SET_PAGE = PREFIX + 'SET_PAGE';
const SET_PAGE_TOTAL = PREFIX + 'SET_PAGE_TOTAL';
const SET_DATASOURCE = PREFIX + 'SET_DATASOURCE';
const SET_SAAS_INFO = PREFIX + 'SET_SAAS_INFO';
const OPEN_MODAL = PREFIX + 'OPEN_MODAL';
const CLOSE_MODAL = PREFIX + 'CLOSE_MODAL';

export function setQueryDate(queryDate) {
  return {
    type: SET_QUERY_DATE,
    queryDate
  };
}

function setPage(page) {
  return {
    type: SET_PAGE,
    page
  };
}

function setPageTotal(pageTotal) {
  return {
    type: SET_PAGE_TOTAL,
    pageTotal
  };
}

function setDataSource(dataSource) {
  return {
    type: SET_DATASOURCE,
    dataSource
  };
}

function setSaasInfo({totalSaas, activeSaas}) {
  return {
    type: SET_SAAS_INFO,
    totalSaas,
    activeSaas
  };
}

export function openModal() {
  return {
    type: OPEN_MODAL
  };
}

export function closeModal() {
  return {
    type: CLOSE_MODAL
  };
}

export function handleFetchAnalysisData() {
  return (dispatch, getState) => {
    const analysisModal = getState().analysisModal;
    const queryDate = analysisModal.get('queryDate').toArray();
    const page = analysisModal.get('page');
    const { start, end } = formatDate(queryDate);
    commonApi.fetchAnalysisData(start, end, page)
      .then(({totalSaas, activeSaas, dataSource, pageTotal}) => {
        dispatch(setSaasInfo({totalSaas, activeSaas}));
        dispatch(setDataSource(dataSource));
        dispatch(setPageTotal(pageTotal));
      });
  };
}

export function handlePageChange(page) {
  return dispatch => {
    dispatch(setPage(page));
    dispatch(handleFetchAnalysisData());
  };
}

const initialState = fromJS({
  queryDate: [],
  page: 1,
  pageTotal: 0,
  dataSource: [],
  totalSaas: 0,
  activeSaas: 0,
  modalVisible: false
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_QUERY_DATE:
      return state.set('queryDate', List(action.queryDate));
    case SET_PAGE:
      return state.set('page', action.page);
    case SET_PAGE_TOTAL:
      return state.set('pageTotal', action.pageTotal);
    case SET_DATASOURCE:
      return state.set('dataSource', List(action.dataSource));
    case SET_SAAS_INFO:
      return state
        .set('totalSaas', action.totalSaas)
        .set('activeSaas', action.activeSaas);
    case OPEN_MODAL:
      return state.set('modalVisible', true);
    case CLOSE_MODAL:
      return state.set('modalVisible', false);
    default:
      return state;
  }
}

// util
function formatDate(date) {
  const formatStr = 'YYYY-MM-DD';
  let start, end;
  if (date.length === 0 || (date[0] === null && date[1] === null)) {
    end = moment().format(formatStr);
    start = moment().subtract(5, 'days').format(formatStr);
  } else {
    start = moment(date[0]).format(formatStr);
    end = moment(date[1]).format(formatStr);
  }
  return {start, end};
}
