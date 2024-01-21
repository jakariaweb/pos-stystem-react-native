import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  Pressable,
  FlatList,
  ActivityIndicator,
} from 'react-native'
import React, {useState, useMemo, useEffect, useCallback} from 'react'
import ScreenSaver from '../ScreenSaver'
import CashierHeader from '../../components/CashierHeader'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useDispatch, useSelector} from 'react-redux'
import {useNavigation} from '@react-navigation/native'
import {allProducts} from '../../../utils/api'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import moment from 'moment'
import NetInfo from '@react-native-community/netinfo'
import {
  addToCart,
  decrement,
  emptyCart,
  increment,
  removeFromCart,
} from '../../../redux/actions/cart'

const searchIconImage = require('../../../assets/images/search-icon.png')
const userProfileImage = require('../../../assets/images/profile-icon.png')
const arrowRightImage = require('../../../assets/images/arrow-right.png')
const arrowDownVioletImage = require('../../../assets/images/arrow-down-violet.png')
const arrowUpVioletImage = require('../../../assets/images/arrow-up-violet.png')
const successImage = require('../../../assets/images/success.png')
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import {ADD_CART} from '../../../redux/constants'
import {v4 as uuidv4} from 'uuid'

let numbers = [
  {id: 1, value: '1'},
  {id: 2, value: '2'},
  {id: 3, value: '3'},
  {id: 4, value: '4'},
  {id: 5, value: '5'},
  {id: 6, value: '6'},
  {id: 7, value: '7'},
  {id: 8, value: '8'},
  {id: 9, value: '9'},
  {id: 10, value: '0'},
]

