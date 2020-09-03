import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, Dimensions, Button, Image, ActivityIndicator } from 'react-native'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Swiper from 'react-native-swiper'
import CustomButton from '../components/CutomButton'
import colors from '../constants/Colors'
import { getToken } from '../helpers/db'
import { Ionicons } from '@expo/vector-icons'

const PeopleToFollow = () => {
  const userToken = useSelector((state) => (state.user.userToken))
  const [isFetching, setIsFetching] = useState(false)
  const [recomendataion, setRecomendataion] = useState([])
  const [userFollowing, setUserFollowing] = useState(useSelector((state) => (state.user.followingUsers)))
  const displayMode = useSelector((state) => state.user.displayMode)
  // const [userToken, setUserToken] = useState(useSelector((state) => (state.user.userToken)))
  const reset = useSelector((state) => (state.user.reset))
  useEffect(() => {
    reset == true ? setRecomendataion([]) : undefined
  }, [reset])
  useEffect(() => {

    const getRec = async () => {
      const dbResult = await getToken()
      const userToken = dbResult.rows._array[0].token
      setIsFetching(true)


      const headers = {
        'Authorization': 'Bearer ' + userToken,
        'Content-Type': 'application/json'
      }
      axios({
        method: 'post',
        url: 'http://192.168.100.5:3000/user/recomendations',
        headers
      }).then((res) => {
        if (res.data.length == 0) {
          throw new Error()
        }
        setIsFetching(false)

        setRecomendataion(res.data)
      }).catch((e) => {
        setIsFetching(false)

        console.log('not working')
      })

    }
    getRec()
  }, [reset])
  const handleFollow = async (_id,index) => {
    const headers = {
      'Authorization': 'Bearer ' + userToken,
      'Content-Type': 'application/json'
    }

    axios({
      method: 'post',
      url: 'http://192.168.100.5:3000/user/follow',
      data: {
        id: _id
      },
      headers
    }).then(() => {
      let newRec=recomendataion
      newRec[index].buttonText='Followed'
      newRec[index].buttonColor='#2e86de'
      setRecomendataion([...newRec])
    }).catch(() => {
      console.log('Kek failed')
    })

  }
  return (
    <View style={styles.recWrapper}>
      {isFetching == true ? <ActivityIndicator size='large' /> :


        <Swiper style={styles.wrapper} showsButtons={true} showsPagination={false} 
        nextButton={<Ionicons name="md-arrow-dropright-circle" size={32} color='white'/>}
        prevButton={<Ionicons name="md-arrow-dropleft-circle" size={32} color='white'/>}>
        
          {recomendataion.map((el,index) => {
            return (
              <View style={styles.userCont} key={Math.random()}>
                {el.dp ?
                  <Image style={styles.DP} source={{ uri: `data:image/jpg;base64,${el.dp}` }} />
                  : <Image style={styles.DP} source={{ uri: `https://icon-library.com/images/default-user-icon/default-user-icon-8.jpg` }} />
                }
                <Text style={[styles.userName, displayMode == true ? { color: colors.textColorDark } :
                  { color: colors.textColorLight }]}>{el.name}</Text>
                {userFollowing.map((El) => {
                  if (El.follow == el._id) {
                    return
                  }
                })}
                <CustomButton backColor={el.buttonColor}
                  onPress={() => handleFollow(el._id,index)}
                  button={{ width: '50%', height: 20, borderRadius: 5, marginTop: 10 }}
                  buttonText={{ fontSize: 12 }}
                  container={{ marginTop: 10 }}>
                  {el.buttonText}</CustomButton>
              </View>
            )
          })}


        </Swiper>

      }
    </View>
  )
}
const styles = StyleSheet.create({
  recWrapper: {
    height: 200,
    width: 300,
    marginTop: 20
  },
  userCont: {
    marginHorizontal: 25,
    height: 200,
    width: 250,
    alignItems: 'center',
    justifyContent: 'center',
  }, userName: {
    fontFamily: 'Lato-Regular',
    fontSize: 19
  },
  button: {
    width: 250
  },
  DP: {
    height: 100,
    width: 100,
    borderRadius: 100
  },
  wrapper: {

  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB'
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5'
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9'
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  }
})
export default PeopleToFollow
