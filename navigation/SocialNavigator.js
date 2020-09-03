import 'react-native-gesture-handler'
import { createStackNavigator, createDrawerNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation'
import React from 'react'
import LoginScreen from '../screens/LoginScreen'
import ProfileScreen from '../screens/ProfileScreen'
import SignupScreen from '../screens/SignupScreen'
import FeedScreen from '../screens/FeedScreen'
import Colors from '../constants/Colors'
import SettingScreen from '../screens/SettingScreen'
import CommentsScreen from '../screens/CommentsScreen'
import { Ionicons } from '@expo/vector-icons'
import SearchScreen from '../screens/SearchScreen'
import ActivtyScreen from '../screens/ActivityScreen'
import NewPostScreen from '../screens/NewPostScreen'
import EditProfileScreen from '../screens/EditProfileScreen'
import ViewPostScreen from '../screens/ViewPostScreen'
import UserProfileScreen from '../screens/UserProfileScreen'
import ChatScreen from '../screens/ChatScreen'
import SearchedPostScreen from '../screens/SearchedPostScreen'
import MyTabs from '../components/CustomBottomTab'
const profileNavigator = createStackNavigator({
    profile: ProfileScreen,
    EditProfile: EditProfileScreen,
    ViewPost: ViewPostScreen,
    Login:LoginScreen,
    Signup:SignupScreen,
    
})

const feedNavigator = createStackNavigator({
    feed: FeedScreen,
    Comment: CommentsScreen,

})
const settingNavigator = createStackNavigator({
    setting: SettingScreen
})
const searchNavigator = createStackNavigator({
    search: SearchScreen,
    searchedPost:SearchedPostScreen,
    UserProfile: UserProfileScreen,
    Chat: ChatScreen
})
const activityNavigator = createStackNavigator({
    activity: ActivtyScreen,

})
const postNavigator = createStackNavigator({
    newPost: NewPostScreen
})

const tabScreenConfig = {
    Feed: {
        screen: feedNavigator,
        navigationOptions: {
            tabBarIcon: tabInfo => {
                return (
                    <Ionicons name="md-home" size={25} color={Colors.primary} />
                );
            },
            tabBarColor: Colors.primary
        }
    },

    Search: {
        screen: searchNavigator,
        navigationOptions: {
            tabBarIcon: tabInfo => {
                return <Ionicons name="md-search" size={25} color={tabInfo.primary} />;
            },
            tabBarLabel: 'Search'
        }
    },
    New: {
        screen: postNavigator,
        navigationOptions: {
            tabBarIcon: tabInfo => {
                return <Ionicons name="md-add-circle" size={25} color={tabInfo.primary} />;
            },
            tabBarColor: Colors.primary,
            tabBarLabel: 'New Post'
        }
    },
    Activity: {
        screen: activityNavigator,
        navigationOptions: {
            tabBarIcon: tabInfo => {
                return <Ionicons name="md-notifications" size={25} color={tabInfo.primary} />;
            },
            tabBarColor: Colors.primary,
            tabBarLabel: 'Activity'
        }
    }, Profile: {
        screen: profileNavigator,
        navigationOptions: {
            tabBarIcon: tabInfo => {
                return <Ionicons name="md-person" size={25} color={tabInfo.primary} />;
            },
            tabBarColor: Colors.primary,
            tabBarLabel: 'profile'
        }
    }
};

const FeedSearchProfileActivityTabNavigator =
    createBottomTabNavigator(tabScreenConfig, {
        tabBarComponent:MyTabs,
        tabBarOptions: {
            labelStyle: {
                fontFamily: 'Lato-Regular'
            },
            activeTintColor: Colors.accentColor
        }
    });

const drawNav = createDrawerNavigator({
    Profile:FeedSearchProfileActivityTabNavigator,
    Setting: createStackNavigator({
        setting:SettingScreen
    }),
    

},{
    headerTintColor: 'black'

})
export default createAppContainer(drawNav)