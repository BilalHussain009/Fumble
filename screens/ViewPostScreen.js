import React ,{ useState, useEffect }from 'react'
import {View,StyleSheet,Text} from 'react-native'
import FeedPost from '../components/FeedPost'
import { useDispatch, useSelector } from 'react-redux'
import * as userActions from '../store/actions/user'
import colors from '../constants/Colors'

const ViewPostScreen=(props)=>{
    const dispatch = useDispatch()
    const [refresh, setRefresh] = useState(false)
    const [refreshState, setRefreshState] = useState(false)
    const displayMode = useSelector((state) => state.user.displayMode)
    let followingPosts = [props.navigation.getParam("post")]
    let followingPosts2 = useSelector((state) => state.user.followingPosts)
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
        dispatch(userActions.updatePostLike(newfollowingPosts))
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
        dispatch(userActions.updatePostLike(newfollowingPosts))
    }
    const refreshScreen = () => {
        setRefresh(!refresh)
    }
    return(
        <View style={[styles.screen, displayMode == true ? { backgroundColor: colors.backgroundColorDark } :
            { backgroundColor: colors.backgroundColorLight }]}>
            <FeedPost posts={followingPosts}
            refreshScreen={refreshScreen} refreshState={refreshState}
            changeFollowingPosts={changeFollowingPosts}
            changePostsUnlike={changePostsUnlike}
            isCloseToBottom={()=>{}}
            getMoreFeedPosts={()=>{}}
            commentSection={(description, name, createdAt, comment) => props.navigation.navigate('Comment', { description, name, createdAt, comment })}/>            
        </View>
    )
}
const styles=StyleSheet.create({
    screen:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})
export default ViewPostScreen