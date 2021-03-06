import { fromJS } from 'immutable'
import { API_HOST } from '../utils/config'

/**
 * Actions
 */
const GET_BITFINEX_INTEREST_PAYMENTS_REQUEST = 'GET_BITFINEX_INTEREST_PAYMENTS_REQUEST'
const GET_BITFINEX_INTEREST_PAYMENTS_SUCCESS = 'GET_BITFINEX_INTEREST_PAYMENTS_SUCCESS'
const GET_BITFINEX_INTEREST_PAYMENTS_FAIL = 'GET_BITFINEX_INTEREST_PAYMENTS_FAIL'

/**
 * Action Creators
 */
export const getBitfinexInterestPaymentsRequest = () => ({
  type: GET_BITFINEX_INTEREST_PAYMENTS_REQUEST,
})

export const getBitfinexInterestPaymentsSuccess = (interestPayments) => ({
  type: GET_BITFINEX_INTEREST_PAYMENTS_SUCCESS,
  payload: { interestPayments },
})

export const getBitfinexInterestPaymentsFail = (error, res) => ({
  type: GET_BITFINEX_INTEREST_PAYMENTS_FAIL,
  payload: { error, res },
})

/**
 * Action Creators with Side Effects
 */
export const getBitfinexInterestPayments = (currency) => async (dispatch) => {
  dispatch(getBitfinexInterestPaymentsRequest())
  let res
  try {
    res = await fetch(`${API_HOST}/ledgers/${currency}/30-day-interest-payments`, { credentials: 'include' })
    if (res.status === 200) {
      const { data } = await res.json()
      dispatch(getBitfinexInterestPaymentsSuccess(data))
    } else {
      dispatch(getBitfinexInterestPaymentsFail(new Error('Fail to fetch BitfinexInterestPayments'), res))
    }
  } catch (err) {
    dispatch(getBitfinexInterestPaymentsFail(err, res))
  }
};

/**
 * Default State
 */
const defaultState = {
  getBitfinexInterestPaymentsMeta: {
    isRequesting: false,
    isRequested: false,
    isRequestSuccess: false,
    isRequestFail: false,
  },
  bitfinex: {
    interestPayments: [],
  },
}

/**
 * Selectors
 */
export const selectors = {
  getBitfinexInterestPayments(state) {
    return fromJS(state.report)
      .getIn(['bitfinex', 'interestPayments'])
      .toJS()
  },
  getGetBitfinexInterestPaymentsMeta(state) {
    return fromJS(state.report)
      .get('getBitfinexInterestPaymentsMeta')
      .toJS()
  },
}

/**
 * Reducer
 */
const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case GET_BITFINEX_INTEREST_PAYMENTS_REQUEST:
      return fromJS(state)
        .setIn(['getBitfinexInterestPaymentsMeta', 'isRequesting'], true)
        .toJS()
    case GET_BITFINEX_INTEREST_PAYMENTS_SUCCESS: {
      const { interestPayments } = action.payload;
      return fromJS(state)
        .setIn(['getBitfinexInterestPaymentsMeta', 'isRequesting'], false)
        .setIn(['getBitfinexInterestPaymentsMeta', 'isRequested'], true)
        .setIn(['getBitfinexInterestPaymentsMeta', 'isRequestSuccess'], true)
        .setIn(['getBitfinexInterestPaymentsMeta', 'isRequestFail'], false)
        .setIn(['bitfinex', 'interestPayments'], interestPayments)
        .toJS()
    }
    case GET_BITFINEX_INTEREST_PAYMENTS_FAIL:
      return fromJS(state)
        .setIn(['getBitfinexInterestPaymentsMeta', 'isRequesting'], false)
        .setIn(['getBitfinexInterestPaymentsMeta', 'isRequested'], true)
        .setIn(['getBitfinexInterestPaymentsMeta', 'isRequestSuccess'], false)
        .setIn(['getBitfinexInterestPaymentsMeta', 'isRequestFail'], true)
        .setIn(['bitfinex', 'interestPayments'], [])
        .toJS()

    default:
      return state
  }
}

export default reducer
