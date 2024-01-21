import React, {useState, useEffect} from 'react'
import {useNavigation} from '@react-navigation/native'
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Pressable,
  ActivityIndicator,
  FlatList,
  Image,
  BackHandler,
  Alert,
} from 'react-native'
import Header from '../components/Header'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useSelector} from 'react-redux'
import {allUsers} from '../../utils/api'
import ScreenSaver from './ScreenSaver'

const noUser = require('../../assets/images/no_user.png')
const cashierIcon = require('../../assets/images/cashier-machine.png')
const userIcon = require('../../assets/images/fi-rr-user.png')

const AdminScreen = ({setShow, show}) => {
  const [errors, setErrors] = useState({})
  const [tabs, setTabs] = useState(1)
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const login = useSelector(state => state.login.loginData)
  const [users, setUsers] = useState([])

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userData')
    navigation.navigate('Login')
  }

  const loadUsers = () => {
    setLoading(true)
    allUsers(login?.token, setErrorMsg)
      .then(res => {
        if (res.status === 201) {
          setUsers(res?.data?.users)
          setLoading(false)
        }
      })
      .catch(err => {
        setLoading(false)
        console.log()
      })
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}))
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
    <>
      {show ? (
        <ScreenSaver setShow={setShow} />
      ) : (
        <SafeAreaView>
          <Header />
          <View style={styles.container}>
            <View style={styles.tabsMain}>
              <TouchableOpacity
                onPress={() => {
                  setTabs(1)
                }}
                style={
                  tabs === 1
                    ? [
                        styles.tabsBtnActive,
                        {
                          position: 'relative',
                          right: 0,
                          borderTopLeftRadius: 8,
                          borderBottomLeftRadius: 8,
                        },
                      ]
                    : [
                        styles.tabsBtn,
                        {
                          position: 'relative',
                          right: 0,
                          borderTopLeftRadius: 8,
                          borderBottomLeftRadius: 8,
                        },
                      ]
                }>
                <Text style={styles.tabsBtnText}>User Login</Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled
                onPress={() => {
                  setTabs(2)
                }}
                style={
                  tabs === 2
                    ? [
                        styles.tabsBtnActive,
                        {
                          position: 'relative',
                          left: 0,
                          borderTopRightRadius: 8,
                          borderBottomRightRadius: 8,
                        },
                      ]
                    : [
                        styles.tabsBtn,
                        {
                          position: 'relative',
                          left: 0,
                          borderTopRightRadius: 8,
                          borderBottomRightRadius: 8,
                        },
                      ]
                }>
                <Text style={styles.tabsBtnText}>Pin Login</Text>
              </TouchableOpacity>
            </View>

            {tabs === 1 && (
              <>
                {loading && (
                  <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#4C27B3" />
                  </View>
                )}
                <FlatList
                  style={styles.item}
                  numColumns={5}
                  data={users && users}
                  renderItem={({item}) => (
                    <Pressable
                      onPressIn={() => navigation.navigate('TillScreen')}
                      style={{
                        paddingHorizontal: 1,
                      }}>
                      <View style={styles.userList}>
                        <Image
                          source={
                            item?.role?.name === 'Sales Admin'
                              ? cashierIcon
                              : userIcon
                          }
                          style={{
                            width: 50,
                            height: 50,
                          }}
                          width={50}
                          height={50}
                          resizeMode="contain"
                        />
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginVertical: 5,
                          }}>
                          <Text style={styles.name}> {item?.first_name}</Text>
                        </View>
                      </View>

                      <View style={styles.designation}>
                        <Text style={styles.designationText}>
                          {item?.role?.name ? item?.role?.name : 'User'}
                        </Text>
                      </View>
                    </Pressable>
                  )}
                  keyExtractor={item => item.userID}
                />
              </>
            )}

            {tabs === 2 && <View></View>}
          </View>
        </SafeAreaView>
      )}
    </>
  )
}

export default AdminScreen

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '77%',
    backgroundColor: '#F2F2F2',
  },
  tabsMain: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 5,
    position: 'absolute',
    alignItems: 'center',
    top: '4%',
  },
  tabsBtn: {
    width: 180,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#62E1AA',
    borderWidth: 2,
  },
  tabsBtnActive: {
    width: 180,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#62E1AA',
    backgroundColor: '#62E1AA',
    borderWidth: 2,
  },
  tabsBtnText: {
    fontSize: 24,
    color: '#25077B',
  },

  item: {
    marginTop: '11%',
  },
  name: {
    fontSize: 16,
    color: '#25077B',
    textTransform: 'capitalize',
  },
  designationText: {
    fontSize: 18,
    color: '#25077B',
  },
  userList: {
    width: 157,
    height: 130,
    padding: 10,
    borderRadius: 10,
    borderColor: '#4C27B3',
    borderWidth: 2,
    marginHorizontal: 10,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  designation: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  chooseText: {
    fontSize: 24,
    textAlign: 'center',
    color: '#25077B',
    fontFamily: 'Manrope-Bold',
    marginBottom: 50,
  },
  button: {
    backgroundColor: '#4C27B3',
    width: 485,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Manrope-Bold',
  },
  modalMain: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    width: '100%',
    height: '100%',
  },
  modalMaskView: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: '#ffffff',
    opacity: 0.1,
  },
  modalView: {
    padding: 15,
    width: '53%',
    marginTop: '5%',
    minHeight: 250,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    borderRadius: 30,
  },
  loginForm: {
    padding: 20,
  },
  inputLogin: {
    height: 50,
    borderRadius: 15,
    width: '100%',
    borderColor: '#4C27B3',
    borderWidth: 1,
    fontSize: 16,
    paddingLeft: 15,
  },
  inputLabel: {
    fontSize: 20,
    paddingLeft: 10,
    marginBottom: 10,
    marginTop: 20,
  },
  buttonLogin: {
    backgroundColor: '#4C27B3',
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 30,
  },
  buttonLoginText: {
    color: '#fff',
    fontSize: 22,
    textAlign: 'center',
    fontFamily: 'Manrope-Bold',
  },
  loginError: {
    color: '#EE4242',
    fontSize: 14,
    marginTop: 5,
  },
  errorArea: {
    justifyContent: 'flex-start',
    paddingLeft: 16,
    marginVertical: 2,
  },
  loader: {
    marginTop: '20%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
