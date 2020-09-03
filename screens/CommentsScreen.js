import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import calcTime from '../helpers/timeCalculator'

const CommentsScreen = (props) => {
    return (
        <View style={styles.commentScreen}>
            <View style={styles.userCaptionbox}>
                <View style={styles.topSection}>
                    <Image style={styles.commentUser} source={{ uri: 'https://www.wonderplugin.com/wp-content/uploads/2013/12/Evening_1024.jpg' }} />
                    <Text style={styles.caption}>
                        <Text style={styles.cationUser}>{props.navigation.getParam('name')}</Text>

                    </Text>
                </View>
                <View style={styles.topBottomSection}>
                    <Text style={styles.postCaption}>{props.navigation.getParam('description')}</Text>
                    <Text style={styles.time}>{calcTime(props.navigation.getParam('createdAt'))}</Text>
                </View>
            </View>
                {props.navigation.getParam('comment') ?
                    props.navigation.getParam('comment').map((el) => {
                        return (
                            <View style={styles.userCommentContainer} key={Math.random()}>
                                <Image style={styles.commentUser} source={{ uri: `https://img.icons8.com/officel/2x/user.png` }} />
                                <View style={styles.commentInfoContainer}>
                                    <Text style={styles.cationUser}>{el.name} <Text style={styles.caption}>{el.comment}</Text></Text>


                                    <View style={styles.commentActionContainer}>
                                        <Text style={styles.time}>{calcTime(el.createdAt)}</Text>
                                        <Text style={styles.action}>Reply</Text>
                                        <Text style={styles.action}>0 Likes</Text>
                                    </View>
                                </View>

                            </View>
                        )
                    }) :
                    null}

        </View>
    )
}
const styles = StyleSheet.create({
    action: {
        fontFamily: 'Lato-Regular',
        fontSize: 12,
        marginTop: 10,
        marginLeft: 10
    },
    commentActionContainer: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    commentInfoContainer: {
        flex: 1,
        flexDirection: 'column'
    }
    ,
    userCommentContainer: {
        marginTop: 30,
        flexDirection: 'row'
    },
    topBottomSection: {
        marginLeft: 55
    },
    userCaptionbox: {
        borderBottomColor: '#ccc',
        paddingBottom: 20,
        borderBottomWidth: 1
    },
    commentScreen: {
        flex: 1,
        marginHorizontal: 8,
        marginTop: 7,
    },
    caption: {
        flexDirection: 'column',
        marginTop: 3,
        fontFamily: 'Lato-Light',
        fontSize: 14
    },
    cationUser: {
        fontFamily: 'Lato-Regular'
    },
    commentSection: {
        marginLeft: 12,

    },
    commentUser: {
        height: 45,
        width: 45,
        borderRadius: 200,
        marginRight: 10,

    },
    postCaption: {
        fontFamily: 'Lato-Light',
        color: 'black'
    },
    topSection: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    time: {
        fontFamily: 'Lato-Light',
        fontSize: 12,
        marginTop: 10
    }

})
CommentsScreen.navigationOptions = navData => {
    return {
        headerStyle: {
            backgroundColor: '#ff6b81'
        },
        headerTitle: 'Comments',
    }
}
export default CommentsScreen