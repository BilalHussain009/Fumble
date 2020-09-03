import React, { PureComponent } from 'react'
import colors from '../constants/Colors'
import calcTime from '../helpers/timeCalculator'
import { Ionicons, EvilIcons } from '@expo/vector-icons'

import {
    View, Text, StyleSheet, Image,
    
    Dimensions, TouchableWithoutFeedback, TextInput, Button,
    
} from 'react-native'
class RenderPure extends React.PureComponent {
    render() {
        return (
            <View style={styles.postContainer} key={Math.random()}>

                {/* {modalVisible == true ? <Model modalVisible={modalVisible} setModalVisible={setModalVisible} /> : null} */}
                <View style={styles.fromUserContainer}>
                    <View style={styles.fromUser}>
                        <Image style={styles.fromUserImage}
                            source={{ uri: `data:image/jpg;base64,${this.props.item.ownerPic}` }}
                        />
                        <Text style={[styles.fromUserName, this.props.displayMode == true ? { color: colors.textColorDark } :
                            { color: colors.textColorLight }]}>{this.props.item.name}</Text>
                    </View>
                    {/* <TouchableWithoutFeedback onPress={() => { setModalVisible(!modalVisible) }} >
                        <Ionicons name='md-more' size={50} color={this.props.displayMode == true ? colors.textColorDark : colors.textColorLight} />
                    </TouchableWithoutFeedback> */}
                </View>
                <View style={styles.postImageContainer}>
                    <Image style={styles.postImage} source={{ uri: `data:image/jpg;base64,${this.props.item.postPic}` }} />
                </View>
                <View style={styles.interactContainer}>
                    <View style={styles.icons}>

                        {this.props.likeButton(this.props.item.like, this.props.item._id, this.props.item.owner)}
                        <TouchableWithoutFeedback onPress={
                            () => this.props.commentSection(this.props.item.description, this.props.item.name, this.props.item.createdAt, this.props.item.comments)

                        }>
                            <EvilIcons name="comment" size={36} color={this.props.displayMode == true ? colors.textColorDark : colors.textColorLight} />
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.commentSection}>
                        <Text style={[styles.votes, this.props.displayMode == true ? { color: colors.textColorDark } :
                            { color: colors.textColorLight }]}>{this.props.item.like ? this.props.item.like.length : 0} votes</Text>
                        <Text style={[styles.caption, this.props.displayMode == true ? { color: colors.textColorDark } :
                            { color: colors.textColorLight }]}>
                            <Text style={[styles.cationUser, this.props.displayMode == true ? { color: colors.textColorDark } :
                                { color: colors.textColorLight }]}>{this.props.item.name} </Text>{this.props.item.description}</Text>
                        <TouchableWithoutFeedback onPress={() => {
                             this.props.commentSection(this.props.item.description, this.props.item.name, this.props.item.createdAt, this.props.item.comments)
                        }}>
                            <Text style={[styles.viewComment, this.props.displayMode == true ? { color: colors.textColorDark } :
                                { color: colors.textColorLight }]}>View Comments</Text>
                        </TouchableWithoutFeedback>
                        <Text style={[styles.viewComment, this.props.displayMode == true ? { color: colors.textColorDark } :
                            { color: colors.textColorLight }]}>{calcTime(this.props.item.createdAt)}
                        </Text>
                        <View style={styles.userComment}>
                            <Image style={styles.commentUser} source={{ uri: `data:image/jpg;base64,${this.props.userDp}` }} />
                            {/* <TextInput value={this.state.comment[index]}
                                onChangeText={text => {
                                    let textInputs = this.state.comment
                                    textInputs[index] = text;
                                    this.setState({
                                        comment: textInputs
                                    })
                                }}
                                onSubmitEditing={() => this.handleComment(this.state.comment[index], item._id, index, item.owner)}
                                style={[styles.commentField, this.props.displayMode == true ? { color: colors.textColorDark } :
                                    { color: colors.textColorLight }]}
                                placeholder='Add a comment' /> */}
                        </View>
                    </View>
                </View>
            </View>
        )
    }
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
export default RenderPure