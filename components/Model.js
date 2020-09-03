import React, { useState } from 'react'
import {
    View, Text, StyleSheet, TouchableWithoutFeedback, Modal
} from 'react-native'
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

const Model = (props) => {
    return (
        <View style={styles.container}>
            <Modal
                animationType="fade"
                statusBarTranslucent={false}
                transparent={true}
                visible={props.modalVisible}>
                <View style={{ ...styles.container, ...styles.modalBackgroundStyle }}>
                    <View style={styles.innerContainerTransparentStyle}>
                        <Button
                            icon={
                                <Icon
                                    name="ban"
                                    size={17}
                                    color="black"
                                />
                            }
                            type='clear'
                            title="UnFollow"
                            titleStyle={{ color: 'black', marginLeft: 5, fontSize: 18 }}
                        />
                        <Button
                            icon={
                                <Icon
                                    name="microphone-slash"
                                    size={17}
                                    color="black"
                                />
                            }
                            type='clear'
                            title="Mute"
                            titleStyle={{ color: 'black', marginLeft: 5, fontSize: 18 }}
                        />
                        <Button
                            title="close"
                            type="outline"
                            onPress={props.setModalVisible}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
        backgroundColor: '#ecf0f1',
        textAlign: 'right',
    
    },
    innerContainerTransparentStyle: {
        backgroundColor: '#fff',
         padding: 20,
         width:250,
         height:250,
         justifyContent:'center'


    },
    modalBackgroundStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    }
})
export default Model