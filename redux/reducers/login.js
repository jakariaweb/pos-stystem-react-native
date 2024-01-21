import {LOGIN} from '../constants'

function login(state = {}, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        loginData: action.loginData,
      }
    default:
      return state
  }
}
export default login
