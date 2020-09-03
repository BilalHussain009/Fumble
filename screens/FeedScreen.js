import 'react-native-gesture-handler'
import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, ActivityIndicator, Image, Dimensions, TouchableWithoutFeedback, TextInput, StatusBar } from 'react-native'
import { useSelector } from 'react-redux'
import InfiniteScroll from 'react-native-infinite-scrolling'
import axios from 'axios'
import { Ionicons, EvilIcons } from '@expo/vector-icons'
import calcTime from '../helpers/timeCalculator'
import HeaderConfig from '../models/HeaderConfig'
import {
    BarIndicator,

} from 'react-native-indicators';
import colors from '../constants/Colors'
import { Col } from 'native-base'

const FeedScreen = (props) => {
    const userToken = useSelector((state) => (state.user.userToken))
    const [refresh, setRefresh] = useState(false)
    const [refreshState, setRefreshState] = useState(false)
    const displayMode = useSelector((state) => state.user.displayMode)
    const userDp = useSelector((state) => (state.user.userDp))
    const [comment, setComment] = useState([])
    const userId = useSelector((state) => (state.user.userId))
    const userName = useSelector((state) => (state.user.userName))
    const reset = useSelector((state) => (state.user.reset))

    const [pageNo, setPageNo] = useState(0)
    const [pageSize, setPageSize] = useState(3)
    const [totalPosts, setTotalPosts] = useState(0)
    const [followingPosts, setFollowingPosts] = useState([])
    const [lock, setLock] = useState(false)
    const [loading, setLoading] = useState(false)
    const [newFromLocal, setNewFromLocal] = useState(useSelector((state) => state.user.newFromLocal))
    const newPostToFeed = useSelector((state) => (state.user.newPostToFeed))
    useEffect(() => {
        reset == true ? setFollowingPosts([]) : undefined
    }, [reset])
    useEffect(() => {
        props.navigation.setParams({ displayMode })
    }, [displayMode])
    useEffect(() => {
        newPostToFeed.createdAt ? setFollowingPosts([newPostToFeed, ...followingPosts]) : console.log(undefined)
    }, [newPostToFeed])
    // let followingPosts = useSelector((state) => state.user.followingPosts)
    const reload = useSelector((state) => state.user.refresh)
    const headers = {
        'Authorization': 'Bearer ' + userToken,
        'Content-Type': 'application/json'
    }
    const handleLike = (id, owner) => {
        changeFollowingPosts(userId, id)
        const headers = {
            'Authorization': 'Bearer ' + userToken,
            'Content-Type': 'application/json'
        }
        axios({
            method: 'post',
            url: `http://192.168.100.5:3000/posts/like/${id}`,
            data: {
                id,
                owner
            },
            headers
        }).then(() => console.log('Liked'))
            .catch(() => console.log("Like Failed"))
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
    const handleUnlike = (id) => {
        changePostsUnlike(userId, id)
        const headers = {
            'Authorization': 'Bearer ' + userToken,
            'Content-Type': 'application/json'
        }
        axios({
            method: 'post',
            url: `http://192.168.100.5:3000/posts/unlike/${id}`,
            headers
        }).then(() => console.log('unliked'))
            .catch(() => console.log("unLike Failed"))
    }
    const handleComment = (comm, id, index, owner) => {
        const headers = {
            'Authorization': 'Bearer ' + userToken,
            'Content-Type': 'application/json'
        }
        changeComments({
            user_id: userId, comment: comm, name: userName, createdAt: new Date()
        }, index)
        axios({
            method: 'post',
            url: `http://192.168.100.5:3000/posts/comment/${id}`,
            headers,
            data: {
                comment: comm,
                ownerId: owner,
                postId: id
            }
        }).then(() => console.log("Comment posted"))
            .catch(() => console.log("comment failed"))
    }
    const changeComments = (comment, index) => {
        let newFollowingPostComments = followingPosts[index].comments
        let newFollowingPosts = followingPosts
        newFollowingPostComments.push(comment)
        newFollowingPosts[index].comments = newFollowingPostComments
    }
    const commentSection = (description, name, createdAt, comment) => props.navigation.navigate('Comment', { description, name, createdAt, comment })
    const likeButton = (like, id, owner) => {

        if (!like) {
            return (
                <TouchableWithoutFeedback onPress={() => handleLike(id, owner)}>
                    <Ionicons name="ios-heart-empty" size={32} color={displayMode == true ? colors.textColorDark : colors.textColorLight} />
                </TouchableWithoutFeedback>
            )
        }
        let flag = false
        like.map((el) => {
            if (el._id == userId) {
                flag = true
            }
        })
        if (flag == true) {
            return (
                <TouchableWithoutFeedback onPress={() => handleUnlike(id, owner)}>
                    <Ionicons name="ios-heart" size={32} color="#fd79a8" />
                </TouchableWithoutFeedback>
            )
        }
        else {
            return (
                <TouchableWithoutFeedback onPress={() => handleLike(id, owner)}>
                    <Ionicons name="ios-heart-empty" size={32} color={displayMode == true ? colors.textColorDark : colors.textColorLight} />
                </TouchableWithoutFeedback>
            )
        }
    }
    const renderData = ({ item, index }) => {
        return (
            <View style={styles.postContainer} >
                <View style={styles.fromUserContainer}>
                    <View style={styles.fromUser}>
                        {item.ownerPic ? <Image style={styles.fromUserImage}
                            source={{ uri: `data:image/jpg;base64,${item.ownerPic}` }}
                        /> :
                            <Image style={styles.fromUserImage}
                                source={{ uri: 'https://icon-library.com/images/default-user-icon/default-user-icon-8.jpg' }}
                            />}
                        <Text style={[styles.fromUserName, displayMode == true ? { color: colors.textColorDark } :
                            { color: colors.textColorLight }]}>{item.name}</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={() => { setModalVisible(!modalVisible) }} >
                        <Ionicons name='md-more' size={50} color={displayMode == true ? colors.textColorDark : colors.textColorLight} />
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.postImageContainer}>
                    <Image style={styles.postImage} source={{ uri: `data:image/jpg;base64,${item.postPic}` }} />
                </View>
                <View style={styles.interactContainer}>
                    <View style={styles.icons}>

                        {likeButton(item.like, item._id, item.owner)}
                        <TouchableWithoutFeedback onPress={
                            () => commentSection(item.description, item.name, item.createdAt, item.comments)

                        }>
                            <EvilIcons name="comment" size={36} color={displayMode == true ? colors.textColorDark : colors.textColorLight} />
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.commentSection}>
                        <Text style={[styles.votes, displayMode == true ? { color: colors.textColorDark } :
                            { color: colors.textColorLight }]}>{item.like ? item.like.length : 0} votes</Text>
                        <Text style={[styles.caption, displayMode == true ? { color: colors.textColorDark } :
                            { color: colors.textColorLight }]}>
                            <Text style={[styles.cationUser, displayMode == true ? { color: colors.textColorDark } :
                                { color: colors.textColorLight }]}>{item.name} </Text>{item.description}</Text>
                        <TouchableWithoutFeedback onPress={() => {
                            commentSection(item.description, item.name, item.createdAt, item.comments)
                        }}>
                            <Text style={[styles.viewComment, displayMode == true ? { color: colors.textColorDark } :
                                { color: colors.textColorLight }]}>View Comments</Text>
                        </TouchableWithoutFeedback>
                        <Text style={[styles.viewComment, displayMode == true ? { color: colors.textColorDark } :
                            { color: colors.textColorLight }]}>{calcTime(item.createdAt)}
                        </Text>
                        <View style={styles.userComment}>
                            {userDp ?
                                <Image style={styles.commentUser} source={{ uri: `data:image/jpg;base64,${userDp}` }} /> :
                                <Image style={styles.commentUser} source={{ uri: 'https://awodev.com/images/default-forum-user.png' }} />}
                            <TextInput value={comment[index]}
                                onChangeText={text => {
                                    let textInputs = comment
                                    textInputs[index] = text;
                                    setComment(textInputs)
                                }}
                                onSubmitEditing={() => handleComment(comment[index], item._id, index, item.owner)}
                                style={[styles.commentField, displayMode == true ? { color: colors.textColorDark } :
                                    { color: colors.textColorLight }]}
                                placeholder='Add a comment' />
                        </View>
                    </View>
                </View>
            </View>
        )
    }
    const loadMore = () => {
        if (totalPosts <= 5) {
            return
        }
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
                    setPageSize(pageSize + pageSize)
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

        })
            .catch(() => console.log("Failed"))

    }, [userToken])
    return (

        <View style={[styles.screen, displayMode == true ? { backgroundColor: colors.backgroundColorDark } : { backgroundColor: colors.backgroundColorLight }]}>
            <StatusBar barStyle={displayMode ? 'light-content' : "dark-content"} hidden={false} backgroundColor={displayMode ? "black" : 'white'} translucent={true} />

            {followingPosts.length == 0 ? <BarIndicator color='black' size={36} color={displayMode==true?"white":'black'}/> :
                <InfiniteScroll
                    renderData={renderData}
                    data={followingPosts}
                    loadMore={loadMore}
                />
            }
        </View>
    )
}
const styles = StyleSheet.create({
    screen: {
        flex: 1,
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
    },
    votes: {
        fontFamily: 'Lato-Bold'
    },
    caption: {
        marginTop: 3,
        fontFamily: 'Lato-Regular'
    },
    cationUser: {
        fontFamily: 'Lato-Bold'
    },
    fromUserContainer: {
        width: Dimensions.get('screen').width,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        alignItems: 'center'
    },
    fromUserImage: {
        height: 40,
        width: 40,
        borderRadius: 20,
        borderColor: colors.headerColor,
        borderWidth: 1
    },
    fromUser: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    fromUserName: {
        fontFamily: 'Lato-Bold',
        fontSize: 14,
        marginLeft: 5

    },
    postContainer: {
        marginTop: 10
    },
    postImageContainer: {
        height: Dimensions.get('screen').height * 55 / 100,
        width: Dimensions.get('screen').width,
        marginTop: 8
    },
    postImage: {
        height: '100%',
        width: '100%',
        alignItems: 'center'
    },
    icons: {
        flexDirection: 'row',
        marginLeft: 7
    },
    commentSection: {
        marginLeft: 12
    },
    viewComment: {
        marginTop: 5,
        fontFamily: 'Lato-Light'
    },
    userComment: {
        marginTop: 5,
        flexDirection: 'row',

    },
    commentUser: {
        height: 30,
        width: 30,
        borderRadius: 20,
        marginRight: 10
    },
    commentField: {

        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: '80%',
        fontSize: 13
    },
    moreButton: {
        marginRight: 100
    }

})
FeedScreen.navigationOptions = navData => {
    return HeaderConfig(navData, navData.navigation.getParam('displayMode'))
}
export default FeedScreen