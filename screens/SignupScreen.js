import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, Button, ScrollView, Dimensions, SafeAreaView,ActivityIndicator } from 'react-native'
import { addToken, getToken } from '../helpers/db'
import * as userActions from '../store/actions/user'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import Colors from '../constants/Colors'
import CustomButton from '../components/CutomButton'
import { colors } from 'react-native-elements'
const SignupScreen = (props) => {
    const [pass, setPass] = useState()
    const [email, setEmail] = useState()
    const [process, setProcess] = useState(false)

    const [userName, setUserName] = useState()
    const dispatch = useDispatch()
    const handlePass = (text) => {
        setPass(text)
    }
    const handleEmail = text => {
        setEmail(text)
    }
    const handleUserName = text => {
        setUserName(text)
    }
    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const dbResult = await getToken()
                if (dbResult.rows._array.length !== 0) {
                    props.navigation.navigate('Profile')
                }
            }
            catch (e) {
                return
            }
        }
        checkLoggedIn()
    }, [])
    const handleSignup = () => {
        setProcess(true)

        axios({
            method: 'post',
            url: 'http://192.168.100.5:3000/users',
            headers: {},
            data: {
                name: userName,
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
                    dispatch(userActions.setUserProfile(r.data.rest.name, r.data.rest.email, userId, token, r.data.rest.following, r.data.post, r.data.dp, r.data.rest.bio,r.data.rest.followers))
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
            console.log("Error")
        });
    }
    const handleSignInRequest = () => {
        props.navigation.navigate('Login')
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>

            <ScrollView >
                {process == true ? <View style={styles.processContainer}>
                    <ActivityIndicator size='large' />
                    <Text style={styles.processText}>Signing Up</Text></View> :
                    <View style={styles.screen}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Sign Up</Text>
                    </View>
                    <TextInput placeholder='Enter UserName'
                        value={userName}
                        style={styles.inputField}
                        onChangeText={handleUserName}
                    />
                    <TextInput placeholder='Enter Email'
                        value={email}
                        style={styles.inputField}
                        onChangeText={handleEmail} />
                    <TextInput placeholder='Enter Password'
                        value={pass}
                        style={styles.inputField}
                        onChangeText={handlePass}
                        secureTextEntry={true} />

                    <View style={styles.buttonContainer}>
                        <CustomButton
                            onPress={handleSignup}
                            backColor={Colors.primary}
                            button={{ paddingHorizontal: 30 }}>Sign Up</CustomButton>
                    </View>
                    <View style={styles.goToSignIn}>
                        <Text style={styles.signInText}>Already Registered?</Text>
                        <CustomButton onPress={handleSignInRequest} backColor='#fd79a8'
                            button={{ paddingHorizontal: 30 }}>Sign In</CustomButton>
                    </View>
                </View>}
            </ScrollView>
        </SafeAreaView>
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
        marginTop: Dimensions.get('window').height / 100 * 15,
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
export default SignupScreen