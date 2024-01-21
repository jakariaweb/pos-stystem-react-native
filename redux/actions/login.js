import {LOGIN} from '../constants'

export function login(loginData) {
  return dispatch => {
    dispatch({
      type: LOGIN,
      loginData,
    })
  }
}
