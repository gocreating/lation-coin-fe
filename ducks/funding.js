import { fromJS } from 'immutable'
import { API_HOST } from '../utils/config'

/**
 * Actions
 */
const GET_STATE_REQUEST = 'GET_STATE_REQUEST'
const GET_STATE_SUCCESS = 'GET_STATE_SUCCESS'
const GET_STATE_FAIL = 'GET_STATE_FAIL'

const GET_BITFINEX_WALLETS_REQUEST = 'GET_BITFINEX_WALLETS_REQUEST'
const GET_BITFINEX_WALLETS_SUCCESS = 'GET_BITFINEX_WALLETS_SUCCESS'
const GET_BITFINEX_WALLETS_FAIL = 'GET_BITFINEX_WALLETS_FAIL'

const GET_BITFINEX_FUNDING_OFFERS_REQUEST = 'GET_BITFINEX_FUNDING_OFFERS_REQUEST'
const GET_BITFINEX_FUNDING_OFFERS_SUCCESS = 'GET_BITFINEX_FUNDING_OFFERS_SUCCESS'
const GET_BITFINEX_FUNDING_OFFERS_FAIL = 'GET_BITFINEX_FUNDING_OFFERS_FAIL'

const GET_BITFINEX_FUNDING_CREDITS_REQUEST = 'GET_BITFINEX_FUNDING_CREDITS_REQUEST'
const GET_BITFINEX_FUNDING_CREDITS_SUCCESS = 'GET_BITFINEX_FUNDING_CREDITS_SUCCESS'
const GET_BITFINEX_FUNDING_CREDITS_FAIL = 'GET_BITFINEX_FUNDING_CREDITS_FAIL'

const CANCEL_BITFINEX_FUNDING_OFFER_REQUEST = 'CANCEL_BITFINEX_FUNDING_OFFER_REQUEST'
const CANCEL_BITFINEX_FUNDING_OFFER_SUCCESS = 'CANCEL_BITFINEX_FUNDING_OFFER_SUCCESS'
const CANCEL_BITFINEX_FUNDING_OFFER_FAIL = 'CANCEL_BITFINEX_FUNDING_OFFER_FAIL'

/**
 * Action Creators
 */
export const getStateRequest = () => ({
  type: GET_STATE_REQUEST,
})

export const getStateSuccess = (state) => ({
  type: GET_STATE_SUCCESS,
  payload: { state },
})

export const getStateFail = (error, res) => ({
  type: GET_STATE_FAIL,
  payload: { error, res },
})

export const getBitfinexWalletsRequest = () => ({
  type: GET_BITFINEX_WALLETS_REQUEST,
})

export const getBitfinexWalletsSuccess = (wallets) => ({
  type: GET_BITFINEX_WALLETS_SUCCESS,
  payload: { wallets },
})

export const getBitfinexWalletsFail = (error, res) => ({
  type: GET_BITFINEX_WALLETS_FAIL,
  payload: { error, res },
})

export const getBitfinexFundingOffersRequest = () => ({
  type: GET_BITFINEX_FUNDING_OFFERS_REQUEST,
})

export const getBitfinexFundingOffersSuccess = (fundingOffers) => ({
  type: GET_BITFINEX_FUNDING_OFFERS_SUCCESS,
  payload: { fundingOffers },
})

export const getBitfinexFundingOffersFail = (error, res) => ({
  type: GET_BITFINEX_FUNDING_OFFERS_FAIL,
  payload: { error, res },
})

export const getBitfinexFundingCreditsRequest = () => ({
  type: GET_BITFINEX_FUNDING_CREDITS_REQUEST,
})

export const getBitfinexFundingCreditsSuccess = (fundingCredits) => ({
  type: GET_BITFINEX_FUNDING_CREDITS_SUCCESS,
  payload: { fundingCredits },
})

export const getBitfinexFundingCreditsFail = (error, res) => ({
  type: GET_BITFINEX_FUNDING_CREDITS_FAIL,
  payload: { error, res },
})

export const cancelBitfinexFundingOfferRequest = (offerId) => ({
  type: CANCEL_BITFINEX_FUNDING_OFFER_REQUEST,
  payload: { offerId },
})

