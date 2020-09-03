import React, { useState ,useEffect} from 'react'
import { View, StyleSheet, Text, TextInput, ScrollView, Keyboard, TouchableNativeFeedback, ActivityIndicator, Dimensions, Image, TouchableWithoutFeedback } from 'react-native'
import { useSelector } from 'react-redux'
import HeaderConfig from '../models/HeaderConfig'
import axios from 'axios'
import colors from '../constants/Colors'
const windowHeight = Dimensions.get('window').height

const SearchScreen = (props) => {
    const [search, setSearch] = useState('')
    const userToken = useSelector((state) => (state.user.userToken))
    const displayMode = useSelector((state) => state.user.displayMode)
    const [searchResult, setSearchResult] = useState([])
    const [searchFilter, setSearchFilter] = useState('all')
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState('all')
    const [message, setMessage] = useState('')
    const headers = {
        'Authorization': 'Bearer ' + userToken,
        'Content-Type': 'application/json'
    }
    useEffect(() => {
        props.navigation.setParams({ displayMode })
    }, [displayMode])
    const handleSearch = (text, filter) => {
        switch (filter) {
            case 'all':
                setLoading(true)
                axios({
                    method: 'post',
                    url: `http://192.168.100.5:3000/user/search/${text}`,
                    headers,
                    data: {
                        limit: 'all'
                    }
                }).then((res) => {
                    res.data.resArr.length == 0 ? setMessage("No Results Found") :
                        setMessage('')
                    console.log(res.data.resArr.length)
                    setSearchResult(res.data.resArr)
                    setLoading(false)
                    // res.data.resArr?()=>{setSearchResult(res.data.resArr);setLoading(false)}:console.log("waiting")
                }).catch((e) => {
                    console.log("bug")
                    setLoading(false)
                })
                break
            case 'users':
                setLoading(true)
                axios({
                    method: 'post',
                    url: `http://192.168.100.5:3000/user/search/${text}`,
                    headers,
                    data: {
                        limit: 'users'
                    }
                }).then((res) => {
                    res.data.resArr.length == 0 ? setMessage("No Results Found") :
                        setMessage('')
                    setSearchResult(res.data.resArr)
                    setLoading(false)

                }).catch((e) => {
                    setLoading(false)

                })
                break
            case 'posts':
                setLoading(true)
                axios({
                    method: 'post',
                    url: `http://192.168.100.5:3000/user/search/${text}`,
                    headers,
                    data: {
                        limit: 'posts'
                    }
                }).then((res) => {
                    res.data.resArr.length == 0 ? setMessage("No Results Found") :
                        setMessage('')
                    setSearchResult(res.data.resArr)
                    setLoading(false)

                }).catch((e) => {
                    setLoading(false)

                })
                break
        }
    }
    const resultsFilter = (arr, term) => {
        return term.length > 0 ?
            arr.map((el) => {
                return el.type == 'post' ?
                    <TouchableNativeFeedback key={Math.random()} onPress={() => props.navigation.navigate("searchedPost", { id: el.id,userName:el.userName })}>

                        <View style={styles.resultCont} key={Math.random()}>
                            <Image style={{ ...styles.resultPic, borderRadius: 0 }} source={{ uri: `data:image/jpg;base64,${el.dp}` }} />
                            <View>
                                <Text style={{ fontFamily: 'Lato-Bold', fontSize: 15,color: displayMode == true ?colors.textColorDark:'white'}}>{el.userName}</Text>
                                <Text style={{ fontFamily: 'Lato-Regular', fontSize: 13 ,color: displayMode == true ?colors.textColorDark:'white'}}>{el.name}</Text>
                            </View>
                        </View>
                    </TouchableNativeFeedback> :
                    <TouchableNativeFeedback key={Math.random()} onPress={() => props.navigation.navigate("UserProfile", { id: el.id })}>
                        <View style={styles.resultCont}>
                            {el.dp ?
                                <Image style={{...styles.resultPic,borderWidth:1,
                                    borderColor: colors.headerColor,}} source={{ uri: `data:image/jpg;base64,${el.dp}` }} /> :
                                <Image style={{...styles.resultPic,borderWidth:1,
                                    borderColor: colors.headerColor,}} source={{ uri: 'https://icon-library.com/images/default-user-icon/default-user-icon-8.jpg' }} />
                            }
                            <View>
                                <Text style={{ fontFamily: 'Lato-Bold', fontSize: 15,color: displayMode == true ?colors.textColorDark:'white' }}>{el.name}</Text>
                                <Text style={{ fontFamily: 'Lato-Regular', fontSize: 13,color: displayMode == true ?colors.textColorDark:'white' }}>{el.userName}</Text>
                            </View>
                        </View>
                    </TouchableNativeFeedback>

            }) : <Text></Text>

    }
    const handleFilterChange = (searchFilter1, activeTab, searchResult) => {
        setSearchFilter(searchFilter1)
        setActiveTab(activeTab)
        setSearchResult(searchResult)
        handleSearch(search, searchFilter1)
    }
    return (
        <ScrollView contentContainerStyle={{ alignItems: 'center' }} style={[styles.screen, displayMode == true ? { backgroundColor: colors.backgroundColorDark } : { backgroundColor: colors.backgroundColorLight }]} onPress={Keyboard.dismiss}>

            <TextInput style={styles.searchField} placeholder="Search Fumble ..."
                placeholderTextColor={'#636e72'}
                value={search} onChangeText={(text) => { setSearch(text); handleSearch(text, searchFilter) }} />
            <View style={styles.altSearchCont}>
                <TouchableWithoutFeedback onPress={() => { handleFilterChange('all', 'all', []) }}>
                    <View style={{ ...styles.altSearchButton, backgroundColor: activeTab == 'all' ? colors.headerColor : '#dfe6e9' }}>
                        <Text style={[styles.altText, displayMode == true ? { color: colors.textColorLight } :
                            { color: colors.textColorDark }]}>All</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => { handleFilterChange('users', 'users', []) }}>
                    <View style={{ ...styles.altSearchButton, backgroundColor: activeTab == 'users' ? colors.headerColor : '#dfe6e9' }}>
                        <Text style={[styles.altText, displayMode == true ? { color: colors.textColorLight } :
                            { color: colors.textColorDark }]}>Accounts</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => { handleFilterChange('posts', 'posts', []) }}>
                    <View style={{ ...styles.altSearchButton, backgroundColor: activeTab == 'posts' ? colors.headerColor : '#dfe6e9' }}>
                        <Text style={[styles.fromUserName, displayMode == true ? { color: colors.textColorLight } :
                            { color: colors.textColorDark }]}>Posts</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>

            {loading == true ? <ActivityIndicator size='large' /> :
                resultsFilter(searchResult, search)}
            {message.length > 0 ? <Text style={{color:displayMode==true?"white":'black'}}>No Results found</Text> : <Text></Text>}

        </ScrollView>
    )
}
const styles = StyleSheet.create({
    resultCont: {
        height: (10 / 100) * windowHeight,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        justifyContent: 'flex-start',
        width: '80%'
    },
    resultPic: {
        height: 70,
        width: 70,
        marginRight: 20,
        borderRadius: 100,
        backgroundColor:'white',
        

    },
    screen: {
        flex: 1,

    },
    searchField: {

        borderRadius: 100,
        backgroundColor: '#dfe6e9',
        width: '90%',
        height: (6 / 100) * windowHeight,
        marginTop: (3 / 100) * windowHeight,
        paddingLeft: 20
    },
    altSearchCont: {
        flexDirection: 'row',
        height: (5 / 100) * windowHeight,
        width: '90%',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: (2 / 100) * windowHeight,
    },
    altSearchButton: {
        width: '30%',
        height: '100%',
        backgroundColor: '#dcdde1',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100
    },
    altText: {
        fontFamily: 'Lato-Regular',
        fontSize: 13
    }
})
SearchScreen.navigationOptions = navData => {
    return HeaderConfig(navData, navData.navigation.getParam('displayMode'))
}
export default SearchScreen