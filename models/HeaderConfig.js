import React from 'react'
import { Text } from 'react-native'

import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import HeaderButton from '../components/HeaderButton'
import colors from '../constants/Colors'
const styles = {
    logo: {
        fontFamily: 'Logo',
        color: 'white',
        fontSize: 22,
        fontWeight: '500',
        marginLeft: 10,
        marginTop: 4
    }
}
export default (navData, displayMode) => {
    return ({
        headerStyle: {
            backgroundColor: displayMode==true?colors.backgroundColorDark:'#ff6b81'
        },
        defaultNavigationOptions: {
            headerTintColor: 'white'

        },
        headerLeft: <HeaderButtons HeaderButtonComponent={HeaderButton} >
            <Item title='Menu' iconName='logo-foursquare' color="white" iconSize={34} onPress={() => {
            }} />
            <Text style={styles.logo}>Fumble</Text>
        </HeaderButtons>
    })
}