const TillScreen = ({setShow, show}) => {
  const login = useSelector(state => state.login.loginData)
  const {cart} = useSelector(state => state.cart)
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const [commentModal, setCommentModal] = useState(false)
  const [cashModal, setCashModal] = useState(false)
  const [cardModal, setCardModal] = useState(false)
  const [value, setValue] = useState('0')
  const [sumShow, setSumShow] = useState('0')
  const [totalCash, setTotalCash] = useState('0')
  const [bracketopen, setBracketOpen] = useState(false)
  const [comment, setComment] = useState('')
  const [searchText, setSearchText] = useState('')
  const [tabs, setTabs] = useState(1)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const [products, setProducts] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  const [selectTable, setSelectTable] = useState(false)
  const [switchUser, setSwitchUser] = useState(false)
  const [modalPin, setModalPin] = useState(false)
  const [pinCode, setPinCode] = useState(['', '', '', ''])
  const [selectDiscount, setSelectDiscount] = useState(false)
  const [tableNum, setTableNum] = useState('')
  const [disCountNum, setDiscountNum] = useState('')

  const [orderNumber, setOrderNumber] = useState()

  const genOrder = () => {
    const randomInt = Math.floor(Math.random() * 900000) + 100000 // generate a random integer between 100000 and 999999
    const uuid = uuidv4().substr(0, 8) + randomInt.toString() // concatenate a UUID with the random integer, ensuring it has 6 digits
    const uniqueId = uuid.substr(uuid.length - 6) // extract the last 6 digits
    console.log(uniqueId)
    setOrderNumber(uniqueId)
  }

  useEffect(() => {
    genOrder()
  }, [])

  const [orders, setOrders] = useState([])

  const tableItem = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  const discountItem = ['0', '5', '10', '15', '20', '25']

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userData')
    navigation.navigate('Login')
  }

  // console.log(login.token)

  const getAllProducts = () => {
    setLoading(true)
    allProducts(login?.token, setErrorMsg)
      .then(res => {
        if (res.status === 201) {
          setProducts(res?.data)
          setSelectedProducts(res?.data?.categories[0].products)

          setLoading(false)
        }
      })
      .catch(err => {
        console.error(err.response.data.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    getAllProducts()
  }, [])

  const selPro = selectedProducts?.map(p => p.category.id)

  const handleCategorySelect = p => {
    setSelectedProducts(p?.products)
  }

  const addToCartItem = useCallback(
    p => {
      const findCartItem = pr => pr.id === p.productID

      const cartQty = cart?.find(findCartItem)
      if (cartQty?.qty >= p.inStock) {
        return alert('You can not increment items more than stock availability')
      }
      dispatch(addToCart(p.productID, p.name, 1, p.sale_price, p.opening_stock))
    },
    [cart],
  )

  const removeCart = useCallback(
    id => {
      dispatch(removeFromCart(id))
    },
    [dispatch],
  )

  const incrementHandler = useCallback(
    (id, qty, stock) => {
      if (qty >= stock) {
        return alert('You can not increment items more than Stock availability')
      }
      dispatch(increment(id, qty, stock))
    },
    [dispatch],
  )

  const decrementHandler = useCallback(
    (id, qty) => {
      if (qty <= 1) {
        return dispatch(removeFromCart(id))
      }
      dispatch(decrement(id, qty))
    },
    [dispatch],
  )

  const totalPrice = useMemo(() => {
    return cart.reduce(
      (total, item) => total + item.qty * parseInt(item.price),
      0,
    )
  }, [cart])

  useEffect(() => {
    if (totalPrice === 0) {
      setDiscountNum('0')
    }
  }, [totalPrice])

  const handlePress = useMemo(
    () => val => {
      if (val == 'AC') {
        setValue('0')
        setSumShow('0')
      } else if (val == '=') {
        try {
          if (
            (value.match(/\(/g) || []).length ==
            (value.match(/\)/g) || []).length
          ) {
            if (
              value.slice(-1) == '+' ||
              value.slice(-1) == '-' ||
              value.slice(-1) == '*' ||
              value.slice(-1) == '/'
            ) {
              setSumShow(`${eval(value.replace('()', '(0)').slice(0, -1))}`)
            } else {
              setSumShow(`${eval(value.replace('()', '(0)') + '*1')}`)
            }
          }
        } catch (e) {
          setValue('Format Error')
        }
      } else if (val == 'back') {
        setValue(value.slice(0, -1))
      } else if (val == '()') {
        if (value == '0') {
          setValue('(')
          setBracketOpen(true)
        } else if (
          value.slice(-1) == '+' ||
          value.slice(-1) == '-' ||
          value.slice(-1) == '*' ||
          value.slice(-1) == '/'
        ) {
          setValue(value + '(')
          setBracketOpen(true)
        } else {
          if (bracketopen == true) {
            setValue(value + ')')
            setBracketOpen(false)
          } else {
            setValue(value + '(')
            setBracketOpen(true)
          }
        }
      } else {
        if (value == '0') {
          if (
            val == '+' ||
            val == '-' ||
            val == '*' ||
            val == '/' ||
            val == '.' ||
            val == '%'
          ) {
            setValue(value + val)
          } else {
            setValue(val)
          }
        } else if (isNaN(val)) {
          if (
            value.slice(-1) == '+' ||
            value.slice(-1) == '-' ||
            value.slice(-1) == '*' ||
            value.slice(-1) == '/' ||
            value.slice(-1) == '.' ||
            value.slice(-1) == '%'
          ) {
            setValue(value.slice(0, -1) + val)
          } else {
            setValue(value + val)
          }
        } else if (!isNaN(val)) {
          setValue(value + val)
        }
      }
    },
    [value, bracketopen, setBracketOpen, setValue, setSumShow],
  )

  const onPressPinNumber = useMemo(
    () => num => {
      let tempPin = [...pinCode]
      for (let i = 0; i < tempPin.length; i++) {
        if (tempPin[i] == '') {
          tempPin[i] = num
          break
        } else {
          continue
        }
      }
      setPinCode(tempPin)
    },
    [pinCode],
  )

  const removePin = useMemo(
    () => () => {
      let tempPinR = [...pinCode]
      for (let newNum = tempPinR.length - 1; newNum >= 0; newNum--) {
        if (tempPinR[newNum] != '') {
          tempPinR[newNum] = ''
          break
        } else {
          continue
        }
      }
      setPinCode(tempPinR)
    },
    [pinCode],
  )

  // console.log(pinCode)

  let pinResultFinal = ''
  Object.values(pinCode).forEach(v => {
    pinResultFinal += v
  })

  const handlePinLogin = () => {
    if (pinResultFinal.length !== 4) {
      return alert('Please enter 4 digit pin!')
    }

    // console.log(pinResultFinal)

    setPinCode(['', '', '', ''])
    setModalPin(false)
  }

  NetInfo.addEventListener(state => {
    if (state.isConnected) {
      console.log('Your network is connected')
    } else {
      console.log('Your network is disconnected')
    }
  })

  const orderInfo = useMemo(
    () => ({
      order: orderNumber,
      date: Date.now(),
      products: cart,
      total: totalPrice,
    }),
    [cart, totalPrice],
  )

  const insertData = async () => {
    setTotalCash(sumShow)
    try {
      const orderData = await AsyncStorage?.getItem('orderData')
      const existingOrders = JSON.parse(orderData) || [] // parse existing orders from storage or initialize to empty array if not found
      const updatedOrders = [...existingOrders, orderInfo] // add the new order to the array of existing orders
      await AsyncStorage.setItem('orderData', JSON.stringify(updatedOrders))
      setCashModal(false)
      setValue('0')
      setSumShow('0')
      dispatch(emptyCart())
      genOrder()
      console.log(updatedOrders)
    } catch (error) {
      console.log(error)
    }
  }

  const unsubscribe = NetInfo.addEventListener(state => {
    if (state.isConnected) {
      console.log('Connected')
    }
  })

  unsubscribe()

  useEffect(() => {
    const getOrders = async () => {
      try {
        const orderData = await AsyncStorage.getItem('orderData')
        const parsedOrderData = JSON.parse(orderData)
        const orderArray = Object.values(parsedOrderData)
        setOrders(orderArray)
      } catch (error) {
        console.log(error)
      }
    }
    getOrders()
  }, [])

  return (
    <>
      {show ? (
        <ScreenSaver setShow={setShow} />
      ) : (
        <View style={styles.container}>
          <CashierHeader handleLogout={handleLogout} />

          <View style={styles.innerRow}>
            {loading ? (
              <View style={styles.loader}>
                <ActivityIndicator size="large" color="#4C27B3" />
              </View>
            ) : (
              <>
                {cashModal && (
                  <Pressable
                    onPress={() => setCashModal(!cashModal)}
                    style={styles.maskViewModal}></Pressable>
                )}
                {cashModal && (
                  <View style={styles.modalBoxContainer}>
                    <View style={styles.calHeader}>
                      <Text style={styles.calHeaderText}>
                        Cash amount calculator
                      </Text>
                    </View>
                    <View style={styles.calBody}>
                      <View style={styles.numView}>
                        <View style={styles.main_screen__keypad}>
                          {/*  */}
                          <View style={styles.main_screen__keypad_row}>
                            <Pressable onPress={() => handlePress('7')}>
                              <View style={styles.btn_outer}>
                                <Text style={styles.bg_button}>7</Text>
                              </View>
                            </Pressable>
                            <Pressable onPress={() => handlePress('8')}>
                              <View style={styles.btn_outer}>
                                <Text style={styles.bg_button}>8</Text>
                              </View>
                            </Pressable>

                            <Pressable onPress={() => handlePress('9')}>
                              <View style={styles.btn_outer}>
                                <Text style={styles.bg_button}>9</Text>
                              </View>
                            </Pressable>

                            <Pressable onPress={() => handlePress('*')}>
                              <View style={styles.btn2_outer}>
                                <Text style={styles.bg2_button}>*</Text>
                              </View>
                            </Pressable>
                          </View>
                          {/*  */}
                          <View style={styles.main_screen__keypad_row}>
                            <Pressable onPress={() => handlePress('4')}>
                              <View style={styles.btn_outer}>
                                <Text style={styles.bg_button}>4</Text>
                              </View>
                            </Pressable>

                            <Pressable onPress={() => handlePress('5')}>
                              <View style={styles.btn_outer}>
                                <Text style={styles.bg_button}>5</Text>
                              </View>
                            </Pressable>

                            <Pressable onPress={() => handlePress('6')}>
                              <View style={styles.btn_outer}>
                                <Text style={styles.bg_button}>6</Text>
                              </View>
                            </Pressable>

                            <Pressable onPress={() => handlePress('-')}>
                              <View style={styles.btn2_outer}>
                                <Text style={styles.bg2_button}>-</Text>
                              </View>
                            </Pressable>
                          </View>
                          {/*  */}
                          <View style={styles.main_screen__keypad_row}>
                            <Pressable onPress={() => handlePress('1')}>
                              <View style={styles.btn_outer}>
                                <Text style={styles.bg_button}>1</Text>
                              </View>
                            </Pressable>

                            <Pressable onPress={() => handlePress('2')}>
                              <View style={styles.btn_outer}>
                                <Text style={styles.bg_button}>2</Text>
                              </View>
                            </Pressable>

                            <Pressable onPress={() => handlePress('3')}>
                              <View style={styles.btn_outer}>
                                <Text style={styles.bg_button}>3</Text>
                              </View>
                            </Pressable>

                            <Pressable onPress={() => handlePress('+')}>
                              <View style={styles.btn2_outer}>
                                <Text style={styles.bg2_button}>+</Text>
                              </View>
                            </Pressable>
                          </View>
                          {/*  */}
                          <View style={styles.main_screen__keypad_row}>
                            <Pressable onPress={() => handlePress('0')}>
                              <View style={styles.btn_outer}>
                                <Text style={styles.bg_button}>0</Text>
                              </View>
                            </Pressable>

                            <Pressable onPress={() => handlePress('.')}>
                              <View style={styles.btn2_outer}>
                                <Text style={styles.bg2_button}>.</Text>
                              </View>
                            </Pressable>

                            <Pressable onPress={() => handlePress('back')}>
                              <View style={styles.btn1_outer}>
                                <Text style={styles.bg1_button_back}>
                                  <Ionicons
                                    name="backspace-outline"
                                    size={
                                      wp(100) >= 1300
                                        ? 60
                                        : wp(100) >= 1024
                                        ? 45
                                        : 32
                                    }
                                  />
                                </Text>
                              </View>
                            </Pressable>

                            <Pressable onPress={() => handlePress('/')}>
                              <View style={styles.btn2_outer}>
                                <Text style={styles.bg2_button}>/</Text>
                              </View>
                            </Pressable>
                          </View>

                          <View style={styles.main_screen__keypad_row}>
                            <View>
                              <View style={styles.btn2_outer}>
                                <Text style={styles.bg2_button}></Text>
                              </View>
                            </View>

                            <View>
                              <View style={styles.btn2_outer}>
                                <Text style={styles.bg2_button}></Text>
                              </View>
                            </View>

                            <Pressable onPress={() => handlePress('AC')}>
                              <View style={styles.btn1_outer}>
                                <Text style={styles.bg1_button}>AC</Text>
                              </View>
                            </Pressable>

                            <Pressable onPress={() => handlePress('=')}>
                              <View style={styles.btn2_outer_equal}>
                                <Text style={styles.bg2_button_equal}>=</Text>
                              </View>
                            </Pressable>
                          </View>

                          <View style={styles.commentButtonRowCalc}>
                            <Pressable
                              style={styles.cancelBtn}
                              onPress={() => {
                                setCashModal(false)
                                setValue('0')
                                setSumShow('0')
                                setTotalCash('0')
                              }}>
                              <Text style={styles.cancelSendText}>Cancel</Text>
                            </Pressable>

                            <Pressable
                              style={styles.sendBtn}
                              onPress={() => {
                                insertData()
                              }}>
                              <Text style={styles.cancelSendText}>Pay</Text>
                            </Pressable>
                          </View>
                        </View>
                      </View>
                      <View style={styles.main_screen}>
                        <View style={styles.main_screen__display}>
                          <Text style={styles.main_screen__display_text}>
                            {value
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          </Text>
                        </View>
                        <View style={styles.main_screen_display_total}>
                          <Text style={styles.totalCalcText}>Total:</Text>
                          <Text style={styles.main_screen__display_text_total}>
                            {sumShow
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )}

                {cardModal && (
                  <Pressable
                    onPress={() => setCardModal(!cardModal)}
                    style={styles.maskViewModal}></Pressable>
                )}
                {cardModal && (
                  <View style={styles.modalBoxContainer}>
                    <View style={styles.calHeader}>
                      <Text style={styles.calHeaderText}>Card Payment</Text>
                    </View>
                    <View style={styles.cardBody}>
                      <Image
                        source={successImage}
                        style={styles.successImageStyle}
                        width={82}
                        height={82}
                        resizeMode="contain"
                      />
                      <View style={styles.cardBodyMainText}>
                        <Text style={styles.cardPaymentTitle}>
                          Card payment successful
                        </Text>

                        <Text style={styles.cardPaymentText}>
                          Total:{' '}
                          {disCountNum !== '0' && disCountNum
                            ? totalPrice - (totalPrice * disCountNum) / 100
                            : totalPrice}
                        </Text>

                        <Text style={styles.cardPaymentText}>
                          Paid:{' '}
                          {disCountNum !== '0' && disCountNum
                            ? totalPrice - (totalPrice * disCountNum) / 100
                            : totalPrice}
                        </Text>
                      </View>

                      <View style={styles.cardReceiptMain}>
                        <Pressable
                          style={styles.noReceiptBtn}
                          onPress={() => {
                            setCardModal(false)
                          }}>
                          <Text style={styles.cancelSendText}>No Receipt</Text>
                        </Pressable>

                        <Pressable
                          style={styles.printBtn}
                          onPress={() => {
                            setCardModal(false)
                            setTotalCash(
                              disCountNum !== '0' && disCountNum
                                ? totalPrice - (totalPrice * disCountNum) / 100
                                : totalPrice,
                            )
                            setValue('0')
                            setSumShow('0')
                            dispatch(emptyCart())
                          }}>
                          <Text style={styles.cancelSendText}>
                            Print Receipt
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                )}

                {modalPin && (
                  <Pressable
                    onPress={() => setModalPin(!modalPin)}
                    style={styles.maskViewModal}></Pressable>
                )}

                {modalPin && (
                  <View style={styles.modalPinBoxContainer}>
                    <View style={styles.pinTextMain}>
                      <Text style={styles.pinText}>Enter personal PIN</Text>
                    </View>

                    <View style={styles.pinAreaDisplay}>
                      <View style={styles.pinDot}>
                        {pinCode?.map((item, i) => {
                          let pinShowsBullet =
                            item != '' ? styles.fillCode : styles.code
                          return <View key={i} style={pinShowsBullet}></View>
                        })}
                      </View>
                      <Pressable
                        onPress={() => removePin()}
                        style={styles.pinRemove}>
                        <Ionicons
                          name="backspace-outline"
                          size={
                            wp(100) >= 1300 ? 50 : wp(100) >= 1024 ? 35 : 32
                          }
                          color={'#fff'}
                        />
                      </Pressable>
                    </View>

                    <View style={styles.numWrapper}>
                      {numbers?.map(num => {
                        return (
                          <Pressable
                            onPress={() => {
                              onPressPinNumber(num.value)
                            }}
                            key={num.id}
                            style={styles.number}>
                            <Text style={styles.numberText}>{num.value}</Text>
                          </Pressable>
                        )
                      })}
                      <Pressable
                        onPress={() => handlePinLogin()}
                        style={styles.numberOk}>
                        <Text style={styles.numberTextOk}>OK</Text>
                      </Pressable>
                    </View>
                  </View>
                )}

                <View style={styles.productArea}>
                  <View style={styles.searchArea}>
                    <Image
                      source={searchIconImage}
                      style={styles.searchIcon}
                      width={24}
                      height={24}
                      resizeMode="contain"
                    />
                    <TextInput
                      placeholder="Search"
                      value={searchText}
                      onChangeText={text => setSearchText(text)}
                      style={styles.inputStyle}
                      name="search"
                      placeholderTextColor="#353535"
                    />
                  </View>

                  <View style={styles.categoriesArea}>
                    <FlatList
                      style={styles.item}
                      numColumns={wp(100) >= 1300 ? 5 : wp(100) > 1024 ? 3 : 3}
                      data={products && products?.categories}
                      renderItem={({item}) => {
                        const activeCat = item?.id === selPro[0]
                        return (
                          <Pressable
                            onPress={() => handleCategorySelect(item)}
                            style={{
                              paddingHorizontal: 1,
                            }}>
                            <View
                              style={
                                activeCat
                                  ? styles.categoriesListActive
                                  : styles.categoriesList
                              }>
                              <Text style={styles.categoriesText}>
                                {item?.category_name}
                              </Text>

                              <Text style={styles.categoriesItemsText}>
                                {item?.products?.length} items
                              </Text>
                            </View>
                          </Pressable>
                        )
                      }}
                      keyExtractor={item => item?.category_name}
                    />
                  </View>

                  <View style={styles.borderTop}></View>

                  <View style={styles.productsArea}>
                    <FlatList
                      style={styles.itemProduct}
                      numColumns={wp(100) >= 1300 ? 5 : wp(100) > 1024 ? 3 : 3}
                      data={selectedProducts && selectedProducts}
                      renderItem={({item}) => {
                        const alreadyOnCart = cart?.find(
                          ct => ct.id === item?.productID,
                        )

                        return (
                          <Pressable
                            onPress={() =>
                              !alreadyOnCart ? addToCartItem(item) : null
                            }
                            style={{
                              paddingHorizontal: 1,
                            }}>
                            <View
                              style={
                                alreadyOnCart?.id === item?.productID
                                  ? styles.productListCart
                                  : styles.productList
                              }>
                              <View style={styles.productTopText}>
                                <Text>Orders </Text>

                                <Image
                                  source={arrowRightImage}
                                  style={styles.arrowRightIcon}
                                  width={24}
                                  height={24}
                                  resizeMode="contain"
                                />

                                <Text>Kitchen </Text>
                              </View>
                              <Text style={styles.productName}>
                                {item?.name}
                              </Text>

                              <Text style={styles.productPrice}>
                                #{item?.sale_price}
                              </Text>

                              <View style={styles.cartPlusMinus}>
                                <Pressable
                                  onPress={() =>
                                    alreadyOnCart &&
                                    decrementHandler(
                                      alreadyOnCart?.id,
                                      alreadyOnCart?.qty,
                                      alreadyOnCart?.stock,
                                    )
                                  }
                                  style={styles.addToCartBtn}>
                                  <AntDesign name="minus" size={26} />
                                </Pressable>
                                <Text style={styles.productCartCount}>
                                  {alreadyOnCart ? alreadyOnCart?.qty : 0}
                                </Text>
                                <Pressable
                                  onPress={() =>
                                    alreadyOnCart
                                      ? incrementHandler(
                                          alreadyOnCart?.id,
                                          alreadyOnCart?.qty,
                                          alreadyOnCart?.stock,
                                        )
                                      : addToCartItem(item)
                                  }
                                  style={styles.addToCartBtn}>
                                  <AntDesign name="plus" size={22} />
                                </Pressable>
                              </View>
                            </View>
                          </Pressable>
                        )
                      }}
                      keyExtractor={item => item?.productID}
                    />
                  </View>
                </View>

                <View style={styles.cartArea}>
                  <View style={styles.tabsUserArea}>
                    <View style={styles.tabs}>
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
                                  borderRadius: 50,
                                },
                              ]
                            : [
                                styles.tabsBtn,
                                {
                                  position: 'relative',
                                  borderRightWidth: 0,
                                  borderTopLeftRadius: 50,
                                  borderBottomLeftRadius: 50,
                                },
                              ]
                        }>
                        <Text
                          style={
                            tabs === 1
                              ? styles.tabsBtnTextActive
                              : styles.tabsBtnText
                          }>
                          Eat-in
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          {
                            setTabs(2)
                            setSelectTable(false)
                          }
                        }}
                        style={
                          tabs === 2
                            ? [
                                styles.tabsBtnActive,
                                {
                                  position: 'relative',
                                  borderRadius: 50,
                                  right: 20,
                                },
                              ]
                            : [
                                styles.tabsBtn,
                                {
                                  position: 'relative',
                                  right: 20,
                                  borderLeftWidth: 0,
                                  borderTopRightRadius: 50,
                                  borderBottomRightRadius: 50,
                                },
                              ]
                        }>
                        <Text
                          style={
                            tabs === 2
                              ? styles.tabsBtnTextActive
                              : styles.tabsBtnText
                          }>
                          Takeout
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <Pressable
                      onPress={() => {
                        setSwitchUser(!switchUser)
                      }}
                      style={styles.cartUserArea}>
                      <Image
                        source={userProfileImage}
                        style={styles.userIcon}
                        width={30}
                        height={30}
                        resizeMode="contain"
                      />
                      <Text style={styles.userName}>{login?.firstName}</Text>
                    </Pressable>
                  </View>

                  {switchUser && (
                    <View style={styles.switchUserMain}>
                      <Pressable
                        onPress={() => {
                          setSwitchUser(false)
                          setModalPin(true)
                        }}
                        style={styles.switchSingle}>
                        <Text style={styles.switchText}>Switch account</Text>
                      </Pressable>
                    </View>
                  )}

                  <View
                    style={{
                      position: 'relative',
                      zIndex: 1,
                    }}>
                    {commentModal && (
                      <>
                        <Pressable
                          onPress={() => setCommentModal(!commentModal)}
                          style={styles.modalComment}></Pressable>
                      </>
                    )}
                    {commentModal && (
                      <View style={styles.commentModalBox}>
                        <TextInput
                          style={styles.commentInput}
                          value={comment}
                          placeholder="Write a comment here"
                          name="comment"
                          onChangeText={comment => setComment(comment)}
                        />
                        <View style={styles.commentButtonRow}>
                          <Pressable
                            style={styles.cancelBtn}
                            onPress={() => setCommentModal(false)}>
                            <Text style={styles.cancelSendText}>Cancel</Text>
                          </Pressable>

                          <Pressable
                            style={styles.sendBtn}
                            onPress={() => setCommentModal(false)}>
                            <Text style={styles.cancelSendText}>Send</Text>
                          </Pressable>
                        </View>
                      </View>
                    )}
                    <View style={styles.tableArea}>
                      {tabs === 1 && (
                        <>
                          <Pressable
                            onPress={() => setSelectTable(!selectTable)}
                            style={styles.tableHeading}>
                            <Text style={styles.tableText}>Select Table #</Text>

                            <Image
                              source={
                                selectTable
                                  ? arrowUpVioletImage
                                  : arrowDownVioletImage
                              }
                              style={styles.arrowVioletIcon}
                              width={15}
                              height={7}
                              resizeMode="contain"
                            />
                          </Pressable>
                          <Text style={styles.tableText}>
                            Table # {tableNum}
                          </Text>
                        </>
                      )}
                    </View>
                    {selectTable && (
                      <View style={styles.tableItemMain}>
                        {tableItem?.map(tb => {
                          return (
                            <Pressable
                              onPress={() => {
                                setTableNum(tb)
                                setSelectTable(false)
                              }}
                              style={styles.tableItemSingle}
                              key={tb}>
                              <Text style={styles.tableItemsText}>{tb}</Text>
                            </Pressable>
                          )
                        })}
                      </View>
                    )}

                    <View style={styles.cartMainView}>
                      <View style={styles.cartItemMain}>
                        <View style={styles.cartItemTop}>
                          <Text style={styles.cartItemTopText}>
                            Order#: {orderNumber}
                          </Text>
                          <Text style={styles.cartItemTopDate}>
                            {moment().format('MM/DD/YY')}
                          </Text>
                          <Text style={styles.cartItemTopTime}>
                            {moment().format('h:mm A')}
                          </Text>
                        </View>

                        <View style={styles.cartItemTop}>
                          <Text style={styles.cartItemDescTextDesc}>
                            Description
                          </Text>
                          <Text style={styles.cartItemDescTextQty}>Qty</Text>
                          <Text style={styles.cartItemDescText}>Total</Text>
                        </View>

                        {cart?.length === 0 && (
                          <View style={styles.noCartItem}>
                            <Text style={styles.noCartItemText}>
                              No items in cart
                            </Text>
                          </View>
                        )}

                        <View style={styles.cartItemsListMain}>
                          <ScrollView
                            scrollEnabled={true}
                            nestedScrollEnabled={true}>
                            {cart &&
                              cart?.map(item => {
                                return (
                                  <View
                                    key={item?.id}
                                    style={styles.cartItemList}>
                                    <Text style={styles.cartItemsDesc}>
                                      {item?.title}
                                    </Text>
                                    <View style={styles.cartPlusMinusCart}>
                                      <Pressable
                                        onPress={() =>
                                          decrementHandler(
                                            item?.id,
                                            item?.qty,
                                            item?.stock,
                                          )
                                        }
                                        style={styles.addToCartBtn}>
                                        <AntDesign name="minus" size={26} />
                                      </Pressable>
                                      <Text style={styles.productCartCount}>
                                        {item?.qty}
                                      </Text>
                                      <Pressable
                                        onPress={() =>
                                          incrementHandler(
                                            item?.id,
                                            item?.qty,
                                            item?.stock,
                                          )
                                        }
                                        style={styles.addToCartBtn}>
                                        <AntDesign name="plus" size={22} />
                                      </Pressable>
                                      <Pressable
                                        onPress={() => removeCart(item?.id)}
                                        style={styles.deleteItem}>
                                        <AntDesign
                                          name="delete"
                                          size={20}
                                          color="red"
                                        />
                                      </Pressable>
                                    </View>
                                    <Text style={styles.cartItemsTotal}>
                                      N {item?.qty * item?.price}
                                    </Text>
                                  </View>
                                )
                              })}
                          </ScrollView>
                        </View>
                      </View>

                      <View style={styles.discountAreaMain}>
                        <View style={styles.btnAreaDiscounts}>
                          <Pressable
                            style={styles.discountBtn}
                            onPress={() => {
                              cart?.length > 0 &&
                                setSelectDiscount(!selectDiscount)
                            }}>
                            <Text style={styles.discountBtnText}>Discount</Text>
                            <Image
                              source={
                                selectDiscount
                                  ? arrowUpVioletImage
                                  : arrowDownVioletImage
                              }
                              style={styles.arrowVioletIcon}
                              width={15}
                              height={7}
                              resizeMode="contain"
                            />
                          </Pressable>

                          <Pressable style={styles.discountBtn}>
                            <Text style={styles.discountBtnText}>Cancel</Text>
                          </Pressable>

                          <Pressable style={styles.discountBtn}>
                            <Text style={styles.discountBtnText}>Hold</Text>
                          </Pressable>

                          <Pressable
                            onPress={() => setCommentModal(!commentModal)}
                            style={styles.discountBtn}>
                            <Text style={styles.discountBtnText}>Comment</Text>
                          </Pressable>
                        </View>

                        {selectDiscount && (
                          <View style={styles.disCountItemMain}>
                            {discountItem?.map(dis => {
                              return (
                                <Pressable
                                  onPress={() => {
                                    setDiscountNum(dis)
                                    setSelectTable(false)
                                    setSelectDiscount(false)
                                  }}
                                  style={styles.tableItemSingle}
                                  key={dis}>
                                  <Text style={styles.tableItemsText}>
                                    {dis}%
                                  </Text>
                                </Pressable>
                              )
                            })}
                          </View>
                        )}

                        <View style={styles.creditTaxMain}>
                          <Text style={styles.creditTaxTextOne}>Credits:</Text>
                          <Text style={styles.creditTaxText}>N0.00</Text>
                          <Text style={styles.creditTaxTextTwo}>Subtotal:</Text>
                          <Text style={styles.creditTaxText}>N0.00</Text>
                        </View>

                        <View style={styles.creditTaxMain}>
                          <Text style={styles.creditTaxTextOne}>
                            Discounts:
                          </Text>
                          <Text style={styles.creditTaxText}>N0.00</Text>
                          <Text style={styles.creditTaxTextTwo}>Tax:</Text>
                          <Text style={styles.creditTaxText}>N0.00</Text>
                        </View>

                        <View style={styles.creditTaxMain}>
                          <Text style={styles.creditTaxTextOne}>Tips:</Text>
                          <Text style={styles.creditTaxText}>N0.00</Text>
                          <Text style={styles.creditTaxTextTwo}>
                            Balance Due:
                          </Text>
                          <Text style={styles.creditTaxText}>N0.00</Text>
                        </View>

                        <View style={styles.creditTaxMain}>
                          <Text style={styles.creditTaxTextTotalRow}></Text>
                          <Text style={styles.creditTaxTextTotalRow}></Text>
                          <Text style={styles.creditTaxTextTwoTotal}>
                            Total {disCountNum !== '0' && disCountNum + '%'}
                          </Text>
                          <Text style={styles.creditTaxTextTotal}>
                            N
                            {disCountNum !== '0' && disCountNum
                              ? totalPrice - (totalPrice * disCountNum) / 100
                              : totalPrice}
                            .00
                          </Text>
                        </View>

                        <View style={styles.btnAreaDiscounts}>
                          <Pressable style={styles.discountBtn}>
                            <Text style={styles.discountBtnText}>
                              Split Bill
                            </Text>
                          </Pressable>

                          <Pressable
                            disabled={cart?.length === 0}
                            onPress={() => setCashModal(!cashModal)}
                            style={styles.discountBtn}>
                            <Text style={styles.discountBtnText}>
                              Cash Payment
                            </Text>
                          </Pressable>

                          <Pressable
                            disabled={cart?.length === 0}
                            onPress={() => setCardModal(!cardModal)}
                            style={styles.discountBtn}>
                            <Text style={styles.discountBtnText}>
                              Card payment
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      )}
    </>
  )
}

