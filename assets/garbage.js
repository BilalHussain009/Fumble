import 'react-native-gesture-handler'
import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, ActivityIndicator, Button } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import FeedPost from '../components/FeedPost'
import { store } from '../App'
import HeaderConfig from '../models/HeaderConfig'
import * as userActions from '../store/actions/user'
import colors from '../constants/Colors'
import CustomButton from '../components/CutomButton'
import socket from '../helpers/socketConnector'
socket.on('picUploaded', ({ username, id }, callback) => {
    const followingUsers = store.getState().user.followingUsers
    followingUsers.map((el) => {
        if (el.follow == id) {
            console.log("Hit")
            store.dispatch(userActions.updateRefresh(!store.getState().user.refresh))
        }
    })

})
const FeedScreen = (props) => {
    const userToken = useSelector((state) => (state.user.userToken))
    const [refresh, setRefresh] = useState(false)
    const [refreshState, setRefreshState] = useState(false)
    const displayMode = useSelector((state) => state.user.displayMode)
    const [pageNo, setPageNo] = useState(0)
    const [pageSize, setPageSize] = useState(5)
    const [totalPosts, setTotalPosts] = useState(0)
    const [followingPosts, setFollowingPosts] = useState([])
    const [lock, setLock] = useState(false)
    const [loading, setLoading] = useState(false)
    const [newFromLocal, setNewFromLocal] = useState(useSelector((state) => state.user.newFromLocal))
    useEffect(() => {
        setFollowingPosts([...newFromLocal, ...followingPosts])
    }, [newFromLocal])
    // let followingPosts = useSelector((state) => state.user.followingPosts)
    const reload = useSelector((state) => state.user.refresh)
    const headers = {
        'Authorization': 'Bearer ' + userToken,
        'Content-Type': 'application/json'
    }
    const dispatch = useDispatch()
    useEffect(() => {

        props.navigation.setParams({ displayMode })
        axios({
            method: 'post',
            url: 'http://192.168.100.5:3000/post/me/paginationedData',
            data: {
                pageNo,
                pageSize
            },
            headers
        }).then((r) => {

            setFollowingPosts(r.data.posts)
            setTotalPosts(r.data.totalPosts)
            setPageNo(1)
            console.log(pageNo, pageSize)

        })
            .catch(() => console.log("Failed"))

    }, [userToken])
    const flatListRef = React.useRef()

    const toTop = () => {
        flatListRef.current.scrollToOffset({ animated: true, offset: 0 })
    }
    const changeFollowingPosts = (userId, postId) => {
        let newfollowingPosts = []
        followingPosts.map((el) => {
            if (el._id == postId) {
                let temp = el
                temp.like.push({ _id: userId })
                newfollowingPosts.push(temp)
            }
            else {
                newfollowingPosts.push(el)
            }
        })
        setFollowingPosts(newfollowingPosts)
    }
    const changeComments = (comment, index) => {
        let newFollowingPostComments = followingPosts[index].comments
        let newFollowingPosts = followingPosts
        newFollowingPostComments.push(comment)
        newFollowingPosts[index].comments = newFollowingPostComments
    }
    const changePostsUnlike = (userId, postId) => {
        let newfollowingPosts = []
        followingPosts.map((el) => {
            if (el._id == postId) {
                let temp = el
                let temp2 = temp.like

                temp2 = temp2.filter((el) => {
                    if (el._id == userId) {
                        return false
                    }
                    return true
                })
                temp.like = temp2
                newfollowingPosts.push(temp)
            }
            else {
                newfollowingPosts.push(el)
            }
        })
        setFollowingPosts(newfollowingPosts)
    }
    const refreshScreen = () => {
        axios({
            method: 'post',
            url: 'http://192.168.100.5:3000/post/me/paginationedData',
            data: {
                pageNo: 0,
                pageSize
            },
            headers
        }).then((r) => {

            setFollowingPosts(r.data.posts)
            setTotalPosts(r.data.totalPosts)
            setPageNo(1)
            console.log(r.data.totalPosts)
        })
            .catch(() => console.log("Failed"))

    }
    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        if(loading==true){
            return false
        }
        return layoutMeasurement.height + contentOffset.y
            >= contentSize.height - 100;
    }
    const getMoreFeedPosts = () => {
        setLoading(true)
        if (pageNo * pageSize > totalPosts) {
            if (lock == true) {
                console.log("Thats all for now")
                setLoading(false)

            }
            else {
                setLock(true)
                axios({
                    method: 'post',
                    url: 'http://192.168.100.5:3000/post/me/paginationedData',
                    data: {
                        pageNo,
                        pageSize,
                        lock
                    },
                    headers
                }).then((r) => {
                    setFollowingPosts([...followingPosts, ...r.data.posts])
                    setTotalPosts(r.data.totalPosts)
                    setLoading(false)
                })
                    .catch(() => {
                        console.log("Failed")
                        setLoading(false)
                    })
            }

        }

        else {

            axios({
                method: 'post',
                url: 'http://192.168.100.5:3000/post/me/paginationedData',
                data: {
                    pageNo,
                    pageSize
                },
                headers
            }).then((r) => {
                setFollowingPosts([...followingPosts, ...r.data.posts])
                setPageNo(pageNo + 1)
                setTotalPosts(r.data.totalPosts)
                setLoading(false)

            })
                .catch(() => {
                    console.log("Failed")
                    setLoading(false)
                })
        }

    }
    return (
        <View style={[styles.screen, displayMode == true ? { backgroundColor: colors.backgroundColorDark } :
            { backgroundColor: colors.backgroundColorLight }]}>
            {reload == true ? <CustomButton backColor='#2980b9'
                onPress={() => { toTop() }}
                button={{
                    marginTop: 10, paddingHorizontal: 0, zIndex: 1, top: 20, position: 'absolute',

                    width: 150,
                    height: 35,
                }}
                buttonText={{
                    fontSize: 16, textAlign: 'center', justifyContent: 'center', alignItems: 'center',
                }}>See new posts</CustomButton> : undefined}
            {followingPosts.length == 0 ? <ActivityIndicator size='large' /> :
                <View>
                    <FeedPost posts={followingPosts} refreshScreen={refreshScreen} refreshState={refreshState}
                        changeFollowingPosts={changeFollowingPosts}
                        isCloseToBottom={isCloseToBottom}
                        changePostsUnlike={changePostsUnlike}
                        flatListRef={flatListRef}
                        getMoreFeedPosts={getMoreFeedPosts}
                        changeComments={changeComments}
                        commentSection={(description, name, createdAt, comment) => props.navigation.navigate('Comment', { description, name, createdAt, comment })} />
                    {loading == true ? <View style={{ height: 40 }}>
                        <ActivityIndicator size='large' />
                    </View> : undefined}
                </View>
            }

        </View>
    )
}
const styles = StyleSheet.create({
    screen: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        fontFamily: 'Logo',
        color: 'white',
        fontSize: 22,
        fontWeight: '500',
        marginLeft: 10,
        marginTop: 4
    }
})
FeedScreen.navigationOptions = navData => {
    return HeaderConfig(navData, navData.navigation.getParam('displayMode'))
}
export default FeedScreen