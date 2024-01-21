import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import {baseUrl} from './baseUrl'
import catchErrors from './catchErrors'

export const userLogin = async (data, setError) => {
  try {
    const res = await axios.post(`${baseUrl}login`, data)
    setError(null)
    return res
  } catch (error) {
    const errorMsg = catchErrors(error)
    return setError(errorMsg)
  }
}

export const allUsers = async (authtoken, setError) => {
  try {
    const res = await axios.get(`${baseUrl}user/all`, {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    })
    setError(null)
    return res
  } catch (error) {
    const errorMsg = catchErrors(error)
    setError(errorMsg)
  }
}

export const allProducts = async (authtoken, setError) => {
  try {
    const res = await axios.get(`${baseUrl}category/all`, {
      headers: {
        Authorization: `Bearer ${authtoken}`,
      },
    })
    setError(null)
    return res
  } catch (error) {
    const errorMsg = catchErrors(error)
    setError(errorMsg)
  }
}
