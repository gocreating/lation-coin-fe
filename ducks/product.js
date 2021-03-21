import { fromJS } from 'immutable'
import { API_HOST } from '../utils/config'

/**
 * Actions
 */
const LIST_PRODUCTS_REQUEST = 'LIST_PRODUCTS_REQUEST'
const LIST_PRODUCTS_SUCCESS = 'LIST_PRODUCTS_SUCCESS'
const LIST_PRODUCTS_FAIL = 'LIST_PRODUCTS_FAIL'

const SET_PRODUCTS = 'SET_PRODUCTS'

const LIST_SUBSCRIPTIONS_REQUEST = 'LIST_SUBSCRIPTIONS_REQUEST'
const LIST_SUBSCRIPTIONS_SUCCESS = 'LIST_SUBSCRIPTIONS_SUCCESS'
const LIST_SUBSCRIPTIONS_FAIL = 'LIST_SUBSCRIPTIONS_FAIL'

const SET_SUBSCRIPTIONS = 'SET_SUBSCRIPTIONS'

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

export const listSubscriptionsRequest = () => ({
  type: LIST_SUBSCRIPTIONS_REQUEST,
})

export const listSubscriptionsSuccess = (res) => ({
  type: LIST_SUBSCRIPTIONS_SUCCESS,
  payload: { res },
})

export const listSubscriptionsFail = (error, res) => ({
  type: LIST_SUBSCRIPTIONS_FAIL,
  payload: { error, res },
})

export const setSubscriptions = (subscriptions) => ({
  type: SET_SUBSCRIPTIONS,
  payload: { subscriptions },
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

export const listSubscriptions = (onSuccess, onFail) => async (dispatch) => {
  dispatch(listSubscriptionsRequest())
  let res
  try {
    res = await fetch(`${API_HOST}/subscriptions`, { credentials: 'include' })
    if (res.status === 200) {
      const { data } = await res.json()
      dispatch(setSubscriptions(data))
      dispatch(listSubscriptionsSuccess(res))
      onSuccess && onSuccess()
    } else {
      dispatch(listSubscriptionsFail(new Error('Fail to fetch subscriptions'), res))
      onFail && onFail()
    }
  } catch (err) {
    dispatch(listSubscriptionsFail(err, res))
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
  listSubscriptionsMeta: {
    isRequesting: false,
    isRequested: false,
    isRequestSuccess: false,
    isRequestFail: false,
  },
  products: [],
  subscriptions: [],
}

/**
 * Selectors
 */
export const selectors = {
  getListProductsMeta(state) {
    return fromJS(state.product)
      .get('listProductsMeta')
      .toJS()
  },
  getProducts(state) {
    return fromJS(state.product)
      .get('products')
      .toJS()
  },
  getListSubscriptionsMeta(state) {
    return fromJS(state.product)
      .get('listSubscriptionsMeta')
      .toJS()
  },
  getSubscriptions(state) {
    return fromJS(state.product)
      .get('subscriptions')
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
    case LIST_SUBSCRIPTIONS_REQUEST:
      return fromJS(state)
        .setIn(['listSubscriptionsMeta', 'isRequesting'], true)
        .toJS()
    case LIST_SUBSCRIPTIONS_SUCCESS:
      return fromJS(state)
        .setIn(['listSubscriptionsMeta', 'isRequesting'], false)
        .setIn(['listSubscriptionsMeta', 'isRequested'], true)
        .setIn(['listSubscriptionsMeta', 'isRequestSuccess'], true)
        .setIn(['listSubscriptionsMeta', 'isRequestFail'], false)
        .toJS()
    case LIST_SUBSCRIPTIONS_FAIL:
      return fromJS(state)
        .setIn(['listSubscriptionsMeta', 'isRequesting'], false)
        .setIn(['listSubscriptionsMeta', 'isRequested'], true)
        .setIn(['listSubscriptionsMeta', 'isRequestSuccess'], false)
        .setIn(['listSubscriptionsMeta', 'isRequestFail'], true)
        .toJS()
    case SET_SUBSCRIPTIONS: {
      const { subscriptions } = action.payload
      return fromJS(state)
        .set('subscriptions', subscriptions)
        .toJS()
    }
    default:
      return state
  }
}

export default reducer
