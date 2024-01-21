import {StyleSheet, Text, View} from 'react-native'
import React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
const Stack = createNativeStackNavigator()

const AppNav = () => {
  return (
    <View
      style={{
        flex: 1,
      }}>
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
    </View>
  )
}

export default AppNav

const styles = StyleSheet.create({})
