import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Text, StyleSheet, ActivityIndicator, Dimensions, View, Image, TouchableWithoutFeedback, TextInput } from 'react-native'
import colors from '../constants/Colors'
import axios from 'axios'
import { Ionicons, EvilIcons } from '@expo/vector-icons'
import calcTime from '../helpers/timeCalculator'
const windowWidth = Dimensions.get('window').width
const SearchedPostScreen = (props) => {
    useEffect(() => {
        props.navigation.setParams({ userName:props.navigation.getParam('userName') })
        const id = props.navigation.getParam('id')
        const getPostFromServer = () => {
            setLoading(true)
            axios({
                method: 'post',
                url: `http://192.168.100.5:3000/posts/${id}`,
                headers,
            }).then((res) => {
                console.log('found')
                setPost(res.data.post)
                setLoading(false)
            }).catch(() => {
                console.log("Post not found")
                setLoading(false)
            })
        }
        getPostFromServer()
    }, [post])
    const userToken = useSelector((state) => (state.user.userToken))
    const userName = useSelector((state) => (state.user.userName))
    const displayMode = useSelector((state) => state.user.displayMode)
    const userId = useSelector((state) => (state.user.userId))
    const userDp = useSelector((state) => (state.user.userDp))
    const [likeState, setLikeState] = useState()
    const headers = {
        'Authorization': 'Bearer ' + userToken,
        'Content-Type': 'application/json'
    }
    const [loading, setLoading] = useState(true)
    const [comment, setComment] = useState('')
    const [post, setPost] = useState()
    const handleComment=()=>{
        axios({
            method: 'post',
            url: `http://192.168.100.5:3000/posts/comment/1234`,
            headers,
            data: {
                comment:comment,
                ownerId:post.owner,
                postId:post._id
            }
        }).then(() => {console.log("Comment posted");setPost({...post,comment:[...post.comment, {comment,name:userName,createdAt:new Date()}]})})
        .catch(() => console.log("comment failed"))
        
    }
    const handleLike = () => {
        axios({
            method: 'post',
            url: `http://192.168.100.5:3000/posts/like/123`,
            headers,
            data: {
                id: post._id,
                owner: post.owner
            }
        }).then(() => {
            console.log("Liked")
            setPost({...post,like:[...post.like,{_id:userId}]})
        }).catch(() => {
            console.log("failed")
        })
    }
    const handleUnlike = () => {
        axios({
            method: 'post',
            url: `http://192.168.100.5:3000/posts/unlike/${post._id}`,
            headers,
            data: {
                id: post._id,
            }
        }).then(() => {
            console.log("unLiked")
            setPost({...post,like:post.like.filter((el)=>{el._id==userId?false:true})})
        }).catch(() => {
            console.log("unlike failed")
        })
    }
    const likeButton = (like, id, owner) => {

        if (!like) {
            return (
                <TouchableWithoutFeedback onPress={() => handleLike()} >
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
                <TouchableWithoutFeedback onPress={() => handleUnlike()} >
                    <Ionicons name="ios-heart" size={32} color="#fd79a8" />
                </TouchableWithoutFeedback>
            )
        }
        else {
            return (
                <TouchableWithoutFeedback onPress={() => handleLike()} >
                    <Ionicons name="ios-heart-empty" size={32} color={displayMode == true ? colors.textColorDark : colors.textColorLight} />
                </TouchableWithoutFeedback>
            )
        }
    }
    return (

        <View style={styles.postContainer} >
            {loading == true ? <ActivityIndicator size='large' /> :
                <View style={styles.postContainer}>
                    <View style={styles.fromUserContainer}>
                        <View style={styles.fromUser}>
                            <Image style={styles.fromUserImage}
                                source={{ uri: 'https://awodev.com/images/default-forum-user.png' }}
                            />
                            <Text style={[styles.fromUserName, displayMode == true ? { color: colors.textColorDark } :
                                { color: colors.textColorLight }]}>{post.name}</Text>
                        </View>
                    </View>
                    <View style={styles.postImageContainer}>
                        <Image style={styles.postImage} source={{ uri: `data:image/jpg;base64,${post.postPic}` }} />
                    </View>
                    <View style={styles.interactContainer}>
                        <View style={styles.icons}>

                            {likeButton(post.like, post._id, post.owner)}
                            <TouchableWithoutFeedback onPress={
                                // () => props.commentSection(item.description, item.name, item.createdAt, item.comments)
                                () => { }
                            }>
                                <EvilIcons name="comment" size={36} color={displayMode == true ? colors.textColorDark : colors.textColorLight} />
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={styles.commentSection}>
                            <Text style={[styles.votes, displayMode == true ? { color: colors.textColorDark } :
                                { color: colors.textColorLight }]}>{post.like ? post.like.length : 0} votes</Text>
                            <Text style={[styles.caption, displayMode == true ? { color: colors.textColorDark } :
                                { color: colors.textColorLight }]}>
                                <Text style={[styles.cationUser, displayMode == true ? { color: colors.textColorDark } :
                                    { color: colors.textColorLight }]}>{post.name} </Text>{post.description}</Text>
                            <TouchableWithoutFeedback onPress={() => {
                                props.navigation.navigate('Comment',{description:post.description, name:post.name, createdAt:post.createdAt,comment:post.comment})
                            }}>
                                <Text style={[styles.viewComment, displayMode == true ? { color: colors.textColorDark } :
                                    { color: colors.textColorLight }]}>View Comments</Text>
                            </TouchableWithoutFeedback>
                            <Text style={[styles.viewComment, displayMode == true ? { color: colors.textColorDark } :
                                { color: colors.textColorLight }]}>{calcTime(post.createdAt)}
                            </Text>
                            <View style={styles.userComment}>
                                {userDp ?
                                    <Image style={styles.commentUser} source={{ uri: `data:image/jpg;base64,${userDp}` }} /> :
                                    <Image style={styles.commentUser} source={{ uri: 'https://icon-library.com/images/default-user-icon/default-user-icon-8.jpg' }} />}
                                <TextInput value={comment}
                                    onChangeText={text => setComment(text)}
                                    onSubmitEditing={() => {handleComment() }}
                                    style={[styles.commentField, displayMode == true ? { color: colors.textColorDark } :
                                        { color: colors.textColorLight }]}
                                    placeholder='Add a comment' />
                            </View>
                        </View>
                    </View>
                </View>
            }
        </View>
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
SearchedPostScreen.navigationOptions = navData => {
    return {
        
        headerTitle: navData.navigation.getParam('userName')+"'s post"
        
    }
}
export default SearchedPostScreen