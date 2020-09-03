import React, { useState,useEffect } from 'react'
import { View, StyleSheet, Text, Button, Image, TextInput, ActivityIndicator, Dimensions, ScrollView } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import * as userActions from '../store/actions/user'
import { getToken } from '../helpers/db'
import {useDispatch,useSelector} from 'react-redux'
import axios from 'axios'
import CustomButton from '../components/CutomButton'
import HeaderConfig from '../models/HeaderConfig'
import colors from '../constants/Colors'

const NewPostScreen = (props) => {
    const dispatch=useDispatch()
    const userId=useSelector((state)=>state.user.userId)
    const name = useSelector((state) => state.user.userName)
    const ownerPic = useSelector((state) => state.user.userDp)
    const userToken = useSelector((state) => state.user.userToken)

    const displayMode = useSelector((state) => state.user.displayMode)

    const [caption, setCaption] = useState('')
    const [ImageComp, setImageComp] = useState()
    const [isImage, setIsImage] = useState(false)
    const [image, setImage] = useState()
    const [uploading, setUploading] = useState(false)
    useEffect(() => {

        props.navigation.setParams({ displayMode })
    },[displayMode])
    const getPermissionAsync = async () => {
        const result = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA)
        if (result.status !== 'granted') {
            Alert.alert("Insufficient Permissions!", "You need to grant Camera Roll Permission to use this app"
                , [{ text: 'Okay!' }])
            return false
        }
        return true
    }
    const galleryHandler = async (type) => {
        try {
            const hasPermission = await getPermissionAsync()
            let image
            if (!hasPermission) {
                setIsImage(false)
                return
            }
            if (type == 'camera') {
                image = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    quality: 0.5,
                    base64: true,
                })
            } else {
                image = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    quality: 0.5,
                    base64: true,
                })
            }

            if (image.cancelled) {
                return
            }
            setImageComp(<Image style={styles.imagePreview} source={{ uri: `data:image/jpg;base64,${image.base64}` }} />)
            setImage(image.base64)
            setIsImage(true)
        }
        catch (e) {
            setIsImage(false)
        }
    }
    const handlePostSubmit = async () => {
        setUploading(true)
        const dbResult = await getToken()
        
        const headers = {
            'Authorization': 'Bearer ' + userToken,
            'Content-Type': 'application/json'
        }
        console.log(headers)

        axios({
            method: 'post',
            url: 'http://192.168.100.5:3000/nativeposts',
            data: {
                image,
                description: caption,
            },
            headers
        }).then((res) => {
            dispatch(userActions.addNewPost(image,caption,userId,name,ownerPic,res.data._id,userId))
            dispatch(userActions.addNewPostToFeed(image,caption,userId,name,ownerPic,res.data._id,userId))
            console.log("Uploaded")
            setUploading(false)
            setCaption('')
            setImageComp(undefined)
            setIsImage(false)
            setImage(undefined)
            props.navigation.navigate('Feed')

        })
            .catch((e) => {
                console.log(e)
                setUploading(false)
            })

    }
    return (
      
            <View  style={[styles.screen, displayMode == true ? { backgroundColor: colors.backgroundColorDark } :
            { backgroundColor: colors.backgroundColorLight }]}>
                {uploading == true ?
                    <View style={styles.activityContainer}>
                        <ActivityIndicator size="large" color="#ff6b81" />
                        <Text>Uploading</Text>
                    </View> :
                    <View style={styles.screen}>
                        <View style={styles.defaultImageContainer}>
                            {isImage ? <Image style={styles.defaultImage} source={{ uri: `data:image/jpg;base64,${image}` }} /> :
                                <Image style={styles.defaultImage} source={{ uri: 'https://www.portofinoselecta.com/images/joomlart/demo/default.jpg' }} />
                            }
                            <TextInput style={[styles.caption, displayMode == true ? { borderColor: colors.textColorDark,color:colors.textColorDark } :
            { borderColor   : colors.textColorLight,color:colors.textColorLight }]}placeholder='Add Caption....' value={caption} onChangeText={(text) => setCaption(text)} />

                        </View>

                        <View style={styles.photoButtonContainer}>
                            <View style={styles.photoButton}>
                                <CustomButton
                                    button={{ borderRadius: 0, borderRadius: 5 }}
                                    backColor='#0abde3'
                                    onPress={() => galleryHandler('gallery')}
                                    iconName='md-images'
                                >
                                    Gallery
                </CustomButton>
                            </View>
                            <View style={styles.photoButton}>
                                <CustomButton
                                    button={{ borderRadius: 0, borderRadius: 5 }}
                                    backColor='#1dd1a1'
                                    iconName='md-camera'
                                    onPress={() => galleryHandler('camera')}

                                >
                                    Camera
                    </CustomButton>
                            </View>

                        </View>
                        <View style={styles.submitContainer}>
                            <Button title='Post' disabled={!isImage} onPress={handlePostSubmit} />
                        </View>

                    </View>}
            </View>
    )

}
const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
    },
    defaultImageContainer: {
        height: 300,
        width: 300,
        margin: 20
    },
    defaultImage: {
        height: 200
    },
    caption: {
        borderBottomWidth: 1,
        borderColor: 'black',
        fontFamily: 'Lato-Regular',
        fontSize: 15,
        marginTop: 20
    },
    photoButtonContainer: {
    
        flexDirection: 'row',
    },
    photoButton: {
        marginRight: 5,
        width: 130
    },
    submitContainer: {
        marginTop:30
    },
    activityContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Dimensions.get('window').height / 3
    },

})
NewPostScreen.navigationOptions = navData => {
    return HeaderConfig(navData, navData.navigation.getParam('displayMode'))
}
export default NewPostScreen