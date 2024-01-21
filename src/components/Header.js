import {StyleSheet, View, Image} from 'react-native'
import React from 'react'
const Logo = require('../../assets/images/troo-logo.png')

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

const Header = () => {
  return (
    <View style={styles.headerMain}>
      <Image
        source={Logo}
        style={styles.logoStyle}
        width={190}
        height={100}
        resizeMode="contain"
      />
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
  headerMain: {
    backgroundColor: '#4C27B3',
    width: wp(100),
    height: hp(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoStyle: {
    width: wp(30),
    height: hp(15),
  },
})
