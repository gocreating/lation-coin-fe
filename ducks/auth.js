import { fromJS } from 'immutable'
import { API_HOST } from '../utils/config'

/**
 * Actions
 */
const GET_USER_REQUEST = 'GET_USER_REQUEST'
const GET_USER_SUCCESS = 'GET_USER_SUCCESS'
const GET_USER_FAIL = 'GET_USER_FAIL'

const LOGOUT_REQUEST = 'LOGOUT_REQUEST'
const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'
const LOGOUT_FAIL = 'LOGOUT_FAIL'

const SET_AUTH = 'SET_AUTH'
const CLEAR_AUTH = 'CLEAR_AUTH'

/**
 * Action Creators
 */
export const getUserRequest = () => ({
  type: GET_USER_REQUEST,
});

export const getUserSuccess = (res) => ({
  type: GET_USER_SUCCESS,
  payload: { res },
});

export const getUserFail = (error, res) => ({
  type: GET_USER_FAIL,
  payload: { error, res },
});

export const logoutRequest = () => ({
  type: LOGOUT_REQUEST,
});

export const logoutSuccess = (res) => ({
  type: LOGOUT_SUCCESS,
  payload: { res },
});

export const logoutFail = (error, res) => ({
  type: LOGOUT_FAIL,
  payload: { error, res },
});

export const setAuth = (user) => ({
  type: SET_AUTH,
  payload: { user },
});

export const clearAuth = () => ({
  type: CLEAR_AUTH,
});

/**
 * Action Creators with Side Effects
 */
export const getUser = (onSuccess, onFail) => async (dispatch) => {
  dispatch(getUserRequest());
  let res
  try {
    res = await fetch(`${API_HOST}/me`, { credentials: 'include' })
    if (res.status === 200) {
      const { data } = await res.json()
      dispatch(setAuth(data))
      dispatch(getUserSuccess(res))
      onSuccess && onSuccess()
    } else {
      dispatch(getUserFail(new Error('Fail to fetch user information'), res))
      onFail && onFail()
    }
  } catch (err) {
    dispatch(getUserFail(err, res))
    onFail && onFail()
  }
}

export const logout = () => async (dispatch) => {
  dispatch(logoutRequest())
  let res
  try {
    res = await fetch(`${API_HOST}/logout`, { method: 'POST', credentials: 'include' })
    dispatch(logoutSuccess(res))
  } catch (err) {
    dispatch(logoutFail(err, res))
  }
  dispatch(clearAuth())
};

/**
 * Default State
 */
const defaultState = {
  getUserMeta: {
    isRequesting: false,
    isRequested: false,
    isRequestSuccess: false,
    isRequestFail: false,
  },
  logoutMeta: {
    isRequesting: false,
    isRequested: false,
    isRequestSuccess: false,
    isRequestFail: false,
  },
  authUserId: null,
  users: {},
}

/**
 * Selectors
 */
export const selectors = {
  getUserId(state) {
    const authUserId = fromJS(state.auth)
      .get('authUserId')
    return authUserId ? `${authUserId}` : null
  },
  getUser(state) {
    const authUserId = selectors.getUserId(state)
    return fromJS(state.auth)
      .getIn(['users', authUserId], fromJS({}))
      .toJS()
  },
  getIsAuth(state) {
    const authUserId = selectors.getUserId(state);
    return Boolean(authUserId);
  },
}

/**
 * Reducer
 */
const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case GET_USER_REQUEST:
      return fromJS(state)
        .setIn(['getUserMeta', 'isRequesting'], true)
        .toJS()
    case GET_USER_SUCCESS:
      return fromJS(state)
        .setIn(['getUserMeta', 'isRequesting'], false)
        .setIn(['getUserMeta', 'isRequested'], true)
        .setIn(['getUserMeta', 'isRequestSuccess'], true)
        .setIn(['getUserMeta', 'isRequestFail'], false)
        .toJS()
    case GET_USER_FAIL:
      return fromJS(state)
        .setIn(['getUserMeta', 'isRequesting'], false)
        .setIn(['getUserMeta', 'isRequested'], true)
        .setIn(['getUserMeta', 'isRequestSuccess'], false)
        .setIn(['getUserMeta', 'isRequestFail'], true)
        .toJS()
    case LOGOUT_REQUEST:
      return fromJS(state)
        .setIn(['logoutMeta', 'isRequesting'], true)
        .toJS()
    case LOGOUT_SUCCESS:
      return fromJS(state)
        .setIn(['logoutMeta', 'isRequesting'], false)
        .setIn(['logoutMeta', 'isRequested'], true)
        .setIn(['logoutMeta', 'isRequestSuccess'], true)
        .setIn(['logoutMeta', 'isRequestFail'], false)
        .toJS()
    case LOGOUT_FAIL:
      return fromJS(state)
        .setIn(['logoutMeta', 'isRequesting'], false)
        .setIn(['logoutMeta', 'isRequested'], true)
        .setIn(['logoutMeta', 'isRequestSuccess'], false)
        .setIn(['logoutMeta', 'isRequestFail'], true)
        .toJS()
    case SET_AUTH: {
      const { user } = action.payload
      const userId = user.id
      return fromJS(state)
        .set('authUserId', userId)
        .setIn(['users', userId], {
          ...user,
        })
        .toJS()
    }
    case CLEAR_AUTH:
      return defaultState
    default:
      return state
  }
}

export default reducer
