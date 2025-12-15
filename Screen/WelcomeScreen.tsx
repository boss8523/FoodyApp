import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react' // Removed 'use' import
import { StatusBar } from 'expo-status-bar';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import { useNavigation } from 'expo-router';

export default function WelcomeScreen() {
    // 1. Initialize Shared Values with their *Starting* Animated Value (e.g., 0)
    const ringwidth1 = useSharedValue(0); 
    const ringwidth2 = useSharedValue(0);
    const Navigation=useNavigation();

    useEffect(() => {
        // 2. Set the target (ending) size for the rings
        const targetSize1 = hp(28); // Set a reasonable target size in HP
        const targetSize2 = hp(35);

        // 3. Start the animations inside useEffect, which runs after the initial render
        
        // Animation 1 (Smaller Ring)
        setTimeout(() => {
            // Apply a spring animation to the target size
            ringwidth1.value = withSpring(targetSize1, {
                damping: 10,
                stiffness: 100,
            });
        }, 100);

        // Animation 2 (Larger Ring - delayed)
        setTimeout(() => {
            // Apply a spring animation to the target size
            ringwidth2.value = withSpring(targetSize2, {
                damping: 10,
                stiffness: 100,
            });
        }, 300);
         
        setTimeout(() => {
            Navigation.navigate('Home' as never);
        }, 2500);

    }, []); 
    
   
    return (
        <View style={styles.container}>
            <StatusBar style="light"/>

            {/* Outer Animated Ring (using ringwidth2 which is set to be larger) */}
            <Animated.View style={ {
                width: ringwidth2,
                height: ringwidth2,
                borderRadius: hp(50), 
                backgroundColor:'rgba(255,255,255,0.2)',
                justifyContent:'center',
                alignItems:'center'}}>
                
                {/* Inner Animated Ring (using ringwidth1 which is set to be smaller) */}
                <Animated.View style={{
                    width: ringwidth1,
                    height: ringwidth1,
                    borderRadius: hp(50), 
                    backgroundColor:'rgba(255,255,255,0.3)', 
                    justifyContent:'center',
                    alignItems:'center'
                }}>
                    <Image 
                        source={require('../assets/images/LOGO.jpg')} 
                        style={styles.Logo} 
                    />
                </Animated.View>
            </Animated.View>

            <View style={styles.WelcomeText}>
                <Text style={styles.text}>
                    Foody
                </Text>
                <Text style={styles.text2}>
                    Food recipe at your fingertips  
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#d66925ff',
        gap:hp(10)
    },
    Logo:{
        width:hp(20),
        height:hp(20),
        borderRadius:hp(10),
        borderColor:'rgba(100, 25, 25, 0.5)',
        borderWidth:hp(1)
    },
    WelcomeText:{
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        marginTop:40
    },
    text:{
        color:'white',
        fontSize:hp(7),
        fontWeight:'bold',
        textAlign:'center',
    },
    text2:{
        color:'white',
        fontSize:hp(2),
        fontWeight:'500', // Changed 'medium' to standard RN '500' or string
        textAlign:'center',
        marginTop:30}
})
