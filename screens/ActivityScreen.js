import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, ActivityIndicator, FlatList, Dimensions, Image, TouchableNativeFeedback } from 'react-native'
import { useSelector } from 'react-redux'
import axios from 'axios'
import colors from '../constants/Colors'
import calcTime from '../helpers/timeCalculator'
const screenHeight = Dimensions.get("window").height
const screenWidth = Dimensions.get('window').width
const ActivtyScreen = (props) => {
    const displayMode = useSelector((state) => state.user.displayMode)

    const [userToken, setUserToken] = useState(useSelector((state) => (state.user.userToken)))
    const [activity, setActivity] = useState([])
    const [load, setLoad] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const headers = {
        'Authorization': 'Bearer ' + userToken,
        'Content-Type': 'application/json'
    }
    useEffect(() => {
        props.navigation.setParams({ displayMode })

        const getActivity = async () => {
            setLoad(true)
            axios({
                method: 'post',
                url: 'http://192.168.100.5:3000/user/getActivity',
                headers
            }).then((r) => {

                if (r.data.notifications == 'No items') {
                    setLoad(false)
                    return
                }
                else {
                    setLoad(false)
                    setActivity(r.data.notifications)
                }
            })
                .catch(() => console.log("Failed"))
        }
        getActivity()

    }, [displayMode])
    const handleRefresh = () => {
        setRefresh(true)

        axios({
            method: 'post',
            url: 'http://192.168.100.5:3000/user/getActivity',
            headers
        }).then((r) => {

            if (r.data.notifications == 'No items') {
                setLoad(false)
                setRefresh(false)
                return
            }

            else {
                setLoad(false)
                setRefresh(false)
                setActivity(r.data.notifications)
            }
        })
            .catch(() => console.log("Failed"))
    }
    const notificationReturner = (Type) => {
        if (Type == 'follow') {
            return 'followed you'
        }
        if (Type == 'like') {
            return 'liked your photo'
        }
        else {
            return 'commented on your photo'
        }
    }
    return (
        <View style={[styles.screen, displayMode == true ? { backgroundColor: colors.backgroundColorDark } :
            { backgroundColor: colors.backgroundColorLight }]}>
            {
                load == true ? <ActivityIndicator size='large' /> :
                    activity.length == 0 ? <Text>Nothing to show</Text> :
                        <FlatList
                            onRefresh={handleRefresh}
                            refreshing={refresh}
                            data={activity}
                            keyExtractor={item => Math.random().toString()}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableNativeFeedback onPress={()=>props.navigation.navigate("UserProfile",{id:item.id})}>
                                        <View style={[styles.activityCard, displayMode == true ? { borderBottomColor: colors.textColorDark } :
                                            { borderBottomColor: colors.headerColor }]}>
                                            <View style={styles.picContianer}>

                                                <Image style={styles.pic} source={{ uri: 'https://www.kindpng.com/picc/m/145-1454384_contact-tie-user-default-suit-display-woman-icon.png' }} />
                                            </View>
                                            <View style={styles.infoContainer}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text style={[styles.userName, displayMode == true ? { color: colors.textColorDark } :
                                                        { color: colors.textColorLight }]}>{item.by} </Text>
                                                    <Text style={[styles.info, displayMode == true ? { color: colors.textColorDark } :
                                                        { color: colors.textColorLight }]}>{notificationReturner(item.type)}</Text>
                                                </View>
                                                <View>
                                                    <Text style={[displayMode == true ? { color: colors.textColorDark } :
                                                        { color: colors.textColorLight }]}>{calcTime(item.createdAt)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableNativeFeedback>
                                )
                            }} />
            }
        </View>
    )
}
const styles = StyleSheet.create({
    screen: {
        flex: 1,

    },
    picContianer: {
        width: 50,
        height: 50,
        marginRight: 10,

    },
    pic: {
        height: '100%',
        width: '100%',
        borderRadius: 600
    },
    activityCard: {
        height: screenHeight / 10,
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 20,
        alignItems: 'center',
        borderBottomColor: colors.headerColor,
        borderBottomWidth: 1
    },
    infoContainer: {
        fontFamily: 'Lato-Light',

    },
    userName: {
        fontFamily: "Lato-Bold"
    },
    infoContainer: {
    }
})
ActivtyScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Activity',
        headerStyle: {
            backgroundColor: navData.navigation.getParam('displayMode') == true ? colors.backgroundColorDark :
                colors.headerColor
        },
        headerTitleStyle: {
            color: 'white',
            fontSize: 22

        }
    }
}
export default ActivtyScreen