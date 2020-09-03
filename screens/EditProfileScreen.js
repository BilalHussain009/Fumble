import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, Image, TouchableNativeFeedback, TextInput } from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import HeaderButton from '../components/HeaderButton'
import { useSelector,useDispatch } from 'react-redux'
import * as userActions from '../store/actions/user'
import axios from 'axios'
import colors from '../constants/Colors'

const EditProfileScreen = (props) => {
    const dispatch=useDispatch()
    const displayMode = useSelector((state) => state.user.displayMode)

    const [name, setName] = useState(props.navigation.getParam('name'))
    const [email, setEmail] = useState(props.navigation.getParam('email'))
    const [bio,setBio]=useState(props.navigation.getParam('bio'))
    useEffect(()=>{
        props.navigation.setParams({ displayMode })

    },[displayMode])
    useEffect(() => {
        props.navigation.setParams({ handleSubmit });
        props.navigation.setParams({ name1:props.navigation.getParam('name') })
        props.navigation.setParams({ email1:props.navigation.getParam('email') })
        props.navigation.setParams({ bio1:props.navigation.getParam('bio') })
    }, [])
    const userToken = useSelector((state) => state.user.userToken)


    const nameHandler = (text) => {
        props.navigation.setParams({ name1:text })
        setName(text)
    }
    const emailHandler = text => {
        props.navigation.setParams({ email1:text })
        setEmail(text)
    }
    const bioHandler = text => {
        props.navigation.setParams({ bio1:text })
        setBio(text)
    }
    const handleSubmit = (name1,email1,bio1) => {
        const headers = {
            'Authorization': 'Bearer ' + userToken,
            'Content-Type': 'application/json'
        }
        axios({
            method: 'patch',
            url: 'http://192.168.100.5:3000/user/updateProfile',
            data: {
                name: name1,
                email: email1,
                bio: bio1,

            },
            headers
        }).then(() => {
            console.log("Updated Profile")
            dispatch(userActions.updateUserProfile(name1,email1,bio1))
        })
            .catch(() => console.log("Profile Update Failed"))
    }
    return (
        <View style={[styles.screen, displayMode == true ? { backgroundColor: colors.backgroundColorDark } :
            { backgroundColor: colors.backgroundColorLight }]}>
            <View style={styles.profileContainer}>
                <Image style={styles.profilePhoto} source={{ uri: 'https://www.imgawards.com/wp-content/uploads/2015/06/imga-international_mobile_gaming_awards-16th-edition-2020.png' }} />
                <TouchableNativeFeedback>
                    <Text style={styles.changeDp}>Change Display Picture</Text>
                </TouchableNativeFeedback>

            </View>
            <View style={styles.userInfo}>
                <View >
                    <Text style={styles.inputLabel}>
                        User Name
                </Text>
                    <TextInput style={[styles.input, displayMode == true ? { color: colors.textColorDark } :
            { color: colors.textColorLight }]} onChangeText={nameHandler} value={name} />
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.inputLabel}>
                        Email Address
                    </Text>
                    <TextInput style={[styles.input, displayMode == true ? { color: colors.textColorDark } :
            { color: colors.textColorLight }]} onChangeText={emailHandler} value={email} />
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.inputLabel}>
                        Website
                    </Text>
                    <TextInput style={[styles.input, displayMode == true ? { color: colors.textColorDark } :
            { color: colors.textColorLight }]} />
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.inputLabel}>
                        Bio
                    </Text>
                    <TextInput style={[styles.input, displayMode == true ? { color: colors.textColorDark } :
            { color: colors.textColorLight }]} onChangeText={bioHandler} value={bio} />
                </View>

            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    infoContainer: {
        marginTop: 30
    },

    userInfo: {
        marginTop: 50,
        paddingHorizontal: 20
    },
    inputLabel: {
        fontFamily: 'Lato-Regular',
        fontSize: 13,
        color: '#ccc'
    },
    input: {
        fontFamily: 'Lato-Regular',
        fontSize: 15,
        borderColor: 'black',
        borderBottomWidth: 1,
        
    },
    changeDp: {
        fontFamily: 'Lato-Regular',
        fontSize: 16,
        marginTop: 10,
        color: '#34ace0'
    },
    screen: {
        flex:1,
    },
    profileContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:100
    },
    profilePhoto: {
        width: 100,
        height: 100,
        borderRadius: 1000
    }
})
EditProfileScreen.navigationOptions = navData => {
    return {
        headerLeft: <HeaderButtons HeaderButtonComponent={HeaderButton} >
            <Item title='Menu' iconName='md-close' color={navData.navigation.getParam('displayMode')==true?colors.textColorDark:colors.textColorLight} iconSize={26} onPress={() => {
                navData.navigation.goBack()
            }} />
        </HeaderButtons>,
        headerRight: <HeaderButtons HeaderButtonComponent={HeaderButton} >
            <Item title='Menu' iconName='md-checkmark' color={navData.navigation.getParam('displayMode')==true?colors.textColorDark:colors.textColorLight} iconSize={26} onPress={() => {
                let tempFunc=navData.navigation.getParam('handleSubmit')
                tempFunc(navData.navigation.getParam('name1'),navData.navigation.getParam('email1'),navData.navigation.getParam('bio1'))
                navData.navigation.goBack()
            }} />
        </HeaderButtons>,
        headerStyle: {
            backgroundColor: navData.navigation.getParam('displayMode')==true?colors.backgroundColorDark:
            colors.backgroundColorLight,

        },
        headerTitleStyle: {
            color: navData.navigation.getParam('displayMode')==true?colors.textColorDark:colors.textColorLight
        },
        headerTitle: 'Edit Profile'
    }
}
export default EditProfileScreen