export default TillScreen

const styles = StyleSheet.create({
  container: {
    width: wp(100),
    backgroundColor: '#4C27B3',
    height: hp(100),
    flex: 1,
  },
  innerRow: {
    margin: '1%',
    height: '92%',
    backgroundColor: '#F2F2F2',
    justifyContent: 'space-between',
    paddingHorizontal: hp('1%'),
    flexDirection: 'row',
    flex: 1,
  },
  productArea: {
    width: wp(100) >= 1300 ? '60%' : wp(100) > 1024 ? '51%' : '51%',
    height: '100%',
  },
  cartArea: {
    width: wp(100) >= 1300 ? '40%' : wp(100) > 1024 ? '48%' : '48%',
    height: '100%',
  },
  searchArea: {
    width: wp(100) >= 1300 ? '98%' : wp(100) > 1024 ? '100%' : '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3e3e3',
    paddingHorizontal: hp('2%'),
    borderRadius: 5,
    marginTop: hp('1%'),
  },
  searchIcon: {
    width: 24,
    height: 24,
    marginRight: hp('2%'),
  },
  inputStyle: {
    justifyContent: 'center',
    width: '100%',
    color: '#000',
  },
  tabsUserArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(1),
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '60%',
  },
  tabsBtn: {
    width: wp(100) >= 1300 ? 150 : wp(100) > 1024 ? 130 : 130,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#A089E2',
    borderWidth: 2,
  },
  tabsBtnActive: {
    width: 130,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#A089E2',
    backgroundColor: '#A089E2',
    borderWidth: 2,
  },
  tabsBtnTextActive: {
    fontSize: hp(2.3),
    color: '#eee',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  tabsBtnText: {
    fontSize: hp(2.3),
    color: '#2b2b2b',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  cartUserArea: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '40%',
  },
  userIcon: {
    width: 30,
    height: 30,
    marginRight: hp('1%'),
  },
  arrowRightIcon: {
    width: 12,
    height: 6,
    marginHorizontal: 10,
  },
  userName: {
    fontSize: hp(2.3),
    color: '#353535',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  categoriesArea: {
    marginTop: '1%',
    width: '100%',
    height: wp(100) >= 1300 ? '40%' : wp(100) >= 1024 ? '40%' : '45%',
  },
  item: {
    height: '100%',
  },
  cartItemsListMain: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  itemProduct: {
    height: 350,
  },
  productsArea: {
    width: '100%',
    marginTop: '1%',
    height: hp('39.5%'),
  },
  categoriesListActive: {
    width:
      wp(100) >= 1300 ? wp('11%') : wp(100) >= 1024 ? wp('16%') : wp('16%'),
    marginRight: '1%',
    height: hp(100) >= 768 ? hp('17%') : hp('19.5%'),
    backgroundColor: '#62e1aa',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 20,
    borderRadius: 10,
  },
  categoriesList: {
    width:
      wp(100) >= 1300 ? wp('11%') : wp(100) >= 1024 ? wp('16%') : wp('16%'),
    marginRight: '1%',
    height: hp(100) >= 768 ? hp('17%') : hp('19.5%'),
    backgroundColor: '#c7c4c4',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 20,
    borderRadius: 10,
  },
  productList: {
    width:
      wp(100) >= 1300 ? wp('11%') : wp(100) >= 1024 ? wp('16%') : wp('16%'),
    marginRight: '1%',
    height:
      hp(100) >= 1024
        ? hp(19.5)
        : hp(100) > 552.8638200609188
        ? hp(19.5)
        : hp(27.5),
    backgroundColor: '#c7c4c4',
    alignItems: 'flex-start',
    paddingLeft: 10,
    borderRadius: 10,
    borderLeftWidth: 6,
    borderLeftColor: '#62e1aa',
  },
  productListCart: {
    width:
      wp(100) >= 1300 ? wp('11%') : wp(100) >= 1024 ? wp('16%') : wp('16%'),
    marginRight: '1%',
    height:
      hp(100) >= 1024
        ? hp(19.5)
        : hp(100) > 552.8638200609188
        ? hp(19.5)
        : hp(27.5),
    backgroundColor: '#62e1aa',
    alignItems: 'flex-start',
    paddingLeft: 10,
    borderRadius: 10,
    borderLeftWidth: 6,
    borderLeftColor: '#62e1aa',
  },
  categoriesText: {
    marginTop: '20%',
    fontSize: 20,
    color: '#2b2b2b',
    fontWeight: 'bold',
  },
  categoriesItemsText: {
    fontSize: 16,
    color: '#707070',
    fontWeight: 'bold',
  },
  productName: {
    fontSize: hp(2.3),
    color: '#2b2b2b',
    fontWeight: 'bold',
    textTransform: 'capitalize',
    width: '100%',
    height:
      hp(100) >= 1024 ? hp(7) : hp(100) > 552.8638200609188 ? hp(3) : hp(3),
  },
  productPrice: {
    marginTop: 5,
    fontSize: 16,
    color: '#2b2b2b',
    fontWeight: 'bold',
  },
  borderTop: {
    width: wp(100) >= 1300 ? '98%' : wp(100) >= 1024 ? '100%' : '100%',
    height: 1,
    backgroundColor: '#d2d2d2',
    marginVertical: 10,
  },
  productTopText: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  cartPlusMinus: {
    marginTop: '12%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    right: 8,
  },
  addToCartBtn: {
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#707070',
    justifyContent: 'center',
    alignItems: 'center',
    width: 29,
    height: 29,
  },
  deleteItem: {
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 29,
    height: 29,
  },
  minusImage: {
    width: 19,
    height: 19,
  },
  productCartCount: {
    fontSize: 20,
    marginHorizontal: 10,
  },
  tableArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#E9E5F6',
    paddingVertical: 10,
    marginTop: hp('1%'),
    height: hp(100) >= 1024 ? 60 : hp(100) >= 768 ? 40 : 40,
  },
  tableHeading: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowVioletIcon: {
    width: 15,
    height: 7,
    marginLeft: hp('1%'),
  },
  tableText: {
    fontSize: hp('2.2%'),
    color: '#2b2b2b',
    marginLeft: 10,
    fontWeight: 'bold',
  },

  tableItemMain: {
    position: 'absolute',
    top: hp(100) >= 1024 ? hp(5.7) : hp(100) >= 768 ? hp(5.5) : hp(6.7),
    left: hp(100) >= 1024 ? hp(15) : hp(100) >= 768 ? hp(15.5) : hp(17.7),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DBCEFF',
    padding: 2,
    zIndex: 2,
  },
  switchUserMain: {
    position: 'absolute',
    top: hp(100) >= 1024 ? hp(5) : hp(100) >= 768 ? hp(5.5) : hp(7.2),
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 2,
    zIndex: 3,
    width: 170,
  },
  switchSingle: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  disCountItemMain: {
    position: 'absolute',
    top: hp(100) > 552.8638200609188 ? hp(6.5) : hp(7.7),
    left:
      hp(100) >= 1024
        ? hp(10.5)
        : hp(100) > 552.8638200609188
        ? hp(11.5)
        : hp(14.7),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DBCEFF',
    padding: 2,
    zIndex: 5,
  },
  tableItemsText: {
    fontSize: hp('2.5%'),
    color: '#4C27B3',
    fontWeight: 'bold',
  },
  switchText: {
    fontSize:
      hp(100) >= 1024 ? hp(2) : hp(100) > 552.8638200609188 ? hp(2.5) : hp(2.5),
    color: '#000',
    fontWeight: 'bold',
  },
  tableItemSingle: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height:
      hp(100) >= 1024 ? hp('4%') : hp(100) >= 768 ? hp('4.4%') : hp('4.8%'),
  },
  cartMainView: {
    height: hp(100) >= 768 ? '86.6%' : '84%',
  },
  cartItemMain: {
    backgroundColor: '#fff',
    height: hp(100) >= 768 ? '53%' : '45%',
  },
  cartItemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#C0C0C0',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  cartItemList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#C0C0C0',
    paddingVertical: 5,
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  cartItemTopText: {
    fontSize: hp('2.1%'),
    color: '#2b2b2b',
    width: '33%',
    textAlign: 'left',
  },
  cartItemTopDate: {
    fontSize: hp('2.1%'),
    color: '#2b2b2b',
    width: '33%',
    textAlign: 'center',
  },
  cartItemTopTime: {
    fontSize: hp('2.1%'),
    color: '#2b2b2b',
    width: '33%',
    textAlign: 'right',
  },
  cartItemsDesc: {
    fontSize: hp('2.1%'),
    color: '#2b2b2b',
    fontWeight: 'bold',
    width: '45%',
    textAlign: 'left',
    textTransform: 'capitalize',
  },
  cartPlusMinusCart: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    right: 8,
    width: '35%',
  },
  cartItemsQty: {
    fontSize: hp('2.2%'),
    color: '#2b2b2b',
    fontWeight: 'bold',
    textAlign: 'center',
    width: '45%',
  },
  cartItemsTotal: {
    fontSize: hp('2%'),
    color: '#2b2b2b',
    fontWeight: 'bold',
    textAlign: 'right',
    width: '20%',
  },

  cartItemDescTextDesc: {
    fontSize: hp('2.2%'),
    color: '#25077B',
    fontWeight: 'bold',
  },
  cartItemDescText: {
    fontSize: hp('2.2%'),
    color: '#25077B',
    fontWeight: 'bold',
  },
  cartItemDescTextQty: {
    fontSize: hp('2.2%'),
    color: '#25077B',
    fontWeight: 'bold',
    textAlign: 'left',
    width: '7%',
  },
  contentContainerFlatListStyle: {
    height: '100%',
  },
  discountAreaMain: {
    width: '100%',
    height:
      hp(100) >= 1024 ? hp('37%') : hp(100) >= 768 ? hp('36.5%') : hp('44%'),
    backgroundColor: '#E9E5F6',
  },
  btnAreaDiscounts: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: hp(100) >= 768 ? hp('1.2%') : hp('1%'),
  },
  discountBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#62E1AA',
    borderRadius: 5,
  },
  discountBtnText: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    color: '#25077B',
  },
  creditTaxMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginVertical:
      hp(100) >= 1024 ? hp('1.4%') : hp(100) >= 768 ? hp('1.2%') : hp('1.2%'),
  },
  creditTaxTextOne: {
    color: '#2b2b2b',
    fontSize:
      hp(100) >= 1024 ? hp('2.1%') : hp(100) >= 768 ? hp('2.2%') : hp('2.2%'),
    fontWeight: 'bold',
    width: '30%',
  },
  creditTaxTextTotalRow: {
    width: '10%',
  },
  creditTaxTextTwo: {
    color: '#2b2b2b',
    fontSize:
      hp(100) >= 1024 ? hp('2.1%') : hp(100) >= 768 ? hp('2.2%') : hp('2.2%'),
    fontWeight: 'bold',
    width: '30%',
    paddingLeft: 20,
  },
  creditTaxTextTwoTotal: {
    color: '#2b2b2b',
    fontSize: 20,
    fontWeight: 'bold',
    width: '50%',
    paddingLeft: 20,
  },
  creditTaxText: {
    color: '#2b2b2b',
    fontSize:
      hp(100) >= 1024 ? hp('2.1%') : hp(100) >= 768 ? hp('2.2%') : hp('2.2%'),
    fontWeight: 'bold',
    width: '20%',
    textAlign: 'right',
  },
  creditTaxTextTotal: {
    color: '#2b2b2b',
    fontSize: 20,
    fontWeight: 'bold',
    width: '30%',
    textAlign: 'right',
  },
  noCartItem: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(100) >= 768 ? hp('15%') : hp('9%'),
  },
  noCartItemText: {
    fontSize: 20,
    color: '#4C27B3',
    fontWeight: 'bold',
  },
  loader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  modalComment: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    opacity: 0.2,
    position: 'absolute',
    top: 10,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  commentModalBox: {
    width: '90%',
    height: 390,
    backgroundColor: '#fff',
    position: 'absolute',
    zIndex: 5,
    top: hp(100) >= 1024 ? hp('27%') : hp(100) >= 768 ? hp('20%') : hp('9%'),
    alignSelf: 'center',
  },
  commentInput: {
    height: hp(7),
    fontSize: hp('3%'),
    paddingLeft: hp(2),
    marginTop: 20,
    marginBottom: 20,
  },
  commentButtonRow: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 20,
    marginTop:
      hp(100) >= 1024 ? hp('20%') : hp(100) >= 768 ? hp('30%') : hp('45%'),
  },
  cancelBtn: {
    width: 120,
    borderColor: '#62E1AA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 10,
  },
  sendBtn: {
    width: 120,
    backgroundColor: '#62E1AA',
    borderColor: '#62E1AA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 10,
  },
  cancelSendText: {
    fontSize: hp('2.1%'),
    color: '#2b2b2b',
    fontWeight: 'bold',
  },
  maskViewModal: {
    width: '101.5%',
    height: '100%',
    backgroundColor: '#000000',
    opacity: 0.2,
    position: 'absolute',
    zIndex: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBoxContainer: {
    width: '68.5%',
    height: '80%',
    position: 'absolute',
    zIndex: 7,
    alignItems: 'center',
    top: '8%',
    backgroundColor: '#fff',
    left: '15%',
  },

  calHeader: {
    backgroundColor: '#A089E2',
    height: '10%',
    width: '100%',
    justifyContent: 'center',
  },
  calHeaderText: {
    textAlign: 'left',
    color: '#fff',
    fontSize: hp('2.5'),
    paddingLeft: 20,
    fontWeight: 'bold',
  },
  calBody: {
    height: '90%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  numView: {
    width: '55%',
    height: '100%',
    paddingRight: 20,
  },
  main_screen: {
    display: 'flex',
    flexDirection: 'column',
    width: '45%',
    height: '100%',
    alignItems: 'center',
    borderLeftWidth: 2,
    padding: 20,
    borderLeftColor: '#ddd',
  },
  main_screen__display: {
    marginBottom: 10,
    padding: 10,
    height: '50%',
    width: '100%',
  },
  main_screen__display_text: {
    fontSize: hp('4.1%'),
    textAlign: 'left',
  },
  main_screen__display_text_total: {
    fontSize: hp('5.1%'),
    textAlign: 'left',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#4C27B3',
    paddingLeft: 40,
    width: '100%',
  },
  main_screen_display_total: {
    width: '100%',
  },
  main_screen__keypad: {
    width: '100%',
    height: '100%',
    display: 'flex',
  },
  totalCalcText: {
    fontSize: hp('4.5%'),
    fontWeight: 'bold',
    color: '#4C27B3',
    paddingLeft: 50,
  },
  main_screen__keypad_row: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'white',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btn_outer: {
    width: 40,
    height: hp(100) >= 1024 ? 90 : hp(100) >= 768 ? 65 : 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bg_button: {
    backgroundColor: 'white',
    color: 'black',
    fontSize: hp('4.5%'),
    fontWeight: 'bold',
  },

  btn1_outer: {
    width: wp(100) >= 1300 ? 80 : wp(100) >= 1024 ? 65 : 50,
    height: hp(100) >= 1024 ? 90 : hp(100) >= 768 ? 65 : 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bg1_button: {
    color: '#FF5757',
    fontSize: hp('4.5%'),
    fontWeight: 'bold',
  },

  bg1_button_back: {
    color: '#FF5757',
    fontSize: hp('4.5%'),
    fontWeight: 'bold',
    marginTop: 5,
  },

  btn2_outer: {
    width: wp(100) >= 1300 ? 80 : wp(100) >= 1024 ? 65 : 50,
    height: hp(100) >= 1024 ? 90 : hp(100) >= 768 ? 65 : 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bg2_button: {
    color: '#FF5757',
    fontSize: hp('4.5%'),
    fontWeight: 'bold',
  },
  btn2_outer_equal: {
    width: wp(100) >= 1300 ? 70 : wp(100) >= 1024 ? 65 : 50,
    height: hp(100) >= 1024 ? 70 : hp(100) >= 768 ? 65 : 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5757',
    borderRadius: 100,
    borderWidth: 5,
    borderColor: '#FFD8D7',
  },
  bg2_button_equal: {
    color: '#fff',
    fontSize: hp('4.5%'),
    fontWeight: 'bold',
    marginTop: -4,
  },
  commentButtonRowCalc: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: '17%',
  },
  cardBody: {
    height: '90%',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successImageStyle: {
    width: 82,
    height: 82,
  },
  cardBodyMainText: {
    marginTop: '2%',
  },
  cardPaymentTitle: {
    fontSize: hp('3.5%'),
    fontWeight: 'bold',
  },
  cardPaymentText: {
    fontSize: hp('3.2%'),
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: '1%',
  },
  cardReceiptMain: {
    marginTop: '5%',
    flexDirection: 'row',
  },
  noReceiptBtn: {
    width: 220,
    borderColor: '#62E1AA',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 20,
  },
  printBtn: {
    width: 220,
    backgroundColor: '#62E1AA',
    borderColor: '#62E1AA',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 10,
  },
  modalPinBoxContainer: {
    width: '40.5%',
    height: '80%',
    position: 'absolute',
    zIndex: 7,
    alignItems: 'center',
    justifyContent: 'center',
    top: '8%',
    backgroundColor: '#311384',
    left: '28%',
    borderRadius: 10,
  },
  pinTextMain: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  pinText: {
    color: '#fff',
    fontSize: hp(2.3),
    fontWeight: 'bold',
  },
  pinAreaDisplay: {
    marginVertical: '5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pinDot: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: '18%',
  },
  pinRemove: {
    width: '20%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: '5%',
  },
  code: {
    width: 13,
    height: 13,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#fff',
    marginHorizontal: 25,
  },
  fillCode: {
    width: 13,
    height: 13,
    borderRadius: 13,
    backgroundColor: '#fff',
    marginHorizontal: 25,
  },
  numWrapper: {
    width: wp(100) >= 1300 ? '90%' : wp(100) >= 1024 ? '100%' : '80%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
    right: wp(100) >= 1300 ? '6.8%' : wp(100) >= 1024 ? '4.5%' : '7.5%',
  },
  number: {
    width: wp(100) >= 1300 ? 110 : wp(100) >= 1024 ? 100 : 70,
    height: wp(100) >= 1300 ? 60 : wp(100) >= 1024 ? 60 : 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6E44E2',
    marginVertical: '3%',
    marginHorizontal: '2%',
  },
  numberOk: {
    width: wp(100) >= 1300 ? 110 : wp(100) >= 1024 ? 100 : 70,
    height: wp(100) >= 1300 ? 60 : wp(100) >= 1024 ? 60 : 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#62E1AA',
    marginVertical: '3%',
    marginHorizontal: '2%',
  },
  numberText: {
    color: '#fff',
    fontSize: wp(100) >= 1300 ? 36 : wp(100) >= 1024 ? 30 : 20,
    textAlign: 'center',
  },
  numberTextOk: {
    color: '#4C27B3',
    fontSize: wp(100) >= 1300 ? 36 : wp(100) >= 1024 ? 30 : 20,
    textAlign: 'center',
  },
})
