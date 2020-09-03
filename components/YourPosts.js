import React from 'react'
import colors from '../constants/Colors'

import { View, StyleSheet, Text, FlatList, Image, Dimensions, TouchableNativeFeedback } from 'react-native'
const YourPosts = (props) => {
    const userPosts = props.userPosts
    const renderGridItem = itemData => {
        return (
            <TouchableNativeFeedback onPress={() => props.viewPostNavigator(itemData.item)}>
                <View style={styles.imageContainer}>
                    <Image style={styles.image} source={{ uri: `data:image/jpg;base64,${itemData.item.postPic}` }} />
                </View>
            </TouchableNativeFeedback>
        )


    }

    return (
        <View style={styles.flatListCont}>
            {userPosts.length > 0 ? <FlatList numColumns={3} keyExtractor={(item, index) => Math.random()} data={userPosts} renderItem={renderGridItem} /> :
                <View style={styles.emptyContainer}>
                    <Text style={[styles.empty, props.displayMode == true ? { color: colors.textColorDark }  :
                        { color:  colors.textColorLight}]}>{props.noPost}</Text>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    imageContainer: {
        marginHorizontal: 2,
        marginVertical: 3,
        height: 120,
        width: Dimensions.get('screen').width / 3,
        borderRadius: 10,
        elevation: 5,
    },
    image: {
        flex: 1,

    },
    flatListCont: {
    },
    empty: {
        fontSize: 16,
        fontFamily: 'Lato-Light',
        textAlign: 'center'
    },
    emptyContainer: {
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 30
    }
})
export default YourPosts