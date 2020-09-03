import React,{useState} from "react";
import { Text, Button, View, TouchableNativeFeedback, StyleSheet, Dimensions } from "react-native";
import { Octicons, Ionicons, MaterialIcons, Fontisto } from '@expo/vector-icons'
import colors from '../constants/Colors'
const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('screen').width
import { useSelector } from 'react-redux'
import { color } from "react-native-reanimated";

const TabBar = props => {
    const [activeTab,setActiveTab]=useState('Feed')
    const displayMode = useSelector((state) => state.user.displayMode)

    return (
        <View style={styles.tabBar}>
            <View style={{...styles.tabContainer,backgroundColor:displayMode==true?colors.backgroundColorDark:'white'}}>
                <TouchableNativeFeedback style={styles.touchCont} onPress={() => {
                    setActiveTab("Feed")
                    props.navigation.navigate("feed")
                }} >
                    <Octicons name="home" size={24} color={activeTab=='Feed'?colors.headerColor:displayMode==true?'white':'black'} />
                </TouchableNativeFeedback>
            </View>
            <View style={{...styles.tabContainer,backgroundColor:displayMode==true?colors.backgroundColorDark:'white'}}>
                <TouchableNativeFeedback style={styles.touchCont} onPress={() => {
                    props.navigation.navigate("Search")
                    setActiveTab("Search")

                }}>
                    <Octicons name="search" size={24}  color={activeTab=='Search'?colors.headerColor:displayMode==true?'white':'black'} />
                </TouchableNativeFeedback>
            </View>
            <View style={{...styles.tabContainer,backgroundColor:displayMode==true?colors.backgroundColorDark:'white'}}>
                <TouchableNativeFeedback style={styles.touchCont} onPress={() => {
                    props.navigation.navigate("Activity")
                    setActiveTab("Activity")

                }} >
                    <Fontisto name="bell" size={24} color={activeTab=='Activity'?colors.headerColor:displayMode==true?'white':'black'} />
                </TouchableNativeFeedback>
            </View>
            <View style={{...styles.tabContainer,backgroundColor:displayMode==true?colors.backgroundColorDark:'white'}}>
                <TouchableNativeFeedback style={styles.touchCont}  onPress={() => {
                    props.navigation.navigate("Profile")
                    setActiveTab("Profile")

                }}>
                    <MaterialIcons name="person-outline" size={32} color={activeTab=='Profile'?colors.headerColor:displayMode==true?'white':'black'} />
                </TouchableNativeFeedback>
            </View>
        </View>
    )
};
const styles = StyleSheet.create({
    tabBar: {
        height: (deviceHeight / 100) * 6,
        flexDirection: 'row',
    },
    tabContainer: {
        width: (deviceWidth / 100) * 25,
        height: '100%',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,

        elevation: 20,
    },
    touchCont: {
        width: (deviceWidth / 100) * 25,
        height: '100%',
        backgroundColor:'red'
    }
})
export default TabBar;