import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, Dimensions, ScrollView, ActivityIndicator } from 'react-native'
import CustomButton from '../components/CutomButton'
import { addToken } from '../helpers/db'
import { useDispatch, useSelector } from 'react-redux'
import * as userActions from '../store/actions/user'

import colors from '../constants/Colors'
import axios from 'axios'
const LoginScreen = (props) => {
    const dispatch = useDispatch()
    const [pass, setPass] = useState('')
    const [email, setEmail] = useState('')
    const [loginError, setLoginError] = useState(false)
    const [loginErrorMessage, setLoginErrorMessage] = useState('')
    const [process, setProcess] = useState(false)
    const displayMode = useSelector((state) => state.user.displayMode)

    const handlePass = (text) => {
        setLoginError(false)
        setPass(text)
    }
    const handleEmail = text => {
        setLoginError(false)
        setEmail(text)
    }
    const handleSignIn = () => {
        try {
            const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if (filter.test(email) == false) {
               
                throw "Email is not Valid"
            }
            else if (pass.length == 0) {

                throw "Pass is not Valid"
            }

            setProcess(true)
            axios({
                method: 'post',
                url: 'http://192.168.100.5:3000/users/login',
                headers: {},
                data: {
                    email: email,
                    password: pass // This is the body part
                }
            }).then((res) => {
                addToken(res.data.token, res.data._id).then(() => {

                    const headers = {
                        'Authorization': 'Bearer ' + res.data.token,
                        'Content-Type': 'application/json'
                    }
                    axios({
                        method: 'post',
                        url: `http://192.168.100.5:3000/user/me/profile`,
                        headers
                    }).then((r) => {
                        dispatch(userActions.setUserProfile(r.data.rest.name, r.data.rest.email, res.data._id, res.data.token, r.data.rest.following, r.data.post, r.data.dp, r.data.rest.bio,r.data.rest.followers))
                        axios({
                            method: 'post',
                            url: `http://192.168.100.5:3000/posts/followingPosts`,
                            headers
                        }).then((res) => { dispatch(userActions.setFollowingPosts(res.data.posts)) })
                            .catch(() => console.log("Array fetch failed"))
                        props.navigation.navigate("profile")
                        setProcess(false)


                    }).catch((e) => {
                        console.log("Error in initial login")
                        setProcess(false)
                    })

                })

            }).catch((e) => {


                setProcess(false)
                setLoginErrorMessage("Wrong Email or Password")
                setLoginError(true)
            })
        }
        catch (e) {
            switch (e) {
                case "Pass is not Valid":
                    console.log("From Switch Pass")
                    setLoginErrorMessage("Password field is empty")
                    setLoginError(true)
                    break
                case "Email is not Valid":
                    console.log("From Switch Email")
                    setLoginErrorMessage("Email is not Valid")
                    setLoginError(true)
                    break
               


            }
        }
    }
    const handleSignUpRequest = () => {
        props.navigation.navigate('Signup')
    }
    return (
        <ScrollView>
            <View >
                {process == true ? <View style={styles.processContainer}>
                    <ActivityIndicator size='large' />
                    <Text style={styles.processText}>Logging In</Text></View> :
                    <View style={[styles.screen, displayMode == true ? { backgroundColor: "black" } :
                        { backgroundColor: colors.backgroundColorLight }]}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>Sign In</Text>
                        </View>
                        {loginError == true ? <Text style={{ color: '#d63031' }}>{loginErrorMessage}</Text> :
                            <Text>{undefined}</Text>}
                        <TextInput placeholder='Enter Email'
                            value={email}
                            style={[styles.inputField, displayMode == true ? { borderColor: colors.textColorDark } :
                                { borderColor: colors.textColorLight }]}
                            onChangeText={handleEmail} />
                        <TextInput placeholder='Enter Password'
                            value={pass}
                            style={[styles.inputField, displayMode == true ? { borderColor: colors.textColorDark } :
                                { borderColor: colors.textColorLight }]}
                            onChangeText={handlePass}
                            secureTextEntry={true} />

                        <View style={styles.buttonContainer}>
                            <CustomButton button={{ paddingHorizontal: 30 }} onPress={handleSignIn} backColor={colors.primary}>Sign In</CustomButton>
                        </View>
                        <View style={styles.goToSignIn}>
                            <Text style={styles.signInText}>New User?</Text>
                            <CustomButton button={{ paddingHorizontal: 30 }} onPress={() => handleSignUpRequest()} backColor='#fd79a8' >Sign Up</CustomButton>
                        </View>
                    </View>}
            </View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({

    titleContainer: {
        marginBottom: 20
    },
    title: {
        fontSize: 32,
        fontFamily: 'Lato-Bold'
    },
    screen: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        marginTop: Dimensions.get('window').height / 100 * 15
    },
    inputField: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        width: '80%',
        paddingHorizontal: 10,
        marginVertical: 20,
        fontFamily: 'Lato-Regular',
        fontSize: 14
    },
    buttonContainer: {
        marginVertical: 20,
        overflow: 'hidden'
    },
    goToSignIn: {
        marginVertical: 20,
        overflow: 'hidden',
        alignItems: 'center'
    },
    signInText: {
        fontFamily: 'Lato-Regular',
        marginBottom: 20
    },
    container: {
        flex: 1,
    },
    processContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Dimensions.get('window').height / 100 * 40
    },
    processText: {
        fontSize: 17,
        fontFamily: 'Lato-Regular'
    }
})
export default LoginScreen