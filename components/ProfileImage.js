import React, { useState, useEffect } from 'react'
import { View, Image, StyleSheet } from 'react-native'
import {useSelector}from 'react-redux'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions'
import {useDispatch} from 'react-redux'
import { getToken, addImage } from '../helpers/db'
import * as userActions from '../store/actions/user'
import axios from 'axios'
import CustomButton from './CutomButton'

const ProfileImage = (props) => {
    const [check, setCheck] = useState(false)
    const dispatch=useDispatch()
    const [imageComp2,setImageComp2]=useState()
    const userToken = useSelector((state) => (state.user.userToken))

    let imageComp=<Image style={styles.profileImage} source={{ uri: 'https://awodev.com/images/default-forum-user.png' }} />
    if(props.userDp){
        imageComp= <Image style={styles.profileImage} source={{ uri: `data:image/jpg;base64,${props.userDp}` }} />
    }
    else{
        imageComp=<Image style={styles.profileImage} source={{uri:'https://icon-library.com/images/default-user-icon/default-user-icon-8.jpg'}} />
    }
    const getPermissionAsync = async () => {
        const result = await Permissions.askAsync(Permissions.CAMERA_ROLL)
        if (result.status !== 'granted') {
            Alert.alert("Insufficient Permissions!", "You need to grant Camera Roll Permission to use this app"
                , [{ text: 'Okay!' }])
            return false
        }
        return true
    }
    const pickPicture = async () => {
        try {
            const hasPermission = await getPermissionAsync()
            if (!hasPermission) {
                return
            }
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                quality: 0.5,
                base64: true,
                aspect: [4, 3]
            })


            setImageComp2(<Image style={styles.profileImage} source={{ uri: `data:image/jpg;base64,${result.base64}` }} />)

            
            const headers = {
                'Authorization': 'Bearer ' + userToken,
                'Content-Type': 'application/json'
            }
            axios({
                method: 'post',
                url: 'http://192.168.100.5:3000/users/me/native-dp',
                data: {
                    image: result.base64
                },
                headers
            }).then(() => {
                console.log("Uploaded")
                setCheck(true)
                dispatch(userActions.updateUserDp(result.base64))
                addImage(result.uri).then(() => {
                    console.log("Added")
                }).catch(() => {
                    console.log("Image failed")
                })

            })
                .catch(() => {
                    console.log('upload Failed')
                })




        }
        catch (e) {
            console.log("ERRRRRRRRR")
        }
    }
    return (
        <View style={styles.imageContainer}>
            {check==false?imageComp:imageComp2
            }

            {props.upload==true?<CustomButton backColor='#ff6b81'
                iconName='md-add'
                button={{ width:33, height: 20,marginTop:10,paddingHorizontal: 0 }}
                buttonText={{ fontSize: 10 }}
                onPress={pickPicture} >
                    
             </CustomButton>:
             null}
            
        </View>
    )
}
const styles = StyleSheet.create({
    profileImage: {
        width: 75,
        height: 75,
        borderRadius: 100
    },
    imageContainer: {
        marginTop:20,
        alignItems:'center'
    }
})
export default ProfileImage
