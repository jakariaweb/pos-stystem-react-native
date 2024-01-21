import React, {useState, useEffect} from 'react'
import {useNavigation} from '@react-navigation/native'
import {StyleSheet, View, ActivityIndicator} from 'react-native'
import Header from '../components/Header'
import {LogBox} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import jwt_decode from 'jwt-decode'

import {useDispatch} from 'react-redux'
import {LOGIN} from '../../redux/constants'
import moment from 'moment'

const MainScreen = () => {
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation()
  const dispatch = useDispatch()
  useEffect(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`'])
  }, [])

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userData')
    navigation.navigate('Login')
  }

  // console.log(
  //   moment(decodedToken.exp * 1000).format('hh:mm'),
  //   moment().local().format('hh:mm'),
  // )

  useEffect(() => {
    setLoading(true)
    const getUserInfo = async () => {
      const userData = await AsyncStorage.getItem('userData')
      const jsonData = JSON.parse(userData)

      if (jsonData?.token) {
        let decodedToken = jwt_decode(jsonData?.token, {complete: true})

        // console.log(
        //   moment(decodedToken.exp * 1000).format('hh:mm') <
        //     moment().local().format('hh:mm'),
        // )

        if (
          moment(decodedToken.exp * 1000).format('hh:mm') <
          moment().local().format('hh:mm')
        ) {
          alert('Token expired.')
          handleLogout()
        } else {
          const getUser = {
            token: jsonData?.token,
            expires_in: jsonData?.expires_in,
            role: jsonData?.role,
            account_type: jsonData?.account_type,
            profileStatus: jsonData?.profileStatus,
            firstName: jsonData?.firstName,
            lastName: jsonData?.firstName,
          }
          if (jsonData?.token) {
            dispatch({
              type: LOGIN,
              loginData: getUser,
            })
            if (jsonData?.account_type === 'admin') {
              navigation.navigate('AdminScreen')
            } else {
              navigation.navigate('UsersScreen')
            }
          }
        }
      } else {
        navigation.navigate('Login')
        setLoading(false)
      }
    }

    setTimeout(() => {
      setLoading(false)
      getUserInfo()
    }, 2000)
  }, [])

  return (
    <>
      <Header />

      <View style={styles.container}>
        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#4C27B3" />
          </View>
        )}
      </View>
    </>
  )
}

export default MainScreen

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '70%',
    backgroundColor: '#F2F2F2',
  },
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})
