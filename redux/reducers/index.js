import {combineReducers} from 'redux'
import login from './login'
import cartReducer from './cart'

const rootReducer = combineReducers({
  login,
  cart: cartReducer,
})

export default rootReducer
