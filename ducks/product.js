import { fromJS } from 'immutable'
import { API_HOST } from '../utils/config'

/**
 * Actions
 */
const LIST_PRODUCTS_REQUEST = 'LIST_PRODUCTS_REQUEST'
const LIST_PRODUCTS_SUCCESS = 'LIST_PRODUCTS_SUCCESS'
const LIST_PRODUCTS_FAIL = 'LIST_PRODUCTS_FAIL'

const SET_PRODUCTS = 'SET_PRODUCTS'

/**
 * Action Creators
 */
export const listProductsRequest = () => ({
  type: LIST_PRODUCTS_REQUEST,
})

export const listProductsSuccess = (res) => ({
  type: LIST_PRODUCTS_SUCCESS,
  payload: { res },
})

export const listProductsFail = (error, res) => ({
  type: LIST_PRODUCTS_FAIL,
  payload: { error, res },
})

export const setProducts = (products) => ({
  type: SET_PRODUCTS,
  payload: { products },
})

/**
 * Action Creators with Side Effects
 */
export const listProducts = (onSuccess, onFail) => async (dispatch) => {
  dispatch(listProductsRequest())
  let res
  try {
    res = await fetch(`${API_HOST}/products`)
    if (res.status === 200) {
      const { data } = await res.json()
      dispatch(setProducts(data))
      dispatch(listProductsSuccess(res))
      onSuccess && onSuccess()
    } else {
      dispatch(listProductsFail(new Error('Fail to fetch products'), res))
      onFail && onFail()
    }
  } catch (err) {
    dispatch(listProductsFail(err, res))
    onFail && onFail()
  }
}

/**
 * Default State
 */
const defaultState = {
  listProductsMeta: {
    isRequesting: false,
    isRequested: false,
    isRequestSuccess: false,
    isRequestFail: false,
  },
  products: [],
}

/**
 * Selectors
 */
export const selectors = {
  getProducts(state) {
    return fromJS(state.product)
      .get('products')
      .toJS()
  },
}

/**
 * Reducer
 */
const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case LIST_PRODUCTS_REQUEST:
      return fromJS(state)
        .setIn(['listProductsMeta', 'isRequesting'], true)
        .toJS()
    case LIST_PRODUCTS_SUCCESS:
      return fromJS(state)
        .setIn(['listProductsMeta', 'isRequesting'], false)
        .setIn(['listProductsMeta', 'isRequested'], true)
        .setIn(['listProductsMeta', 'isRequestSuccess'], true)
        .setIn(['listProductsMeta', 'isRequestFail'], false)
        .toJS()
    case LIST_PRODUCTS_FAIL:
      return fromJS(state)
        .setIn(['listProductsMeta', 'isRequesting'], false)
        .setIn(['listProductsMeta', 'isRequested'], true)
        .setIn(['listProductsMeta', 'isRequestSuccess'], false)
        .setIn(['listProductsMeta', 'isRequestFail'], true)
        .toJS()
    case SET_PRODUCTS: {
      const { products } = action.payload
      return fromJS(state)
        .set('products', products.filter(p => p.plans.length > 0))
        .toJS()
    }
    default:
      return state
  }
}

export default reducer
