import { createWrapper, HYDRATE } from 'next-redux-wrapper'
import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import authReducer from './ducks/auth'
import productReducer from './ducks/product'
import socialReducer from './ducks/social'

const appReducer = combineReducers({
  auth: authReducer,
  product: productReducer,
  social: socialReducer,
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
