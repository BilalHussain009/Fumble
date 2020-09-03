import React from 'react'
import { View, Text, TouchableNativeFeedback, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
const CustomButton = (props) => {
    return (

        <TouchableNativeFeedback onPress={props.onPress}>

            <View style={{ backgroundColor: props.backColor, ...styles.button, ...props.button }}>
                {props.iconName?<Ionicons name={props.iconName} size={20} color='white' style={styles.icon}/>:null}
                <Text style={{ ...styles.buttonText, ...props.buttonText }}>{props.children}</Text>
            </View>
        </TouchableNativeFeedback>
    )
}
const styles = StyleSheet.create({
    button: {
        flexDirection:'row',

        paddingVertical: 12,
        
        borderRadius: 25,
        alignItems:'center',
        justifyContent:'center',
        
    },
    buttonText: {
        color: 'white',
        fontFamily: 'Lato-Black',
        fontSize: 18,
        overflow: 'hidden',
        
    },
    icon:{
        marginRight:10
    }
})
export default CustomButton