export const cancelBitfinexFundingOfferSuccess = (offerId) => ({
  type: CANCEL_BITFINEX_FUNDING_OFFER_SUCCESS,
  payload: { offerId },
})

export const cancelBitfinexFundingOfferFail = (error, res, offerId) => ({
  type: CANCEL_BITFINEX_FUNDING_OFFER_FAIL,
  payload: { error, res, offerId },
})

/**
 * Action Creators with Side Effects
 */
export const getState = () => async (dispatch) => {
  dispatch(getStateRequest())
  let res
  try {
    res = await fetch(`${API_HOST}/metrics/bitfinex`, { credentials: 'include' })
    if (res.status === 200) {
      const { data } = await res.json()
      dispatch(getStateSuccess(data))
    } else {
      dispatch(getStateFail(new Error('Fail to fetch state'), res))
    }
  } catch (err) {
    dispatch(getStateFail(err, res))
  }
}

export const getBitfinexWallets = () => async (dispatch) => {
  dispatch(getBitfinexWalletsRequest())
  let res
  try {
    res = await fetch(`${API_HOST}/wallets`, { credentials: 'include' })
    if (res.status === 200) {
      const { data } = await res.json()
      dispatch(getBitfinexWalletsSuccess(data))
    } else {
      dispatch(getBitfinexWalletsFail(new Error('Fail to fetch bitfinex wallet'), res))
    }
  } catch (err) {
    dispatch(getBitfinexWalletsFail(err, res))
  }
}

export const getBitfinexFundingOffers = (symbol) => async (dispatch) => {
  dispatch(getBitfinexFundingOffersRequest())
  let res
  try {
    res = await fetch(`${API_HOST}/funding/offers/${symbol}`, { credentials: 'include' })
    if (res.status === 200) {
      const { data } = await res.json()
      dispatch(getBitfinexFundingOffersSuccess(data))
    } else {
      dispatch(getBitfinexFundingOffersFail(new Error('Fail to fetch offers'), res))
    }
  } catch (err) {
    dispatch(getBitfinexFundingOffersFail(err, res))
  }
}

export const getBitfinexFundingCredits = (symbol) => async (dispatch) => {
  dispatch(getBitfinexFundingCreditsRequest())
  let res
  try {
    res = await fetch(`${API_HOST}/funding/credits/${symbol}`, { credentials: 'include' })
    if (res.status === 200) {
      const { data } = await res.json()
      dispatch(getBitfinexFundingCreditsSuccess(data))
    } else {
      dispatch(getBitfinexFundingCreditsFail(new Error('Fail to fetch funding credits'), res))
    }
  } catch (err) {
    dispatch(getBitfinexFundingCreditsFail(err, res))
  }
}

export const cancelBitfinexFundingOffer = (offerId) => async (dispatch) => {
  dispatch(cancelBitfinexFundingOfferRequest(offerId))
  let res
  try {
    res = await fetch(`${API_HOST}/funding/offers/${offerId}/cancel`, {
      method: 'POST',
      credentials: 'include',
    })
    if (res.status === 200) {
      await res.json()
      dispatch(cancelBitfinexFundingOfferSuccess(offerId))
    } else {
      dispatch(cancelBitfinexFundingOfferFail(new Error('Fail to cancel offer'), res, offerId))
    }
  } catch (err) {
    dispatch(cancelBitfinexFundingOfferFail(err, res, offerId))
  }
}

/**
 * Default State
 */
const defaultState = {
  getStateMeta: {
    isRequesting: false,
    isRequested: false,
    isRequestSuccess: false,
    isRequestFail: false,
  },
  getBitfinexWalletsMeta: {
    isRequesting: false,
    isRequested: false,
    isRequestSuccess: false,
    isRequestFail: false,
  },
  getBitfinexFundingOffersMeta: {
    isRequesting: false,
    isRequested: false,
    isRequestSuccess: false,
    isRequestFail: false,
  },
  getBitfinexFundingCreditsMeta: {
    isRequesting: false,
    isRequested: false,
    isRequestSuccess: false,
    isRequestFail: false,
  },
  cancelBitfinexFundingOfferMetaMap: {},
  state: {},
  bitfinex: {
    wallets: [],
    fundingOffers: [],
    fundingCredits: [],
  },
}

