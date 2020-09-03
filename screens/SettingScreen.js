import React, { useState,useEffect } from 'react'
import { View, StyleSheet, Text, Switch, Button } from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { useSelector, useDispatch } from 'react-redux'
import HeaderButton from '../components/HeaderButton'
import colors from '../constants/Colors'

import * as userActions from '../store/actions/user'
import { removeToken } from '../helpers/db'
import HeaderConfig from '../models/HeaderConfig'

const SettingScreen = (props) => {
    const dispatch = useDispatch()
    const [colorTheme, setColorTheme] = useState(false)
    const displayMode = useSelector((state) => state.user.displayMode)
    useEffect(() => {
        props.navigation.setParams({ displayMode })

    },[displayMode])
    const handleLogout = () => {
        dispatch(userActions.resetUser())
        console.log("JEJEJ")
        removeToken().then((res) => {
            props.navigation.navigate('Login')
        }).catch((e) => {
            props.navigation.navigate('Login')
        })

    }
    const handleColorMode = (theme) => {
        if (theme == true) {
            dispatch(userActions.toggleDisplay(true))
            setColorTheme(true)
        }
        if (theme == false) {
            dispatch(userActions.toggleDisplay(false))
            setColorTheme(false)
        }
    }
    return (
        <View style={[styles.screen, displayMode == true ? { backgroundColor: colors.backgroundColorDark } : { backgroundColor: colors.backgroundColorLight }]}>
            <Text style={[styles.label, displayMode == true ?
                { color: colors.textColorDark } :
                { color: colors.textColorLight }]}>
                Enable Dark Mode
            </Text>
            <Switch value={colorTheme} onValueChange={() => handleColorMode(!colorTheme)} />
            <Button title="Logout" onPress={handleLogout} />
        </View>
    )
}
const styles = StyleSheet.create({
    screen: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    label: {
        fontFamily: 'Lato-Regular',
        fontSize: 15
    }
})
SettingScreen.navigationOptions = navData => {
    return {
        headerStyle: {
            backgroundColor: navData.navigation.getParam('displayMode') == true ? colors.backgroundColorDark :
                colors.backgroundColorLight
        },
        headerTitle: navData.navigation.getParam('userEmail'),
        headerTitleStyle: {
            color: navData.navigation.getParam('displayMode') == true ? colors.textColorDark :
                colors.textColorLight
        },
        headerRight: <HeaderButtons HeaderButtonComponent={HeaderButton} >
            <Item title='Menu' iconName='md-menu' color={navData.navigation.getParam('displayMode') == true ?
                colors.textColorDark : colors.textColorLight} iconSize={30} onPress={() => {
                    navData.navigation.toggleDrawer()
                }} />
        </HeaderButtons>
    }
}
export default SettingScreen