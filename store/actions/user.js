export const setUserProfile = (name, email, userId, userToken, followingUsers,userPosts,userDp,bio,followers) => {
    return {
        type: 'SET_USER_PROFILE',
        name,
        email,
        userId,
        userToken,
        followingUsers,
        userPosts,
        userDp,
        bio,
        followers
    }
}
export const addNewPost=(postPic,description,userId,name,ownerPic,id,owner)=>{
    return{
        type:'ADD_NEW_POST',
        newPost:{postPic,description,userId,name,ownerPic,createdAt:new Date(),like:[],_id:id,owner}
    }
}
export const setFollowingPosts=(followingPosts)=>{
    return{
        type:'SET_FOLLOWING_POSTS',
        followingPosts
    }
}
export const updatePostLike=(followingPosts)=>{
    return{
        type:"UPDATE_POST_LIKE",
        followingPosts
    }
}
export const updateComments=(comment,index)=>{
    return {
        type:"UPDATE_COMMENTS",
        comment,
        index
    }
}
export const updateUserProfile=(name,email,bio)=>{
    return{
        type:"UPDATE_USER_PROFILE",
        name,
        email,
        bio
    }
}
export const updateUserDp=(dp)=>{
    return{
        type:"UPDATE_USER_DP",
        dp
    }
}
export const toggleDisplay=(value)=>{
    return{
        type:"TOGGLE_DISPLAY",
        value
    }
}
export const resetUser = () => {
    return {
        type: 'REST_ALL'
    }
}
export const addNewPostToFeed=(postPic,description,userId,name,ownerPic,id,owner)=>{
    return{
        type:"ADD_NEW_POST_TO_FEED",
        newFeedPost:{postPic,description,userId,name,ownerPic,createdAt:new Date(),like:[],_id:id,owner,comments:[]}
    }
}
export const updateRefresh = (refreshState) => {
    console.log(refreshState+'////////////////')
    return {
        type: 'UPDATE_REFRESH',
        refresh:refreshState
    }
}