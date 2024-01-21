import React, {useEffect, useState, useRef} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import MainScreen from './src/screens/MainScreen'
import Login from './src/screens/Login'
import {Provider} from 'react-redux'
import store from './redux/store'
import AdminScreen from './src/screens/AdminScreen'
import {
  View,
  PanResponder,
  SafeAreaView,
  Animated,
  ScrollView,
} from 'react-native'
import TillScreen from './src/screens/Till/TillScreen'
import moment from 'moment'
const Stack = createNativeStackNavigator()

const App = () => {
  const [show, setShow] = useState(false)
  let timer = 0
  const screenSaverTime = 50 * 60000
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (e, gestureState) => {
        setShow(false)
        resetTimer()

        return true
      },
    }),
  ).current

  const resetTimer = () => {
    clearTimeout(timer)
    if (show) setShow(false)

    timer = setTimeout(() => {
      setShow(true)
    }, screenSaverTime)
  }

  useEffect(() => {
    timer = setTimeout(() => {
      setShow(true)
    }, screenSaverTime)
  }, [])

  return (
    <Provider store={store} {...panResponder.panHandlers}>
      <NavigationContainer>
        <Stack.Navigator backBehavior="history" initialRouteName="MainScreen">
          <Stack.Screen
            component={MainScreen}
            name="MainScreen"
            options={{headerShown: false}}
          />
          <Stack.Screen name="Login" options={{headerShown: false}}>
            {props => <Login {...props} setShow={setShow} show={show} />}
          </Stack.Screen>
          <Stack.Screen name="AdminScreen" options={{headerShown: false}}>
            {props => <AdminScreen {...props} setShow={setShow} show={show} />}
          </Stack.Screen>
          <Stack.Screen name="TillScreen" options={{headerShown: false}}>
            {props => <TillScreen {...props} setShow={setShow} show={show} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}

export default App
