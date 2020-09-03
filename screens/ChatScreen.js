import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, TextInput, Button } from 'react-native'
import { useSelector } from 'react-redux'
import socketIOClient from "socket.io-client";


const ChatScreen = (props) => {
    const [socket, setSocket] = useState()
    const userId = useSelector((state) => (state.user.userId))
    useEffect(() => {
        const connectToServer = async () => {
            const socket = await socketIOClient('http://192.168.100.5:3000');
            setSocket(socket)
            socket.emit('join',{username:'bilal',room:'12',id:userId},(error)=>{
                if(error){
                    console.log("error")
                }
            
            })
        }
        connectToServer()
    }, [])
    return (
        <View>

            <TextInput placeholder='Enter message here' value='' />
            <Button title='send Message' />
        </View>
    )
}
const styles = StyleSheet.create({

})
export default ChatScreen