/**
 * Selectors
 */
export const selectors = {
  getState(state) {
    return fromJS(state.funding)
      .get('state')
      .toJS()
  },
  getGetStateMeta(state) {
    return fromJS(state.funding)
      .get('getStateMeta')
      .toJS()
  },
  getBitfinextWallets(state) {
    return fromJS(state.funding)
      .getIn(['bitfinex', 'wallets'])
      .toJS()
  },
  getGetBitfinexWalletsMeta(state) {
    return fromJS(state.funding)
      .get('getBitfinexWalletsMeta')
      .toJS()
  },
  getBitfinexFundingOffers(state) {
    return fromJS(state.funding)
      .getIn(['bitfinex', 'fundingOffers'])
      .toJS()
  },
  getGetBitfinexFundingOffersMeta(state) {
    return fromJS(state.funding)
      .get('getBitfinexFundingOffersMeta')
      .toJS()
  },
  getBitfinexFundingCredits(state) {
    return fromJS(state.funding)
      .getIn(['bitfinex', 'fundingCredits'])
      .toJS()
  },
  getGetBitfinexFundingCreditsMeta(state) {
    return fromJS(state.funding)
      .get('getBitfinexFundingCreditsMeta')
      .toJS()
  },
  getCancelBitfinexFundingOfferMetaMap(state) {
    return fromJS(state.funding)
      .get('cancelBitfinexFundingOfferMetaMap')
      .toJS()
  },
}

/**
 * Reducer
 */
