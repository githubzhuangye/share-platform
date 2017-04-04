import moment from 'moment';
import { productManageApi } from 'api';
import { PRODUCT_STATUS, FORM_MODE } from 'config/constants';
import { transformStatus } from 'helpers/util';

const { START, STOP, ALL } = PRODUCT_STATUS;
const { NEW, EDIT } = FORM_MODE;

const PREFIX = '@@PRODUCT_MANAGE/';
const FETCH_PRODUCT = PREFIX + 'FETCH_PRODUCT';
const FETCH_PRODUCT_SUCCESS = PREFIX + 'FETCH_PRODUCT_SUCCESS';
const FETCH_PRODUCT_FAIL = PREFIX + 'FETCH_PRODUCT_FAIL';
const SET_PAGE = PREFIX + 'SET_PAGE';
const SET_SELECTED_ROW_KEYS = PREFIX + 'SET_SELECTED_ROW_KEYS';
const STOP_PRODUCTS = PREFIX + 'STOP_PRODUCTS';
const START_PRODUCTS = PREFIX + 'START_PRODUCTS';
const DELETE_PRODUCT = PREFIX + 'DELETE_PRODUCT';
const OPEN_UPSERT_FORM_MODAL = PREFIX + 'OPEN_UPSERT_FORM_MODAL';
const CLOSE_UPSERT_FORM_MODAL = PREFIX + 'CLOSE_UPSERT_FORM_MODAL';
const SUBMIT_UPSERT_FORM = PREFIX + 'SUBMIT_UPSERT_FORM';
const SET_QUERY_STATUS = PREFIX + 'SET_QUERY_STATUS';
const SET_QUERY_DATA = PREFIX + 'SET_QUERY_DATA';
const SET_PRODUCT_INFO = PREFIX + 'SET_PRODUCT_INFO';
const SET_TOTAL = PREFIX + 'SET_TOTAL';
const INSERT_PRODUCT = PREFIX + 'INSERT_PRODUCT';
const CHANGE_FORM_MODE = PREFIX + 'CHANGE_FORM_MODE';
const UPDATE_PRODUCT = PREFIX + 'UPDATE_PRODUCT';
const SET_UPDATE_PRODUCT_KEY = PREFIX + 'SET_UPDATE_PRODUCT_KEY';

const initialState = {
  loading: false,
  error: '',
  page: 1,
  total: 500,
  dataSource: [],
  selectedRowKeys: [],
  upsertFormModalVisible: false,
  upsertFormData: null,
  upsertFormMode: NEW.value,
  updateProductKey: '',
  queryStatus: ALL.value,
  queryData: {},
  productInfo: {
    brandlist: [],
    dictlist: [],
    categoryList: [], // fuck the backend api
  },
  productInfoFetched: false
};

function fetchProduct() {
  return {
    type: FETCH_PRODUCT
  };
}

function fetchProductSuccess(dataSource) {
  return {
    type: FETCH_PRODUCT_SUCCESS,
    dataSource
  };
}

function fetchProductFail(error) {
  return {
    type: FETCH_PRODUCT_FAIL,
    error
  };
}

function setPage(page) {
  return {
    type: SET_PAGE,
    page
  };
}

function setTotal(total) {
  return {
    type: SET_TOTAL,
    total
  };
}

function stopProducts() {
  return {
    type: STOP_PRODUCTS
  };
}

function startProducts() {
  return {
    type: START_PRODUCTS
  };
}

function deleteProduct(key) {
  return {
    type: DELETE_PRODUCT,
    key
  };
}

function submitUpsertForm(data) {
  return {
    type: SUBMIT_UPSERT_FORM,
    data
  };
}

function setQueryData(data) {
  return {
    type: SET_QUERY_DATA,
    data
  };
}

function setProductInfo(productInfo) {
  return {
    type: SET_PRODUCT_INFO,
    productInfo
  };
}

function insertProduct(data) {
  return {
    type: INSERT_PRODUCT,
    data
  };
}

function changeFormMode(upsertFormMode) {
  return {
    type: CHANGE_FORM_MODE,
    upsertFormMode
  };
}

function setUpdateProductKey(updateProductKey) {
  return {
    type: SET_UPDATE_PRODUCT_KEY,
    updateProductKey
  };
}

export function setQueryStatus(status) {
  return {
    type: SET_QUERY_STATUS,
    status
  };
}

export function setSelectedRowKeys(keys) {
  return {
    type: SET_SELECTED_ROW_KEYS,
    keys
  };
}

export function openUpsertFormModal() {
  return {
    type: OPEN_UPSERT_FORM_MODAL
  };
}

export function closeUpsertFormModal() {
  return {
    type: CLOSE_UPSERT_FORM_MODAL
  };
}

function updateProduct(index, data) {
  return {
    type: UPDATE_PRODUCT,
    index,
    data
  };
}

export function handleFetchProduct(queryData = {}) {
  return dispatch => {
    dispatch(fetchProduct());
    productManageApi
      .fetchProduct(queryData)
      .then(({dataSource, total}) => {
        dispatch(fetchProductSuccess(dataSource))
        dispatch(setTotal(total));
      })
      .catch(error => dispatch(fetchProductFail(error)));
  };
}

export function handleQueryProduct(queryData) {
  return dispatch => {
    dispatch(setQueryData(queryData));
    dispatch(setPage(1));
    dispatch(handleFetchProduct(queryData));
  };
}

