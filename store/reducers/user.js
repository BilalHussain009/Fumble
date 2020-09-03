const initialState = {
    userId: '',
    userToken: '',
    userName: '',
    userEmail: '',
    followingUsers: [],
    userPosts: [],
    followingPosts: [],
    followers:[],
    userDp:'',
    bio:'',
    displayMode:true,
    refresh:false,
    reset:false,
    newPostToFeed:{}
}

export default (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USER_PROFILE':
            return {
                ...state,
                userName: action.name,
                userEmail: action.email,
                userId: action.userId,
                userToken: action.userToken,
                followingUsers: action.followingUsers,
                userPosts: action.userPosts,
                userDp:action.userDp,
                bio:action.bio,
                followers:action.followers,
                reset:false
                
            }
        case 'ADD_NEW_POST':
            return {
                ...state,
                userPosts:[action.newPost,...state.userPosts]
            }
        case 'SET_FOLLOWING_POSTS':
            return {
                ...state,
                followingPosts: action.followingPosts
            }
        case 'REST_ALL':
            return {
                userId: '',
                userToken: '',
                userName: '',
                userEmail: '',
                followingUsers: [],
                userPosts: [],
                followingPosts: [],
                userDp:'',
                bio:'',
                displayMode:false,
                refresh:false,
                newFromLocal:[],
                reset:true
            }
        case 'UPDATE_POST_LIKE':
            return {
                ...state,
                followingPosts: action.followingPosts
            }
        case 'UPDATE_COMMENTS':
            let newFollowingPostComments = state.followingPosts[action.index].comments
            let newFollowingPosts=state.followingPosts
            newFollowingPostComments.push(action.comment)
            newFollowingPosts[action.index].comments=newFollowingPostComments
            return {
                ...state,
                followingPosts:newFollowingPosts
            }
        case 'UPDATE_USER_PROFILE':
            
            return{
                ...state,
                userName:action.name,
                userEmail:action.email,
                bio:action.bio
            }
        case 'TOGGLE_DISPLAY':
            return{
                ...state,
                displayMode:action.value
            }
        case "UPDATE_USER_DP":
            return{
                ...state,
                userDp:action.dp
            }
        case "UPDATE_REFRESH":{
            return{
                ...state,
                refresh:action.refresh
            }
        }
        case "ADD_NEW_POST_TO_FEED":{
            return{
                ...state,
                newPostToFeed:action.newFeedPost
            }
        }
        default:

            return state
    }
}