const reducer = (state = defaultState, action) => {
  switch (action.type) {
    // get state
    case GET_STATE_REQUEST:
      return fromJS(state)
        .setIn(['getStateMeta', 'isRequesting'], true)
        .toJS()
    case GET_STATE_SUCCESS: {
      return fromJS(state)
        .setIn(['getStateMeta', 'isRequesting'], false)
        .setIn(['getStateMeta', 'isRequested'], true)
        .setIn(['getStateMeta', 'isRequestSuccess'], true)
        .setIn(['getStateMeta', 'isRequestFail'], false)
        .set('state', action.payload.state)
        .toJS()
    }
    case GET_STATE_FAIL:
      return fromJS(state)
        .setIn(['getStateMeta', 'isRequesting'], false)
        .setIn(['getStateMeta', 'isRequested'], true)
        .setIn(['getStateMeta', 'isRequestSuccess'], false)
        .setIn(['getStateMeta', 'isRequestFail'], true)
        .set('state', {})
        .toJS()

    // get wallets
    case GET_BITFINEX_WALLETS_REQUEST:
      return fromJS(state)
        .setIn(['getBitfinexWalletsMeta', 'isRequesting'], true)
        .toJS()
    case GET_BITFINEX_WALLETS_SUCCESS: {
      const { wallets } = action.payload
      return fromJS(state)
        .setIn(['getBitfinexWalletsMeta', 'isRequesting'], false)
        .setIn(['getBitfinexWalletsMeta', 'isRequested'], true)
        .setIn(['getBitfinexWalletsMeta', 'isRequestSuccess'], true)
        .setIn(['getBitfinexWalletsMeta', 'isRequestFail'], false)
        .setIn(['bitfinex', 'wallets'], wallets)
        .toJS()
    }
    case GET_BITFINEX_WALLETS_FAIL:
      return fromJS(state)
        .setIn(['getBitfinexWalletsMeta', 'isRequesting'], false)
        .setIn(['getBitfinexWalletsMeta', 'isRequested'], true)
        .setIn(['getBitfinexWalletsMeta', 'isRequestSuccess'], false)
        .setIn(['getBitfinexWalletsMeta', 'isRequestFail'], true)
        .setIn(['bitfinex','wallets'], [])
        .toJS()

    // get offers
    case GET_BITFINEX_FUNDING_OFFERS_REQUEST:
      return fromJS(state)
        .setIn(['getBitfinexFundingOffersMeta', 'isRequesting'], true)
        .toJS()
    case GET_BITFINEX_FUNDING_OFFERS_SUCCESS: {
      const { fundingOffers } = action.payload
      return fromJS(state)
        .setIn(['getBitfinexFundingOffersMeta', 'isRequesting'], false)
        .setIn(['getBitfinexFundingOffersMeta', 'isRequested'], true)
        .setIn(['getBitfinexFundingOffersMeta', 'isRequestSuccess'], true)
        .setIn(['getBitfinexFundingOffersMeta', 'isRequestFail'], false)
        .setIn(['bitfinex', 'fundingOffers'], fundingOffers)
        .toJS()
    }
    case GET_BITFINEX_FUNDING_OFFERS_FAIL:
      return fromJS(state)
        .setIn(['getBitfinexFundingOffersMeta', 'isRequesting'], false)
        .setIn(['getBitfinexFundingOffersMeta', 'isRequested'], true)
        .setIn(['getBitfinexFundingOffersMeta', 'isRequestSuccess'], false)
        .setIn(['getBitfinexFundingOffersMeta', 'isRequestFail'], true)
        .setIn(['bitfinex', 'fundingOffers'], [])
        .toJS()

    // get credits
    case GET_BITFINEX_FUNDING_CREDITS_REQUEST:
      return fromJS(state)
        .setIn(['getBitfinexFundingCreditsMeta', 'isRequesting'], true)
        .toJS()
    case GET_BITFINEX_FUNDING_CREDITS_SUCCESS: {
      const { fundingCredits } = action.payload
      return fromJS(state)
        .setIn(['getBitfinexFundingCreditsMeta', 'isRequesting'], false)
        .setIn(['getBitfinexFundingCreditsMeta', 'isRequested'], true)
        .setIn(['getBitfinexFundingCreditsMeta', 'isRequestSuccess'], true)
        .setIn(['getBitfinexFundingCreditsMeta', 'isRequestFail'], false)
        .setIn(['bitfinex', 'fundingCredits'], fundingCredits)
        .toJS()
    }
    case GET_BITFINEX_FUNDING_CREDITS_FAIL:
      return fromJS(state)
        .setIn(['getBitfinexFundingCreditsMeta', 'isRequesting'], false)
        .setIn(['getBitfinexFundingCreditsMeta', 'isRequested'], true)
        .setIn(['getBitfinexFundingCreditsMeta', 'isRequestSuccess'], false)
        .setIn(['getBitfinexFundingCreditsMeta', 'isRequestFail'], true)
        .setIn(['bitfinex', 'fundingCredits'], [])
        .toJS()

    // cancel offer
    case CANCEL_BITFINEX_FUNDING_OFFER_REQUEST: {
      const { offerId } = action.payload
      return fromJS(state)
        .setIn(['cancelBitfinexFundingOfferMetaMap', offerId, 'isRequesting'], true)
        .toJS()
    }
    case CANCEL_BITFINEX_FUNDING_OFFER_SUCCESS: {
      const { offerId } = action.payload
      const offers = state.bitfinex.fundingOffers.filter(offer => offer.id !== offerId)
      return fromJS(state)
        .setIn(['cancelBitfinexFundingOfferMetaMap', offerId, 'isRequesting'], false)
        .setIn(['cancelBitfinexFundingOfferMetaMap', offerId, 'isRequested'], true)
        .setIn(['cancelBitfinexFundingOfferMetaMap', offerId, 'isRequestSuccess'], true)
        .setIn(['cancelBitfinexFundingOfferMetaMap', offerId, 'isRequestFail'], false)
        .setIn(['bitfinex', 'fundingOffers'], offers)
        .toJS()
    }
    case CANCEL_BITFINEX_FUNDING_OFFER_FAIL: {
      const { offerId } = action.payload
      return fromJS(state)
        .setIn(['cancelBitfinexFundingOfferMetaMap', offerId, 'isRequesting'], false)
        .setIn(['cancelBitfinexFundingOfferMetaMap', offerId, 'isRequested'], true)
        .setIn(['cancelBitfinexFundingOfferMetaMap', offerId, 'isRequestSuccess'], false)
        .setIn(['cancelBitfinexFundingOfferMetaMap', offerId, 'isRequestFail'], true)
        .toJS()
    }

    default:
      return state
  }
}

export default reducer