export function handlePageChange(page) {
  return (dispatch, getState) => {
    const queryData = getState().productManage.queryData;
    dispatch(setPage(page));
    dispatch(handleFetchProduct({...queryData, curpage: page}));
  };
}

export function handleProductsStatusChange(status) {
  return (dispatch, getState) => {
    const selectedRowKeys = getState().productManage.selectedRowKeys;
    if (status === '启用') {
      productManageApi.startProducts(selectedRowKeys);
      dispatch(startProducts());
    } else if (status === '停用') {
      productManageApi.stopProducts(selectedRowKeys);
      dispatch(stopProducts());
    }
    dispatch(setSelectedRowKeys([]));
  };
}

export function handleDeleteProduct(key) {
  return dispatch => {
    productManageApi.deleteProduct(key);
    dispatch(deleteProduct(key));
  };
}

export function handleModalClose() {
  return dispatch => {
    dispatch(closeUpsertFormModal());
    dispatch(changeFormMode(NEW.value));
    dispatch(submitUpsertForm({}));
  };
}

export function handleUpsertFormSubmit(data) {
  return (dispatch, getState) => {
    function insertProductAndCloseModal() {
      dispatch(insertProduct(insertedData));
      dispatch(handleModalClose());
    }
    const insertedData = formatProductData(getState, data);

    return productManageApi.upsertProduct(data)
      .then(() => {
        if (data.brandname) { // if user add new brand, we should refetch it from backend
          dispatch(handleQueryProductInfo())
            .then(() => insertProductAndCloseModal())
            .then(() => dispatch(handleFetchProduct()));
        } else {
          insertProductAndCloseModal();
        }
      });
  };
}

export function handleUpdateProduct(data) {
  return (dispatch, getState) => {
    const { dataSource, updateProductKey } = getState().productManage;
    const index = dataSource.findIndex(i => i.key === updateProductKey);
    const updateData = formatProductData(getState, {...data, createtime: dataSource[index].createtime}, true);
    return productManageApi.upsertProduct(data, EDIT.value)
      .then(() => {
        return Promise.all([dispatch(handleFetchProduct()), dispatch(handleQueryProductInfo())]);
      })
      .then(() => {
        dispatch(updateProduct(index, updateData));
        dispatch(handleModalClose());
      });
  };
}

export function handleEditProduct(key) {
  return (dispatch, getState) => {
    const product = getState().productManage.dataSource.find(i => i.key === key);
    dispatch(submitUpsertForm(product));
    dispatch(setUpdateProductKey(product.key));
    dispatch(changeFormMode(EDIT.value));
    dispatch(openUpsertFormModal());
  };
}

export function handleQueryProductInfo() {
  return dispatch => {
    return productManageApi
      .queryProductInfo()
      .then(data => dispatch(setProductInfo(data)));
  };
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PRODUCT:
      return {...state, loading: true};
    case FETCH_PRODUCT_SUCCESS:
      return {...state, loading: false, dataSource: action.dataSource};
    case FETCH_PRODUCT_FAIL:
      return {...state, loading: false, error: action.error};
    case SET_PAGE:
      return {...state, page: action.page};
    case SET_SELECTED_ROW_KEYS:
      return {...state, selectedRowKeys: action.keys};
    case STOP_PRODUCTS:
      return {...state, dataSource: transformStatus(STOP.value, state.dataSource, state.selectedRowKeys)};
    case START_PRODUCTS:
      return {...state, dataSource: transformStatus(START.value, state.dataSource, state.selectedRowKeys)};
    case DELETE_PRODUCT:
      return {...state, dataSource: state.dataSource.filter(item => item.key !== action.key)};
    case OPEN_UPSERT_FORM_MODAL:
      return {...state, upsertFormModalVisible: true};
    case CLOSE_UPSERT_FORM_MODAL:
      return {...state, upsertFormModalVisible: false};
    case SUBMIT_UPSERT_FORM:
      return {...state, upsertFormData: action.data};
    case SET_UPDATE_PRODUCT_KEY:
      return {...state, updateProductKey: action.updateProductKey};
    case SET_QUERY_STATUS:
      return {...state, queryStatus: action.status};
    case SET_QUERY_DATA:
      return {...state, queryData: action.data};
    case SET_PRODUCT_INFO:
      return {...state, productInfo: action.productInfo, productInfoFetched: true};
    case SET_TOTAL:
      return {...state, total: action.total};
    case INSERT_PRODUCT:
      return {...state, dataSource: [action.data, ...state.dataSource]};
    case CHANGE_FORM_MODE:
      return {...state, upsertFormMode: action.upsertFormMode};
    case UPDATE_PRODUCT: {
      const dataSource = state.dataSource;
      const index = action.index;
      return {...state, dataSource: [...dataSource.slice(0, index), action.data, ...dataSource.slice(index + 1)]};
    }
    default:
      return state;
  }
}

function formatProductData(getState, data, update = false) {
  const { brandlist, categoryList } = getState().productManage.productInfo;
  const { accountId } = getState().auth;
  const brand = brandlist.find(i => i.id === data.brandid);
  const cat = categoryList.find(i => i.catid=== data.category_id);
  const brandname = brand ? brand.brandname : data.brandname || ''; // if insert brand, data.brandname will have new brand value
  const catname = cat ? cat.catname : '';
  const date = moment().format('YYYY-MM-DD HH:mm:ss');
  return {...data, key: data.goodid, brandname, catname, createtime: update ? data.createtime : date, updatetime: date, status: START.value, creator: accountId};
}
