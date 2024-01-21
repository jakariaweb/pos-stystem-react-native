import React, {useState, useEffect} from 'react'
import {useNavigation} from '@react-navigation/native'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  ActivityIndicator,
  BackHandler,
  Alert,
  alert,
} from 'react-native'
import Header from '../components/Header'
import {LogBox} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AntDesign from 'react-native-vector-icons/AntDesign'
import {useDispatch} from 'react-redux'
import {userLogin} from '../../utils/api'
import {LOGIN} from '../../redux/constants'
import ScreenSaver from './ScreenSaver'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

const Login = ({setShow, show}) => {
  const [user, setUser] = useState({
    email: 'okwori32@gmail.com',
    password: '00000000',
  })
  const [errorMsg, setErrorMsg] = useState(null)
  const [loading, setLoading] = useState(false)
  const [screenLoading, setScreenLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [isFocused, setIsFocused] = useState(false)
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const textInputRef = React.useRef()

  useEffect(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`'])
  }, [])

  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}))
  }

  const validate = () => {
    let isValid = true

    if (!user.email) {
      handleError('Email is required', 'email')
      isValid = false
    } else if (!user.email.match(/\S+@\S+\.\S+/)) {
      handleError('Please enter a valid email', 'email')
      isValid = false
    }

    if (!user.password) {
      handleError('Password is required', 'password')
      isValid = false
    }

    if (isValid) {
      setErrors({})
      submitLogin()
    }
  }

  const submitLogin = async () => {
    const {email, password} = user
    if (!email || !password) {
      return alert('Email and password is required')
    }

    let data = {
      email,
      password,
    }
    setErrorMsg(null)

    try {
      setLoading(true)
      const res = await userLogin(data, setErrorMsg)
      setLoading(false)
      if (res?.data) {
        const userInfo = {
          token: res?.data?.token?.access_token,
          expires_in: res?.data?.token?.expires_in,
          role: res?.data?.userInfo?.role,
          account_type: res?.data?.userInfo?.account_type,
          profileStatus: res?.data?.userInfo?.profileStatus,
          firstName: res?.data?.userInfo?.first_name,
          lastName: res?.data?.userInfo?.last_name,
        }
        setErrorMsg(null)
        await AsyncStorage.setItem('userData', JSON.stringify(userInfo))
        const userData = await AsyncStorage.getItem('userData')
        const jsonData = JSON.parse(userData)

        if (jsonData?.token) {
          setUser({email: '', password: ''})
          dispatch({
            type: LOGIN,
            loginData: userInfo,
          })
          if (res?.data?.userInfo?.account_type === 'admin') {
            navigation.navigate('AdminScreen')
          } else {
            navigation.navigate('TillScreen')
          }
        }
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const backActionHandler = () => {
    Alert.alert('Alert!', 'Are you sure you want to go back?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'YES', onPress: () => BackHandler.exitApp()},
    ])
    return true
  }

  useEffect(() => {
    // Add event listener for hardware back button press on Android
    BackHandler?.addEventListener('hardwareBackPress', backActionHandler)

    return () =>
      // clear/remove event listener
      BackHandler?.removeEventListener('hardwareBackPress', backActionHandler)
  }, [])

  return (
    <View
      style={{
        flex: 1,
      }}>
      {show ? (
        <ScreenSaver setShow={setShow} />
      ) : (
        <View>
          <Header />
          <KeyboardAwareScrollView extraHeight={120} enableOnAndroid>
            <ScrollView>
              <View style={styles.container}>
                <View style={styles.loginForm}>
                  {loading && (
                    <View style={styles.loader}>
                      <ActivityIndicator size="large" color="#4C27B3" />
                    </View>
                  )}
                  {errorMsg && (
                    <Text style={styles.errorText}>
                      <AntDesign name="warning" size={16} />{' '}
                      {errorMsg.ResponseMessage}
                    </Text>
                  )}
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={styles.inputLogin}
                    value={user.email}
                    name="email"
                    onChangeText={email => setUser({...user, email: email})}
                    autoCapitalize="none"
                    placeholderTextColor="#cccccc"
                    onFocus={() => handleError(null, 'email')}
                    error={errors.email}
                    onBlur={() => setIsFocused(false)}
                  />

                  {errors.email && (
                    <View style={styles.errorArea}>
                      <Text style={styles.loginError}>{errors.email}</Text>
                    </View>
                  )}
                  <Text style={styles.inputLabel}>Password</Text>
                  <TextInput
                    style={styles.inputLogin}
                    value={user.password}
                    name="password"
                    secureTextEntry={true}
                    onChangeText={password =>
                      setUser({...user, password: password})
                    }
                    placeholderTextColor="#cccccc"
                    onFocus={() => handleError(null, 'password')}
                    error={errors.password}
                    onBlur={() => setIsFocused(false)}
                  />

                  {errors.password && (
                    <View style={styles.errorArea}>
                      <Text style={styles.loginError}>{errors.password}</Text>
                    </View>
                  )}

                  <TouchableOpacity
                    style={styles.buttonLogin}
                    onPress={() => validate()}
                    disabled={!user.email || !user.password}>
                    <Text style={styles.buttonLoginText}>Login</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAwareScrollView>
        </View>
      )}
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(80),
    backgroundColor: '#F2F2F2',
    width: wp(100),
  },
  loginForm: {
    width: wp(60),
    backgroundColor: '#fff',
    padding: hp(5),
    borderRadius: hp(2),
  },
  inputLogin: {
    height: hp(7),
    borderRadius: hp(1),
    borderColor: '#4C27B3',
    borderWidth: hp(0.2),
    fontSize: hp('3%'),
    paddingLeft: hp(2),
  },
  inputLabel: {
    fontSize: hp('3.2%'),
    paddingLeft: hp(2),
    marginBottom: hp(1),
    marginTop: hp('4%'),
  },
  buttonLogin: {
    backgroundColor: '#4C27B3',
    height: hp('6.9%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: hp(1),
    marginVertical: hp(4),
  },
  buttonLoginText: {
    color: '#fff',
    fontSize: hp('3%'),
    textAlign: 'center',
    fontFamily: 'Manrope-Bold',
  },
  loginError: {
    color: '#EE4242',
    fontSize: hp('2.5%'),
    marginTop: hp('0.5%'),
  },
  errorText: {
    color: '#EE4242',
    fontSize: hp('2.5%'),
    marginTop: hp('1%'),
    textAlign: 'center',
  },
  errorArea: {
    justifyContent: 'flex-start',
    paddingLeft: hp('1%'),
    marginVertical: hp('1%'),
  },
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: hp(3),
    right: 0,
    left: 0,
  },
})
