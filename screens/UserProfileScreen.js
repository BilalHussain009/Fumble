import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, ActivityIndicator, ScrollView, Dimensions, Button } from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import HeaderButton from '../components/HeaderButton'
import CustomButton from '../components/CutomButton'
import ProfileImage from '../components/ProfileImage'
import YourPosts from '../components/YourPosts'

import colors from '../constants/Colors'
import axios from 'axios'
import { useSelector } from 'react-redux'
const windowWidth = Dimensions.get('window').width

const UserProfileScreen = (props) => {
    const [load, setLoad] = useState(false)
    const [userToken, setUserToken] = useState(useSelector((state) => (state.user.userToken)))
    const [userProfile, setUserProfile] = useState()
    const [userPosts, setUserPosts] = useState()
    const displayMode = useSelector((state) => state.user.displayMode)

    const headers = {
        'Authorization': 'Bearer ' + userToken,
        'Content-Type': 'application/json'
    }
    useEffect(() => {
        const id = props.navigation.getParam('id')
        const getProfile = () => {
            setLoad(true)
            axios({
                method: 'post',
                url: `http://192.168.100.5:3000/user/publicInfo/${id}`,
                headers
            }).then((res) => {

                setUserProfile(res.data.user)

                setUserPosts(res.data.tempPosts)
                setLoad(false)
            }).catch(() => { console.log("Error while fetching user profile") })
        }
        getProfile()
    }, [props.navigation.getParam('id')])
    useEffect(() => {
        props.navigation.setParams({ displayMode })
    }, [displayMode])
    return (
        <ScrollView style={{flex:1,backgroundColor:displayMode==true?colors.backgroundColorDark:colors.backgroundColorLight}}>
            {load == true ? <ActivityIndicator size='large' /> :
                <View style={{ flex: 1 }}>
                    <View style={[styles.screen, displayMode == true ? { backgroundColor: colors.backgroundColorDark } :
                        { backgroundColor: colors.backgroundColorLight }]}>
                        <View style={styles.userInfoContainer}>
                            <View style={styles.userInfoNameImageContainer}>
                                <ProfileImage userDp={userProfile ? userProfile.dp : undefined} upload={false} />
                                <Text style={[styles.subText, displayMode == true ? { color: colors.textColorDark } :
                                    { color: colors.textColorLight }]}>{userPosts ? userProfile.name : ''}</Text>
                                <Text style={{color:displayMode==true?colors.textColorDark:colors.textColorLight}}>Bio comes here</Text>
                            </View>

                            <View style={styles.userStats}>
                                <View style={styles.userStatsItem}>
                                    <Text style={[styles.userStatsNum, displayMode == true ? { color: colors.textColorDark } :
                                        { color: colors.textColorLight }]}>1</Text>
                                    <Text style={[styles.userStatsText, displayMode == true ? { color: colors.textColorDark } :
                                        { color: colors.textColorLight }]}>Posts</Text>
                                </View>
                                <View style={styles.userStatsItem} >
                                    <Text style={[styles.userStatsNum, displayMode == true ? { color: colors.textColorDark } :
                                        { color: colors.textColorLight }]}>0</Text>
                                    <Text style={[styles.userStatsText, displayMode == true ? { color: colors.textColorDark } :
                                        { color: colors.textColorLight }]}>Followers</Text>
                                </View>
                                <View style={styles.userStatsItem}>
                                    <Text style={[styles.userStatsNum, displayMode == true ? { color: colors.textColorDark } :
                                        { color: colors.textColorLight }]}>1</Text>
                                    <Text style={[styles.userStatsText, displayMode == true ? { color: colors.textColorDark } :
                                        { color: colors.textColorLight }]}>Following</Text>
                                </View>
                            </View>
                        </View>

                    </View>
                    <View style={styles.userActionsContainer}>
                        <CustomButton backColor={colors.headerColor}
                            button={{
                                width: '45%', height: 20, borderRadius: 5, marginTop: 10, shadowColor: "#000", shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 1,
                                },
                                shadowOpacity: 0.22,
                                shadowRadius: 2.22,

                                elevation: 3,
                            }}
                            buttonText={{ fontFamily: 'Lato-Regular', fontSize: 16 }}>Follow</CustomButton>
                        <CustomButton backColor='#dcdde1'
                            onPress={() => props.navigation.navigate("Chat")}
                            button={{
                                width: '45%', height: 20, borderRadius: 5, marginTop: 10, shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 1,
                                },
                                shadowOpacity: 0.22,
                                shadowRadius: 2.22,

                                elevation: 3,
                            }}
                            buttonText={{ fontFamily: 'Lato-Regular', fontSize: 16, color: 'black' }}>Message</CustomButton>
                    </View>
                    <View style={styles.postsHeaderCont}>
                        <Text style={{...styles.postHeader,color:displayMode==true?colors.textColorDark:colors.textColorLight}}>Bilal Posts</Text>
                    </View>
                    {userPosts ? <YourPosts userPosts={userPosts} noPost="User has not shared any photo/video" /> : <Text>No posts from user yet</Text>}
                </View>
            }
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    postsHeaderCont: {
        flex: 1,
        marginHorizontal: 25,
        marginVertical: 20,
        alignItems: 'center',
        borderBottomColor: colors.headerColor,
        borderBottomWidth: 1,
        borderTopColor: colors.headerColor,
        borderTopWidth: 1,
        paddingVertical: 8
    },
    postHeader: {
        fontFamily: 'Lato-Regular',
        fontSize: 18
    },
    followButton: {
        width: 100
    },
    userActionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        marginHorizontal: 30,
        paddingVertical: 7,
        marginTop: 10,

    },
    bio: {
        marginVertical: 10
    },
    screen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'

    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    userInfoNameImageContainer: {
        alignItems: 'center',

        width: windowWidth / 3
    },
    profileTitle: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        paddingBottom: 4
    }
    ,
    title: {
        fontFamily: 'Lato-Bold',
        fontSize: 22
    },
    subText: {
        fontFamily: 'Lato-Bold',
        marginTop: 10
    },
    userStats: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    userStatsItem: {
        marginLeft: 15,
        alignItems: 'center'
    },
    userStatsNum: {
        fontFamily: 'Lato-Black',
        fontSize: 19
    },
    userStatsText: {
        fontFamily: 'Lato-Regular',
        marginTop: 5
    },
    headerContainer: {
        paddingVertical: 5,
        marginTop: 10,
        alignItems: 'center',
        width: '90%',
        borderColor: 'black',
        borderWidth: 1,
        marginBottom: 5
    },
    header: {
        fontFamily: 'Lato-Bold',
        fontSize: 16
    }
})
UserProfileScreen.navigationOptions = navData => {
    return {
        headerTitle:"Bilal Husain",
        headerStyle: {
            backgroundColor: navData.navigation.getParam('displayMode') == true ? colors.backgroundColorDark :
                colors.backgroundColorLight
        },
        headerTitleStyle: {
            color: navData.navigation.getParam('displayMode') == true ? colors.textColorDark :
                colors.textColorLight
        },
        headerLeft: <HeaderButtons HeaderButtonComponent={HeaderButton} >
            <Item title='Menu' iconName='md-arrow-back' color={navData.navigation.getParam('displayMode') == true ? colors.textColorDark : colors.textColorLight} iconSize={26} onPress={() => {
                navData.navigation.navigate("Activity")
            }} />
        </HeaderButtons>
    }
}
export default UserProfileScreen