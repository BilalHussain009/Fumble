import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    View, Text, StyleSheet, Image,
    RefreshControl,
    Dimensions, TouchableWithoutFeedback, TextInput, Button,
    FlatList
} from 'react-native'
import colors from '../constants/Colors'

import calcTime from '../helpers/timeCalculator'
import * as userActions from '../store/actions/user'
import axios from 'axios'
import { Ionicons, EvilIcons } from '@expo/vector-icons'
import Model from './Model'
const FeedPost = (props) => {
    const displayMode = useSelector((state) => state.user.displayMode)

    const [modalVisible, setModalVisible] = useState(false)
    const userToken = useSelector((state) => (state.user.userToken))
    const userId = useSelector((state) => (state.user.userId))
    const userName = useSelector((state) => (state.user.userName))
    const userDp = useSelector((state) => (state.user.userDp))

    const [comment, setComment] = useState([])
    const [userImages, setUserImages] = useState([])
    const dispatch = useDispatch()
    const handleLike = (id, owner) => {
        props.changeFollowingPosts(userId, id)
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

    const handleUnlike = (id) => {
        props.changePostsUnlike(userId, id)
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
    const handleComment = (comm, id, index, owner) => {
        const headers = {
            'Authorization': 'Bearer ' + userToken,
            'Content-Type': 'application/json'
        }
        props.changeComments({
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

    const renderElements = ({ item, index }) => {
        return (
            <View style={styles.postContainer} >

                {/* {modalVisible == true ? <Model modalVisible={modalVisible} setModalVisible={setModalVisible} /> : null} */}
                <View style={styles.fromUserContainer}>
                    <View style={styles.fromUser}>
                        {item.ownerPic ? <Image style={styles.fromUserImage}
                            source={{ uri: `data:image/jpg;base64,${item.ownerPic}` }}
                        /> :
                            <Image style={styles.fromUserImage}
                                source={{ uri: 'https://awodev.com/images/default-forum-user.png' }}
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
                            () => props.commentSection(item.description, item.name, item.createdAt, item.comments)

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
                            props.commentSection(item.description, item.name, item.createdAt, item.comments)
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
                                <Image style={styles.commentUser} source={{ uri:'https://icon-library.com/images/default-user-icon/default-user-icon-8.jpg' }} />}
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
    return (
        <FlatList data={props.posts}
            onRefresh={props.refreshScreen}
            refreshing={props.refreshState}
            removeClippedSubviews={true}
            keyExtractor={() => Math.random().toString()}
            // directionalLockEnabled={false}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={5}
            onScroll={({ nativeEvent }) => {
                if (props.isCloseToBottom(nativeEvent)) {
                    props.getMoreFeedPosts()
                }
            }}
            ref={props.flatListRef}
            renderItem={renderElements} />
    )
}
const styles = StyleSheet.create({
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
        borderColor: '#00a8ff',
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
export default FeedPost