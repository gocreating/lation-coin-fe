import { createWrapper, HYDRATE } from 'next-redux-wrapper'
import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import authReducer from './ducks/auth'
import fundingReducer from './ducks/funding'
import orderReducer from './ducks/order'
import productReducer from './ducks/product'
import reportReducer from './ducks/report'
import userReducer from './ducks/user'

const appReducer = combineReducers({
  auth: authReducer,
  funding: fundingReducer,
  order: orderReducer,
  product: productReducer,
  report: reportReducer,
  user: userReducer,
})

const rootReducer = (state = {}, action) => {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload }
    default:
      return appReducer(state, action)
  }
}

const makeStore = context => {
  let middlewares;
  if (process.env.NODE_ENV !== 'production' && process.browser) {
    const logger = createLogger({
      diff: true,
      collapsed: true,
    })
    middlewares = [
      thunk,
      logger,
    ]
  } else {
    middlewares = [
      thunk,
    ]
  }
  const enhancer = compose(applyMiddleware(...middlewares))
  const store = createStore(rootReducer, enhancer)
  return store
}

export const wrapper = createWrapper(makeStore, { debug: false })
