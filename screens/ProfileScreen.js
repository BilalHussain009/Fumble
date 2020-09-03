import 'react-native-gesture-handler'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { View, Text, StyleSheet, Button, ScrollView, FlatList, Dimensions, StatusBar, SafeAreaView } from 'react-native'
import { useSelector } from 'react-redux'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import HeaderButton from '../components/HeaderButton'
import CustomButton from '../components/CutomButton'
import ProfileImage from '../components/ProfileImage'
import YourPosts from '../components/YourPosts'
import PeopleToFollow from '../components/PeopleToFollow'
import colors from '../constants/Colors'
const deviceHeight = Dimensions.get('window').height
const ProfileScreen = (props) => {
    const dispatch = useDispatch()
    const displayMode = useSelector((state) => state.user.displayMode)
    const name = useSelector((state) => state.user.userName)
    const followingUsers = useSelector((state) => state.user.followingUsers)
    const userPosts = useSelector((state) => state.user.userPosts)
    const email = useSelector((state) => state.user.userEmail)
    const userId = useSelector((state) => state.user.userId)
    const userDp = useSelector((state) => state.user.userDp)
    const bio = useSelector((state) => state.user.bio)
    const followers = useSelector((state) => state.user.followers)

    useEffect(() => {
        props.navigation.setParams({ userEmail: email, displayMode })
        if (!userId) {
            props.navigation.navigate("Login")
        }
    }, [email])
    useEffect(() => {
        props.navigation.setParams({ displayMode })
    }, [displayMode])
    const viewPostNavigator = (post) => {
        props.navigation.navigate("ViewPost", { post })
    }
    return (
        <FlatList
        
            data={['a']}
            keyExtractor={(item, index) => index.toString()}
            renderItem={() => {
                return (
                    <View style={{ flex: 1 }}>
                        <StatusBar barStyle={displayMode ? 'light-content' : "dark-content"} hidden={false} backgroundColor={displayMode ? "black" : 'white'} translucent={true} />

                        <View style={[styles.screen, displayMode == true ? { backgroundColor: colors.backgroundColorDark } :
                            { backgroundColor: colors.backgroundColorLight }]}>
                            <View style={styles.userInfoContainer}>
                                <View style={styles.userInfoNameImageContainer}>
                                    <ProfileImage userDp={userDp} upload={true} />
                                    <Text style={[styles.subText, displayMode == true ? { color: colors.textColorDark } :
                                        { color: colors.textColorLight }]}> {name}</Text>
                                </View>

                                <View style={styles.userStats}>
                                    <View style={styles.userStatsItem}>
                                        <Text style={[styles.userStatsNum, displayMode == true ? { color: colors.textColorDark } :
                                            { color: colors.textColorLight }]}>{userPosts ? userPosts.length : 0}</Text>
                                        <Text style={[styles.userStatsText, displayMode == true ? { color: colors.textColorDark } :
                                            { color: colors.textColorLight }]}>Posts</Text>
                                    </View>
                                    <View style={styles.userStatsItem} >
                                        <Text style={[styles.userStatsNum, displayMode == true ? { color: colors.textColorDark } :
                                            { color: colors.textColorLight }]}>{followers ? followers.length : 0}</Text>
                                        <Text style={[styles.userStatsText, displayMode == true ? { color: colors.textColorDark } :
                                            { color: colors.textColorLight }]}>Followers</Text>
                                    </View>
                                    <View style={styles.userStatsItem}>
                                        <Text style={[styles.userStatsNum, displayMode == true ? { color: colors.textColorDark } :
                                            { color: colors.textColorLight }]}>{followingUsers ? followingUsers.length : 0}</Text>
                                        <Text style={[styles.userStatsText, displayMode == true ? { color: colors.textColorDark } :
                                            { color: colors.textColorLight }]}>Following</Text>
                                    </View>
                                </View>
                            </View>
                            <Text style={[styles.bio, displayMode == true ? { color: colors.textColorDark } :
                                { color: colors.textColorLight }]}>{bio == undefined ? "New User No BioGraphy Set!" : bio}</Text>

                            <CustomButton backColor='#808e9b'
                                onPress={() => props.navigation.navigate('EditProfile', { name: name, email: email, bio: bio })}
                                button={{ width: '50%', height: 20, borderRadius: 5, marginTop: 10 }}
                                buttonText={{ fontSize: 12 }}
                                container={{ marginTop: 10 }}>
                                Edit Profile</CustomButton>
                            <View style={[styles.headerContainer, displayMode == true ? { borderColor: colors.textColorDark } :
                                { borderColor: colors.textColorLight }]}>
                                <Text style={[styles.header, displayMode == true ? { color: colors.textColorDark } :
                                    { color: colors.textColorLight }]}>Your Posts</Text>
                            </View>
                            <YourPosts displayMode={displayMode} userPosts={userPosts} viewPostNavigator={viewPostNavigator} noPost="When You share photo and videos,they'll appear on your profile" />
                            <View style={[styles.headerContainer, displayMode == true ? { borderColor: colors.textColorDark } :
                                { borderColor: colors.textColorLight }]}>
                                <Text style={[styles.header, displayMode == true ? { color: colors.textColorDark } :
                                    { color: colors.textColorLight }]}>People To Follow</Text>
                            </View>
                            <View>
                                <PeopleToFollow />
                            </View>
                        </View>

                    </View>)
            }} />
    )
}
const styles = StyleSheet.create({
    bio: {
        marginVertical: 10
    },
    screen: {
        flex: 1,
        alignItems: 'center'
    },
    userInfoContainer: {
        flexDirection: 'row'
    },
    userInfoNameImageContainer: {
        alignItems: 'center'
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
        alignItems: 'center',
        justifyContent: 'space-around'
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
ProfileScreen.navigationOptions = navData => {
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
export default ProfileScreen