import { fromJS } from 'immutable';
import { API_HOST } from '../utils/config'

/**
 * Actions
 */
const GET_USER_BITFINEX_CONFIG_REQUEST = 'GET_USER_BITFINEX_CONFIG_REQUEST'
const GET_USER_BITFINEX_CONFIG_SUCCESS = 'GET_USER_BITFINEX_CONFIG_SUCCESS'
const GET_USER_BITFINEX_CONFIG_FAIL = 'GET_USER_BITFINEX_CONFIG_FAIL'

const UPDATE_USER_BITFINEX_CONFIG_REQUEST = 'UPDATE_USER_BITFINEX_CONFIG_REQUEST'
const UPDATE_USER_BITFINEX_CONFIG_SUCCESS = 'UPDATE_USER_BITFINEX_CONFIG_SUCCESS'
const UPDATE_USER_BITFINEX_CONFIG_FAIL = 'UPDATE_USER_BITFINEX_CONFIG_FAIL'

/**
 * Action Creators
 */
export const getUserBitfinexConfigRequest = () => ({
  type: GET_USER_BITFINEX_CONFIG_REQUEST,
})

export const getUserBitfinexConfigSuccess = (config) => ({
  type: GET_USER_BITFINEX_CONFIG_SUCCESS,
  payload: { config },
})

export const getUserBitfinexConfigFail = (error, res) => ({
  type: GET_USER_BITFINEX_CONFIG_FAIL,
  payload: { error, res },
})

export const udpateUserBitfinexConfigRequest = () => ({
  type: UPDATE_USER_BITFINEX_CONFIG_REQUEST,
})

export const udpateUserBitfinexConfigSuccess = (res) => ({
  type: UPDATE_USER_BITFINEX_CONFIG_SUCCESS,
  payload: { res },
})

export const udpateUserBitfinexConfigFail = (error, res) => ({
  type: UPDATE_USER_BITFINEX_CONFIG_FAIL,
  payload: { error, res },
})

/**
 * Action Creators with Side Effects
 */
export const getUserBitfinexConfig = (onSuccess) => async (dispatch) => {
  dispatch(getUserBitfinexConfigRequest())
  let res
  try {
    res = await fetch(`${API_HOST}/configs/bitfinex`, { credentials: 'include' })
    if (res.status === 200) {
      const { data } = await res.json()
      dispatch(getUserBitfinexConfigSuccess(data))
      onSuccess && onSuccess(data)
    } else {
      dispatch(getUserBitfinexConfigFail(new Error('Fail to fetch user configs'), res))
    }
  } catch (err) {
    dispatch(getUserBitfinexConfigFail(err, res))
  }
}

export const updateUserBitfinexConfig = (configs, onSuccess) => async (dispatch) => {
  dispatch(udpateUserBitfinexConfigRequest())
  let res
  try {
    res = await fetch(`${API_HOST}/configs/bitfinex`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(configs),
    })
    if (res.status === 200) {
      dispatch(udpateUserBitfinexConfigSuccess(res))
      onSuccess && onSuccess()
    } else {
      const result = await res.json()
      dispatch(udpateUserBitfinexConfigFail(result.detail || 'Fail to update user configs', res))
    }
  } catch (err) {
    dispatch(udpateUserBitfinexConfigFail(err, res))
  }
}

/**
 * Default State
 */
const defaultState = {
  getUserBitfinexConfigMeta: {
    isRequesting: false,
    isRequested: false,
    isRequestSuccess: false,
    isRequestFail: false,
  },
  updateUserBitfinexConfigMeta: {
    isRequesting: false,
    isRequested: false,
    isRequestSuccess: false,
    isRequestFail: false,
  },
  configs: {
    bitfinex: {},
  },
};

/**
 * Selectors
 */
export const selectors = {
  getBitfinexConfig(state) {
    return fromJS(state.user)
      .getIn(['configs', 'bitfinex'])
      .toJS()
  },
  getGetBitfinexConfigMeta(state) {
    return fromJS(state.user)
      .get('getUserBitfinexConfigMeta')
      .toJS()
  },
  getUpdateBitfinexConfigMeta(state) {
    return fromJS(state.user)
      .get('updateUserBitfinexConfigMeta')
      .toJS()
  },
}

/**
 * Reducer
 */
const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case GET_USER_BITFINEX_CONFIG_REQUEST:
      return fromJS(state)
        .setIn(['getUserBitfinexConfigMeta', 'isRequesting'], true)
        .toJS()
    case GET_USER_BITFINEX_CONFIG_SUCCESS: {
      const { config } = action.payload
      return fromJS(state)
        .setIn(['getUserBitfinexConfigMeta', 'isRequesting'], false)
        .setIn(['getUserBitfinexConfigMeta', 'isRequested'], true)
        .setIn(['getUserBitfinexConfigMeta', 'isRequestSuccess'], true)
        .setIn(['getUserBitfinexConfigMeta', 'isRequestFail'], false)
        .setIn(['configs', 'bitfinex'], config)
        .toJS()
    }
    case GET_USER_BITFINEX_CONFIG_FAIL:
      return fromJS(state)
        .setIn(['getUserBitfinexConfigMeta', 'isRequesting'], false)
        .setIn(['getUserBitfinexConfigMeta', 'isRequested'], true)
        .setIn(['getUserBitfinexConfigMeta', 'isRequestSuccess'], false)
        .setIn(['getUserBitfinexConfigMeta', 'isRequestFail'], true)
        .toJS()

    case UPDATE_USER_BITFINEX_CONFIG_REQUEST:
      return fromJS(state)
        .setIn(['updateUserBitfinexConfigMeta', 'isRequesting'], true)
        .toJS()
    case UPDATE_USER_BITFINEX_CONFIG_SUCCESS: {
      const { config } = action.payload;
      return fromJS(state)
        .setIn(['updateUserBitfinexConfigMeta', 'isRequesting'], false)
        .setIn(['updateUserBitfinexConfigMeta', 'isRequested'], true)
        .setIn(['updateUserBitfinexConfigMeta', 'isRequestSuccess'], true)
        .setIn(['updateUserBitfinexConfigMeta', 'isRequestFail'], false)
        .setIn(['configs', 'bitfinex'], config)
        .toJS()
    }
    case UPDATE_USER_BITFINEX_CONFIG_FAIL: {
      const { error } = action.payload
      return fromJS(state)
        .setIn(['updateUserBitfinexConfigMeta', 'isRequesting'], false)
        .setIn(['updateUserBitfinexConfigMeta', 'isRequested'], true)
        .setIn(['updateUserBitfinexConfigMeta', 'isRequestSuccess'], false)
        .setIn(['updateUserBitfinexConfigMeta', 'isRequestFail'], true)
        .setIn(['updateUserBitfinexConfigMeta', 'error'], error)
        .toJS()
    }
    default:
      return state
  }
}

export default reducer
