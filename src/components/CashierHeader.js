import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native'
import React, {useState, useEffect} from 'react'
import {useNavigation} from '@react-navigation/native'
const Logo = require('../../assets/images/troo-logo.png')
const Logout = require('../../assets/images/logout.png')
const Settings = require('../../assets/images/settings-icon.png')
const Down = require('../../assets/images/down-arrow.png')
const Up = require('../../assets/images/up-arrow.png')
const Sync = require('../../assets/images/sync.png')
const SyncLine = require('../../assets/images/sync-line.png')
const ToggleOn = require('../../assets/images/toggle-one.png')
const ToggleOff = require('../../assets/images/toggle-off.png')

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

const CashierHeader = ({handleLogout}) => {
  const navigation = useNavigation()
  const [toolsHeader, setToolsHeader] = useState(false)
  const [settingsHeader, setSettingsHeader] = useState(false)
  const [syncOn, setSyncOn] = useState(true)
  const [syncOff, setSyncOff] = useState(false)

  return (
    <View style={styles.headerMain}>
      <View style={styles.headerRow}>
        <View style={styles.logoArea}>
          <Image
            source={Logo}
            style={styles.logoStyle}
            width={wp('8%')}
            height={hp(7)}
            resizeMode="contain"
          />

          <TouchableOpacity
            style={styles.modulesBtn}
            onPress={() => navigation.navigate('TillScreen')}>
            <Text style={styles.modulesText}>Till</Text>
            <View style={styles.borderBtn}></View>
          </TouchableOpacity>
        </View>

        <View style={styles.settingsArea}>
          <TouchableOpacity
            style={styles.settingsIconButton}
            onPress={() => {
              setToolsHeader(!toolsHeader)
              setSettingsHeader(false)
            }}>
            <Text style={styles.modulesText}>Tools</Text>

            <Image
              source={toolsHeader ? Up : Down}
              style={styles.iconRightStyle}
              width={15}
              height={7}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsIconButton}
            onPress={() => {
              setSettingsHeader(!settingsHeader)
              setToolsHeader(false)
            }}>
            <Image
              source={Settings}
              style={styles.iconStyle}
              width={29}
              height={29}
              resizeMode="contain"
            />
            <Text style={styles.modulesText}>Settings</Text>

            <Image
              source={settingsHeader ? Up : Down}
              style={styles.iconRightStyle}
              width={15}
              height={7}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsIconButton}
            onPress={() => handleLogout()}>
            <Image
              source={Logout}
              style={styles.iconStyle}
              width={29}
              height={29}
              resizeMode="contain"
            />
            <Text style={styles.modulesText}>Logout</Text>
          </TouchableOpacity>

          {toolsHeader && (
            <View style={styles.toolsItem}>
              <TouchableOpacity style={styles.toolsBtn}>
                <Text style={styles.toolBoxItemText}>Restaurant manager</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolsBtn}>
                <Text style={styles.toolBoxItemText}>Test print</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolsBtnLastChild}>
                <Text style={styles.toolBoxItemText}>End of day summary</Text>
              </TouchableOpacity>
            </View>
          )}
          {settingsHeader && (
            <View style={styles.settingsItem}>
              <View style={styles.syncImgText}>
                <Image
                  source={Sync}
                  style={styles.iconStyleSync}
                  width={27}
                  height={27}
                  resizeMode="contain"
                />
                <Text style={styles.syncText}>Sync to cloud</Text>
              </View>

              <Image
                source={SyncLine}
                style={styles.lineStyle}
                width={215}
                height={2}
                resizeMode="contain"
              />

              <Text style={styles.syncSwitchText}>Switch between modes</Text>

              <TouchableOpacity
                style={styles.OnLnOffMain}
                onPress={() => {
                  setSyncOn(true)
                  setSyncOff(false)
                }}>
                {syncOn ? (
                  <Image
                    source={ToggleOn}
                    style={styles.iconStyleSyncOnOff}
                    width={27}
                    height={27}
                    resizeMode="contain"
                  />
                ) : (
                  <Image
                    source={ToggleOff}
                    style={styles.iconStyleSyncOnOff}
                    width={27}
                    height={27}
                    resizeMode="contain"
                  />
                )}

                <Text style={syncOn ? styles.onlineText : styles.offlineText}>
                  Online
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.OnLnOffMain}
                onPress={() => {
                  setSyncOn(false)
                  setSyncOff(true)
                }}>
                {syncOff ? (
                  <Image
                    source={ToggleOn}
                    style={styles.iconStyleSyncOnOff}
                    width={27}
                    height={27}
                    resizeMode="contain"
                  />
                ) : (
                  <Image
                    source={ToggleOff}
                    style={styles.iconStyleSyncOnOff}
                    width={27}
                    height={27}
                    resizeMode="contain"
                  />
                )}
                <Text style={syncOff ? styles.onlineText : styles.offlineText}>
                  Offline
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

export default CashierHeader

const styles = StyleSheet.create({
  headerMain: {
    backgroundColor: '#4C27B3',
    width: '100%',
    paddingLeft: '2%',
    zIndex: 1,
    height: '8%',
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logoArea: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  settingsArea: {
    width: '46%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
  },
  settingsIconButton: {
    flexDirection: 'row',
    marginHorizontal: '3%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modulesBtn: {
    marginLeft: '5%',
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  borderBtn: {
    marginTop: '6.5%',
    width: '45%',
    height: '7%',
    backgroundColor: '#62E1AA',
    borderRadius: 10,
  },
  modulesText: {
    color: '#fff',
    fontSize: hp(2.4),
    fontWeight: 'bold',
  },
  logoStyle: {
    width: wp(8),
    height: hp(7),
    marginTop: hp(1),
  },
  iconStyle: {
    width: 29,
    height: 29,
    marginRight: hp(1),
  },
  lineStyle: {
    width: hp(22),
    height: 2,
    marginVertical: hp(2),
    alignSelf: 'center',
  },
  iconStyleSync: {
    width: 29,
    height: 29,
    marginRight: hp(2),
  },
  iconStyleSyncOnOff: {
    width: 48,
    height: 26,
    marginRight: hp(2),
  },
  iconRightStyle: {
    width: 15,
    height: 7,
    marginLeft: hp(1),
  },
  settingsItem: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 10,
    position: 'absolute',
    zIndex: 2,
    right:
      hp(100) >= 1024
        ? hp(16.7)
        : hp(100) > 552.8638200609188
        ? hp(17.5)
        : hp(22.2),
    top: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#4C27B3',
    borderWidth: 1,
  },
  toolsItem: {
    backgroundColor: '#fff',
    padding: 20,
    position: 'absolute',
    zIndex: 2,
    right:
      hp(100) >= 1024 ? hp(36) : hp(100) > 552.8638200609188 ? hp(38) : hp(47),
    top: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#4C27B3',
    borderWidth: 1,
  },
  toolsBtn: {
    marginBottom: hp(7),
  },
  toolsBtnLastChild: {
    marginBottom: 0,
  },
  toolBoxItemText: {
    fontSize: hp(3),
    color: '#25077B',
    fontFamily: 'Manrope-Bold',
  },
  syncImgText: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  syncText: {
    fontSize: hp(2.5),
    color: '#4C27B3',
    fontWeight: 'bold',
  },
  syncSwitchText: {
    fontSize: hp(2),
    color: '#4C27B3',
    fontWeight: 'bold',
  },
  OnLnOffMain: {
    marginVertical: hp(2),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineText: {
    fontSize: hp(3),
    color: '#4C27B3',
    fontWeight: 'bold',
  },
  offlineText: {
    fontSize: hp(3),
    color: '#C5C1D2',
    fontWeight: 'bold',
  },
})
