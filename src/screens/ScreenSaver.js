import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import React, {useEffect, useState} from 'react'
import moment from 'moment'
import Fontisto from 'react-native-vector-icons/Fontisto'
import Header from '../components/Header'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

const ScreenSaver = ({setShow}) => {
  const [time, setTime] = useState(null)

  useEffect(() => {
    const secTimer = setInterval(() => {
      setTime(moment().format('h:mm:ss'))
    }, 1000)
    return () => clearInterval(secTimer)
  }, [])
  return (
    <View style={styles.container}>
      <View style={styles.backArea}>
        <TouchableOpacity
          onPress={() => setShow(false)}
          style={styles.backContent}>
          <Fontisto name="arrow-left-l" color="#fff" size={25} />
          <Text style={styles.goBackText}>Go back</Text>
        </TouchableOpacity>
      </View>

      <Header />

      <View style={styles.dateTimeArea}>
        <Text style={styles.timeText}>{time}</Text>
      </View>

      <View style={styles.dateArea}>
        <Text style={styles.dateText}>{moment().format('MMMM, DD, YYYY')}</Text>
      </View>
    </View>
  )
}

export default ScreenSaver

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4C27B3',
    width: wp(100),
    height: hp(100),
    flex: 1,
  },
  backArea: {
    paddingHorizontal: wp(3),
    justifyContent: 'flex-start',
    paddingTop: hp(4),
  },
  backContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goBackText: {
    marginLeft: hp(3),
    fontSize: hp(2.7),
    color: '#fff',
  },
  dateTimeArea: {
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(50),
    width: wp(100),
  },
  dateArea: {
    marginTop: hp(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    fontSize: hp(28),
    color: '#fff',
    letterSpacing: hp('2%'),
    fontFamily: 'DS-Digital',
    textAlign: 'center',
  },
  dateText: {
    fontSize: hp(5),
    color: '#fff',
    letterSpacing: hp(0.3),
    fontFamily: 'Manrope-Regular',
  },
})
