import { fromJS } from 'immutable'
import { API_HOST } from '../utils/config'

/**
 * Actions
 */
const LIST_ORDERS_REQUEST = 'LIST_ORDERS_REQUEST'
const LIST_ORDERS_SUCCESS = 'LIST_ORDERS_SUCCESS'
const LIST_ORDERS_FAIL = 'LIST_ORDERS_FAIL'

const CREATE_ORDER_REQUEST = 'CREATE_ORDER_REQUEST'
const CREATE_ORDER_SUCCESS = 'CREATE_ORDER_SUCCESS'
const CREATE_ORDER_FAIL = 'CREATE_ORDER_FAIL'

const SET_ORDERS = 'SET_ORDERS'

/**
 * Action Creators
 */
export const createOrderRequest = () => ({
  type: CREATE_ORDER_REQUEST,
})

export const createOrderSuccess = (res) => ({
  type: CREATE_ORDER_SUCCESS,
  payload: { res },
})

export const createOrderFail = (error, res) => ({
  type: CREATE_ORDER_FAIL,
  payload: { error, res },
})

export const listOrdersRequest = () => ({
  type: LIST_ORDERS_REQUEST,
})

export const listOrdersSuccess = (res) => ({
  type: LIST_ORDERS_SUCCESS,
  payload: { res },
})

export const listOrdersFail = (error, res) => ({
  type: LIST_ORDERS_FAIL,
  payload: { error, res },
})

export const setOrders = (orders) => ({
  type: SET_ORDERS,
  payload: { orders },
})

/**
 * Action Creators with Side Effects
 */
export const listOrders = (onSuccess, onFail) => async (dispatch) => {
  dispatch(listOrdersRequest())
  let res
  try {
    res = await fetch(`${API_HOST}/orders`, { credentials: 'include' })
    if (res.status === 200) {
      const { data } = await res.json()
      dispatch(setOrders(data))
      dispatch(listOrdersSuccess(res))
      onSuccess && onSuccess()
    } else {
      dispatch(listOrdersFail(new Error('Fail to fetch orders'), res))
      onFail && onFail()
    }
  } catch (err) {
    dispatch(listOrdersFail(err, res))
    onFail && onFail()
  }
}

export const createOrder = (planId, onSuccess, onFail) => async (dispatch) => {
  dispatch(createOrderRequest());
  let res
  try {
    res = await fetch(`${API_HOST}/orders`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan_id: planId })
    })
    if (res.status === 200) {
      const { data } = await res.json()
      dispatch(createOrderSuccess(res))
      onSuccess && onSuccess(data)
    } else {
      dispatch(createOrderFail(new Error('Fail to create order'), res))
      onFail && onFail(res)
    }
  } catch (err) {
    dispatch(createOrderFail(err, res))
    onFail && onFail(res)
  }
}

/**
 * Default State
 */
const defaultState = {
  listOrdersMeta: {
    isRequesting: false,
    isRequested: false,
    isRequestSuccess: false,
    isRequestFail: false,
  },
  createOrderMeta: {
    isRequesting: false,
    isRequested: false,
    isRequestSuccess: false,
    isRequestFail: false,
  },
  orders: [],
}

/**
 * Selectors
 */
export const selectors = {
  getOrders(state) {
    return fromJS(state.order)
      .get('orders')
      .toJS()
  },
  getListOrdersMeta(state) {
    return fromJS(state.order)
      .get('listOrdersMeta')
      .toJS()
  },
  getCreateOrderMeta(state) {
    return fromJS(state.order)
      .get('createOrderMeta')
      .toJS()
  },
}

/**
 * Reducer
 */
const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case LIST_ORDERS_REQUEST:
      return fromJS(state)
        .setIn(['listOrdersMeta', 'isRequesting'], true)
        .toJS()
    case LIST_ORDERS_SUCCESS:
      return fromJS(state)
        .setIn(['listOrdersMeta', 'isRequesting'], false)
        .setIn(['listOrdersMeta', 'isRequested'], true)
        .setIn(['listOrdersMeta', 'isRequestSuccess'], true)
        .setIn(['listOrdersMeta', 'isRequestFail'], false)
        .toJS()
    case LIST_ORDERS_FAIL:
      return fromJS(state)
        .setIn(['listOrdersMeta', 'isRequesting'], false)
        .setIn(['listOrdersMeta', 'isRequested'], true)
        .setIn(['listOrdersMeta', 'isRequestSuccess'], false)
        .setIn(['listOrdersMeta', 'isRequestFail'], true)
        .toJS()
    case SET_ORDERS: {
      const { orders } = action.payload
      return fromJS(state)
        .set('orders', orders)
        .toJS()
    }
    case CREATE_ORDER_REQUEST:
      return fromJS(state)
        .setIn(['createOrderMeta', 'isRequesting'], true)
        .toJS()
    case CREATE_ORDER_SUCCESS:
      return fromJS(state)
        .setIn(['createOrderMeta', 'isRequesting'], false)
        .setIn(['createOrderMeta', 'isRequested'], true)
        .setIn(['createOrderMeta', 'isRequestSuccess'], true)
        .setIn(['createOrderMeta', 'isRequestFail'], false)
        .toJS()
    case CREATE_ORDER_FAIL:
      return fromJS(state)
        .setIn(['createOrderMeta', 'isRequesting'], false)
        .setIn(['createOrderMeta', 'isRequested'], true)
        .setIn(['createOrderMeta', 'isRequestSuccess'], false)
        .setIn(['createOrderMeta', 'isRequestFail'], true)
        .toJS()
    default:
      return state
  }
}

export default reducer
