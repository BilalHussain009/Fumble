import 'react-native-gesture-handler';

import React, { useState, useEffect } from 'react';
import SocialNavigator from './navigation/SocialNavigator'
import * as userActions from './store/actions/user'
import { init, getToken } from './helpers/db'
import { AppLoading } from 'expo'
import axios from 'axios'
import * as Font from 'expo-font'
import userReducer from './store/reducers/user'
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { NativeModules } from 'react-native'


const { UIManager } = NativeModules

if (UIManager) {
  UIManager.genericDirectEventTypes = {
    ...UIManager.genericDirectEventTypes,
    onGestureHandlerEvent: { registrationName: 'onGestureHandlerEvent' },
    onGestureHandlerStateChange: {
      registrationName: 'onGestureHandlerStateChange',
    },
  }
}
init().then(() => {
  console.log("Data base Table Created")
})
const rootReducer = combineReducers({
  user: userReducer
});
export const store = createStore(rootReducer);
const initialDispatch = async () => {
  try {
    const dbResult = await getToken()
    const token = dbResult.rows._array[0].token
    const userId = dbResult.rows._array[0].userId
    const headers = {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    }
    axios({
      method: 'post',
      url: `http://192.168.100.5:3000/user/me/profile`,
      headers
    }).then((r) => {

      store.dispatch(userActions.setUserProfile(r.data.rest.name, r.data.rest.email, userId, token, r.data.rest.following, r.data.post, r.data.dp, r.data.rest.bio,r.data.rest.followers))
      console.log('Dispatched ')
    }).catch((e) => {
      console.log("Error in initial set")
    })
  }
  catch (e) {
    console.log("Not logged In")
  }
}
const loadFonts = async () => {
  initialDispatch()
  return Font.loadAsync({
    'Lato-Black': require('./assets/fonts/Lato-Black.ttf'),
    'Lato-Bold': require('./assets/fonts/Lato-Bold.ttf'),
    'Lato-Light': require('./assets/fonts/Lato-Light.ttf'),
    'Lato-Regular': require('./assets/fonts/Lato-Regular.ttf'),
    'Lato-Thin': require('./assets/fonts/Lato-Thin.ttf'),
    'Logo': require('./assets/fonts/Kaibo.otf')
  })
}
export default function App() {

  const [fontLoaded, setFontLoaded] = useState(false)
  const [userLoaded, setUserLoaded] = useState(false)
  if (!fontLoaded) {
    return (
      <AppLoading startAsync={loadFonts} onFinish={() => {
        setFontLoaded(true)
      }} />
    )
  }
  return (
    <Provider store={store}>

      <SocialNavigator  />
    </Provider>
  );
}


